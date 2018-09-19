/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import _ from 'lodash';
import React, { Fragment } from 'react';

import {
  EuiButton,
  EuiSelect
} from '@elastic/eui';

import { ASource } from './source';
import { GeohashGridLayer } from '../geohashgrid_layer';
import { GIS_API_PATH } from '../../../../common/constants';
import { IndexPatternSelect } from './index_pattern_select';
import { SingleFieldSelect } from './single_field_select';
import { indexPatternService } from '../../../kibana_services';

export class ESSearchSource extends ASource {

  static type = 'ES_GEOHASH_GRID';

  static createDescriptor({ esIndexPattern, pointField }) {
    return {
      type: ESGeohashGridSource.type,
      esIndexPattern: esIndexPattern,
      pointField: pointField
    };
  }

  static renderEditor({ onPreviewSource, dataSourcesMeta }) {
    return (<Editor/>);
  }

  renderDetails() {
    return (
      <Fragment>
        <div>
          <span className="bold">Type: </span><span>Geohash grid (todo, use icon)</span>
        </div>
        <div>
          <span className="bold">Index pattern: </span><span>{this._descriptor.esIndexPattern}</span>
        </div>
        <div>
          <span className="bold">Point field: </span><span>{this._descriptor.pointField}</span>
        </div>
      </Fragment>
    );
  }

  async getGeoJsonPointsWithTotalCount(precision, extent) {
    try {
      let url = `../${GIS_API_PATH}/data/geohash_grid`;
      url += `?index_pattern=${encodeURIComponent(this._descriptor.esIndexPattern)}`;
      url += `&geo_point_field=${encodeURIComponent(this._descriptor.pointField)}`;
      url += `&precision=${precision}`;
      url += `&minlon=${extent[0]}`;
      url += `&maxlon=${extent[2]}`;
      url += `&minlat=${extent[1]}`;
      url += `&maxlat=${extent[3]}`;
      const data = await fetch(url);
      return data.json();
    } catch (e) {
      console.error('Cant load data', e);
      return { type: 'FeatureCollection', features: [] };
    }
  }

  _createDefaultLayerDescriptor(options) {
    return GeohashGridLayer.createDescriptor({
      sourceDescriptor: this._descriptor,
      ...options
    });
  }

  createDefaultLayer(options) {
    return new GeohashGridLayer({
      layerDescriptor: this._createDefaultLayerDescriptor(options),
      source: this
    });
  }

  getDisplayName() {
    return this._descriptor.esIndexPattern + ' grid';
  }


}

class Editor extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoadingIndexPattern: false,
      indexPatternId: '',
      geoField: '',
      selectedFields: [],
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadIndexPattern(this.state.indexPatternId);
  }

  onIndexPatternSelect = (indexPatternId) => {
    this.setState({
      indexPatternId,
    }, this.loadIndexPattern(indexPatternId));
  };

  loadIndexPattern = (indexPatternId) => {
    this.setState({
      isLoadingIndexPattern: true,
      indexPattern: undefined,
      geoField: undefined,
    }, this.debouncedLoad.bind(null, indexPatternId));
  }

  debouncedLoad = _.debounce(async (indexPatternId) => {
    if (!indexPatternId || indexPatternId.length === 0) {
      return;
    }

    let indexPattern;
    try {
      indexPattern = await indexPatternService.get(indexPatternId);
    } catch (err) {
      // index pattern no longer exists
      return;
    }

    console.log(indexPattern);

    if (!this._isMounted) {
      return;
    }

    // props.indexPatternId may be updated before getIndexPattern returns
    // ignore response when fetched index pattern does not match active index pattern
    if (indexPattern.id !== indexPatternId) {
      return;
    }
    console.log(indexPattern);

    this.setState({
      isLoadingIndexPattern: false,
      indexPattern: indexPattern
    });
  }, 300);

  onGeoFieldSelect = (geoField) => {
    this.setState({ geoField });
  };

  filterGeoField = (field) => {
    return ['geo_point', 'geo_shape'].includes(field.type);
  }

  render() {
    return (
      <Fragment>
        <IndexPatternSelect
          indexPatternId={this.state.indexPatternId}
          onChange={this.onIndexPatternSelect}
          placeholder="Select index pattern"
        />
        <SingleFieldSelect
          placeholder="Select geo field"
          value={this.state.geoField}
          onChange={this.onGeoFieldSelect}
          filterField={this.filterGeoField}
          fields={this.state.indexPattern ? this.state.indexPattern.fields : undefined}
        />
      </Fragment>
    );
  }


}
