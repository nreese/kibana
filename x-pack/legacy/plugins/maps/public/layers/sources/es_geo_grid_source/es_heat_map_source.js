/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import uuid from 'uuid/v4';

import { ESGeoGridSource } from './es_geo_grid_source';
import { HeatmapLayer } from '../../heatmap_layer';
import { CreateSourceEditor } from './create_source_editor';
import { UpdateSourceEditor } from './update_source_editor';
import { GRID_RESOLUTION } from '../../grid_resolution';
import { ES_HEAT_MAP } from '../../../../common/constants';
import { i18n } from '@kbn/i18n';

export class ESHeatMapSource extends ESGeoGridSource {
  static type = ES_HEAT_MAP;
  static title = i18n.translate('xpack.maps.source.esHeatmapTitle', {
    defaultMessage: 'Heat map',
  });
  static description = i18n.translate('xpack.maps.source.esHeatmapDescription', {
    defaultMessage: 'Geospatial data grouped in grids to show density.',
  });

  static createDescriptor({ indexPatternId, geoField, resolution }) {
    return {
      type: ESGeoGridSource.type,
      id: uuid(),
      indexPatternId,
      geoField,
      resolution: resolution ? resolution : GRID_RESOLUTION.COARSE,
    };
  }

  static renderEditor({ onPreviewSource, inspectorAdapters }) {
    const onSourceConfigChange = sourceConfig => {
      if (!sourceConfig) {
        onPreviewSource(null);
        return;
      }

      const sourceDescriptor = ESHeatMapSource.createDescriptor(sourceConfig);
      const source = new ESHeatMapSource(sourceDescriptor, inspectorAdapters);
      onPreviewSource(source);
    };

    return <CreateSourceEditor onSourceConfigChange={onSourceConfigChange} />;
  }

  renderSourceSettingsEditor({ onChange }) {
    return (
      <UpdateSourceEditor
        isHeatmap
        indexPatternId={this._descriptor.indexPatternId}
        onChange={onChange}
        metrics={this._descriptor.metrics}
        resolution={this._descriptor.resolution}
      />
    );
  }

  createDefaultLayer(options) {
    return new HeatmapLayer({
      layerDescriptor: HeatmapLayer.createDescriptor({
        sourceDescriptor: this._descriptor,
        ...options,
      }),
      source: this,
    });
  }
}
