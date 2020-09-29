/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import uuid from 'uuid/v4';
import { TimeRange } from 'src/plugins/data/public';
import { SOURCE_TYPES } from '../../../../common/constants';
import { AbstractESSource } from '../es_source';
import { registerSource } from '../source_registry';
import { Domain, MapQuery } from '../../../../common/descriptor_types';

export class XYDocumentSource extends AbstractESSource {
  static type = SOURCE_TYPES.XY_DOCUMENT;

  static createDescriptor(descriptor: Partial<XYDocumentSourceDescriptor>) {
    return {
      ...descriptor,
      id: descriptor.id ? descriptor.id : uuid(),
      type: XYDocumentSource.type,
    };
  }

  isFilterByMapBounds() {
    return false;
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
}

registerSource({
  ConstructorFunction: XYDocumentSource,
  type: SOURCE_TYPES.XY_DOCUMENT,
});
