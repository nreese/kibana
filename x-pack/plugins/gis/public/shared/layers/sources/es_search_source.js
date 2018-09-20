/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import {
  EuiButton,
  EuiSelect
} from '@elastic/eui';

import { ASource } from './source';
import { GeohashGridLayer } from '../geohashgrid_layer';
import { IndexPatternSelect } from './index_pattern_select';
import { SingleFieldSelect } from './single_field_select';
import { indexPatternService, SearchSource } from '../../../kibana_services';
import { VectorLayer } from '../vector_layer';

export class ESSearchSource extends ASource {

  static type = 'ES_SEARCH';

  static renderEditor({ onPreviewSource }) {
    const onSelect = (layerConfig) => {
      const layerSource = new ESSearchSource(layerConfig);
      onPreviewSource(layerSource);
    };

    return (<Editor onSelect={onSelect}/>);
  }

  constructor(descriptor) {
    super({ type: ESSearchSource.type, ...descriptor });
  }

  renderDetails() {
    return (
      <Fragment>
        <div>
          <span className="bold">Type: </span><span>Elasticsearch document</span>
        </div>
        <div>
          <span className="bold">Index pattern: </span><span>{this._descriptor.indexPatternId}</span>
        </div>
        <div>
          <span className="bold">Geo field: </span><span>{this._descriptor.geoField}</span>
        </div>
      </Fragment>
    );
  }

  async getGeoJson(precision, extent) {
    let indexPattern;
    try {
      indexPattern = await indexPatternService.get(this._descriptor.indexPatternId);
    } catch (err) {
      // TODO dispatch action to set error state in store
      return { type: 'FeatureCollection', features: [] };
    }

    const searchSource = new SearchSource();
    searchSource.setField('index', indexPattern);
    searchSource.setField('size', 10);

    let resp;
    try {
      resp = await searchSource.fetch();
    } catch(error) {
      // TODO dispatch action to set error state in store
      return { type: 'FeatureCollection', features: [] };
    }

    console.log('resp', resp);

    return { type: 'FeatureCollection', features: [] };
  }

  createDefaultLayer(options) {
    return new VectorLayer({
      layerDescriptor: VectorLayer.createDescriptor({
        sourceDescriptor: this._descriptor,
        ...options
      }),
      source: this
    });
  }

  getDisplayName() {
    return 'search source';
  }
}

class Editor extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
  }

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

    this.setState({
      isLoadingIndexPattern: false,
      indexPattern: indexPattern
    });
  }, 300);

  onGeoFieldSelect = (geoField) => {
    this.setState({
      geoField
    }, this.previewLayer);
  };

  previewLayer = () => {
    const {
      indexPatternId,
      geoField,
    } = this.state;
    if (indexPatternId && geoField) {
      this.props.onSelect({
        indexPatternId,
        geoField,
      });
    }
  }

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
