/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import uuid from 'uuid/v4';
import rison from 'rison-node';

import { TimeRange } from 'src/plugins/data/public';
import {
  GIS_API_PATH,
  MVT_GET_XY_TILE_API_PATH,
  MVT_SOURCE_LAYER_NAME,
  SCALING_TYPES,
  SOURCE_TYPES,
  VECTOR_SHAPE_TYPE,
} from '../../../../common/constants';
import { AbstractESSource } from '../es_source';
import { registerSource } from '../source_registry';
import { Domain, MapQuery } from '../../../../common/descriptor_types';
import { getDocValueAndSourceFields } from '../es_search_source/es_search_source';
import { loadIndexSettings } from '../es_search_source/load_index_settings';
import { getHttp, getSearchService } from '../../../kibana_services';
import { ESDocField } from '../../fields/es_doc_field';

export class XYDocumentSource extends AbstractESSource {
  static type = SOURCE_TYPES.XY_DOCUMENT;

  static createDescriptor(descriptor: Partial<XYDocumentSourceDescriptor>) {
    return {
      ...descriptor,
      id: descriptor.id ? descriptor.id : uuid(),
      type: XYDocumentSource.type,
      tooltipProperties: descriptor.tooltipProperties
        ? descriptor.tooltipProperties
        : [descriptor.xAxisField, descriptor.yAxisField],
    };
  }

  constructor(descriptor, inspectorAdapters) {
    super(descriptor, inspectorAdapters);

    this._tooltipFields = this._descriptor.tooltipProperties.map((property) =>
      this.createField({ fieldName: property })
    );
  }

  isFilterByMapBounds() {
    return false;
  }

  async getFields() {
    try {
      const indexPattern = await this.getIndexPattern();
      return indexPattern.fields
        .filter((field) => {
          // Ensure fielddata is enabled for field.
          // Search does not request _source
          return field.aggregatable;
        })
        .map((field) => {
          return this.createField({ fieldName: field.name });
        });
    } catch (error) {
      // failed index-pattern retrieval will show up as error-message in the layer-toc-entry
      return [];
    }
  }

  createField({ fieldName }) {
    return new ESDocField({
      fieldName,
      source: this,
      canReadFromGeoJson: false,
    });
  }

  getFieldNames() {
    return [this._descriptor.xAxisField, this._descriptor.yAxisField];
  }

  getLayerName() {
    return MVT_SOURCE_LAYER_NAME;
  }

  async getSupportedShapeTypes(): Promise<VECTOR_SHAPE_TYPE[]> {
    return [VECTOR_SHAPE_TYPE.POINT];
  }

  getGeoJsonWithMeta(): Promise<GeoJsonWithMeta> {
    // Having this method here is a consequence of ITiledSingleLayerVectorSource extending IVectorSource.
    throw new Error('Does not implement getGeoJsonWithMeta');
  }

  async getUrlTemplateWithMeta(searchFilters) {
    const indexPattern = await this.getIndexPattern();
    const indexSettings = await loadIndexSettings(indexPattern.title);

    const { docValueFields, sourceOnlyFields } = getDocValueAndSourceFields(
      indexPattern,
      searchFilters.fieldNames
    );

    const initialSearchContext = { docvalue_fields: docValueFields }; // Request fields in docvalue_fields insted of _source

    const searchSource = await this.makeSearchSource(
      searchFilters,
      indexSettings.maxResultWindow,
      initialSearchContext
    );
    searchSource.setField('fields', searchFilters.fieldNames); // Setting "fields" filters out unused scripted fields
    if (sourceOnlyFields.length === 0) {
      searchSource.setField('source', false); // do not need anything from _source
    } else {
      searchSource.setField('source', sourceOnlyFields);
    }
    /* if (this._hasSort()) {
      searchSource.setField('sort', this._buildEsSort());
    }*/

    const dsl = await searchSource.getSearchRequestBody();
    const risonDsl = rison.encode(dsl);

    const mvtUrlServicePath = getHttp().basePath.prepend(
      `/${GIS_API_PATH}/${MVT_GET_XY_TILE_API_PATH}`
    );

    const xAxisField = indexPattern.getFieldByName(this._descriptor.xAxisField);
    const isXAxisDate = xAxisField ? xAxisField.type === 'date' : false;

    const yAxisField = indexPattern.getFieldByName(this._descriptor.yAxisField);
    const isYAxisDate = yAxisField ? yAxisField.type === 'date' : false;

    const urlTemplate = `${mvtUrlServicePath}
?x={x}
&y={y}
&z={z}
&minLon=${searchFilters.domainGeoRange.minLon}
&maxLon=${searchFilters.domainGeoRange.maxLon}
&minLat=${searchFilters.domainGeoRange.minLat}
&maxLat=${searchFilters.domainGeoRange.maxLat}
&xAxisField=${this._descriptor.xAxisField}
&isXAxisDate=${isXAxisDate}
&xMin=${searchFilters.domain.xAxis.min}
&xMax=${searchFilters.domain.xAxis.max}
&yAxisField=${this._descriptor.yAxisField}
&isYAxisDate=${isYAxisDate}
&yMin=${searchFilters.domain.yAxis.min}
&yMax=${searchFilters.domain.yAxis.max}
&index=${indexPattern.title}
&requestBody=${risonDsl}`;
    return {
      layerName: this.getLayerName(),
      minSourceZoom: this.getMinZoom(),
      maxSourceZoom: this.getMaxZoom(),
      urlTemplate,
    };
  }

  async getDomain({
    layerName,
    sourceQuery,
    timeFilters,
    registerCancelCallback,
  }: {
    layerName: string;
    sourceQuery: MapQuery;
    timeFilters: TimeRange;
    registerCancelCallback: (callback: () => void) => void;
  }) {
    const searchSource = await this.makeSearchSource(
      {
        applyGlobalQuery: true,
        query: sourceQuery,
        filters: [],
        timeFilters,
      }, // searchFilters
      0, // limit
      {} // initialSearchContext
    );
    searchSource.setField('aggs', {
      xMin: {
        min: {
          field: this._descriptor.xAxisField,
        },
      },
      xMax: {
        max: {
          field: this._descriptor.xAxisField,
        },
      },
      yMin: {
        min: {
          field: this._descriptor.yAxisField,
        },
      },
      yMax: {
        max: {
          field: this._descriptor.yAxisField,
        },
      },
    });

    const resp = await this._runEsQuery({
      requestId: this.getId(),
      requestName: `${layerName} domain request`,
      searchSource,
      registerCancelCallback,
      requestDescription: 'domain request',
    });

    return {
      xAxis: {
        min: resp.aggregations.xMin.value,
        max: resp.aggregations.xMax.value,
      },
      yAxis: {
        min: resp.aggregations.yMin.value,
        max: resp.aggregations.yMax.value,
      },
    };
  }

  canFormatFeatureProperties() {
    return this._tooltipFields.length > 0;
  }

  async _loadTooltipProperties(docId, index, indexPattern) {
    if (this._tooltipFields.length === 0) {
      return {};
    }

    const searchService = getSearchService();
    const searchSource = searchService.searchSource.createEmpty();

    searchSource.setField('index', indexPattern);
    searchSource.setField('size', 1);

    const query = {
      language: 'kuery',
      query: `_id:"${docId}" and _index:"${index}"`,
    };

    searchSource.setField('query', query);
    searchSource.setField('fields', this._getTooltipPropertyNames());

    const resp = await searchSource.fetch();

    const hit = _.get(resp, 'hits.hits[0]');
    if (!hit) {
      throw new Error(
        i18n.translate('xpack.maps.source.esSearch.loadTooltipPropertiesErrorMsg', {
          defaultMessage: 'Unable to find document, _id: {docId}',
          values: { docId },
        })
      );
    }

    const properties = indexPattern.flattenHit(hit);
    indexPattern.metaFields.forEach((metaField) => {
      if (!this._getTooltipPropertyNames().includes(metaField)) {
        delete properties[metaField];
      }
    });
    return properties;
  }

  async getTooltipProperties(properties) {
    const indexPattern = await this.getIndexPattern();
    const propertyValues = await this._loadTooltipProperties(
      properties._id,
      properties._index,
      indexPattern
    );
    const tooltipProperties = this._tooltipFields.map((field) => {
      const value = propertyValues[field.getName()];
      return field.createTooltipProperty(value);
    });
    return Promise.all(tooltipProperties);
  }
}

registerSource({
  ConstructorFunction: XYDocumentSource,
  type: SOURCE_TYPES.XY_DOCUMENT,
});
