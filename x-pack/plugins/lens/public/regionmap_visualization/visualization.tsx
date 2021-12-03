/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { I18nProvider } from '@kbn/i18n-react';
import { render } from 'react-dom';
import { Ast } from '@kbn/interpreter/common';
import { ThemeServiceStart } from 'kibana/public';
import { KibanaThemeProvider } from '../../../../../src/plugins/kibana_react/public';
import { ColorMode } from '../../../../../src/plugins/charts/common';
import { PaletteRegistry } from '../../../../../src/plugins/charts/public';
import { getSuggestions } from './regionmap_suggestions';
import { LensIconChartMetric } from '../assets/chart_metric';
import { Visualization, OperationMetadata, DatasourcePublicAPI } from '../types';
import type { RegionmapConfig, RegionmapState } from '../../common/expressions';
import { layerTypes } from '../../common';

const toExpression = (
  paletteService: PaletteRegistry,
  state: RegionmapState,
  datasourceLayers: Record<string, DatasourcePublicAPI>,
  attributes?: Partial<Omit<RegionmapConfig, keyof RegionmapState>>
): Ast | null => {
  if (!state.accessor) {
    return null;
  }

  /*const [datasource] = Object.values(datasourceLayers);
  const operation = datasource && datasource.getOperationForColumnId(state.accessor);

  const stops = state.palette?.params?.stops || [];
  const isCustomPalette = state.palette?.params?.name === CUSTOM_PALETTE;

  const paletteParams = {
    ...state.palette?.params,
    colors: stops.map(({ color }) => color),
    stops:
      isCustomPalette || state.palette?.params?.rangeMax == null
        ? stops.map(({ stop }) => stop)
        : shiftPalette(
            stops,
            Math.max(state.palette?.params?.rangeMax, ...stops.map(({ stop }) => stop))
          ).map(({ stop }) => stop),
    reverse: false,
  };*/

  return {
    type: 'expression',
    chain: [
      {
        type: 'function',
        function: 'lens_regionmap_chart',
        arguments: {
          title: [attributes?.title || ''],
          description: [attributes?.description || ''],
        },
      },
    ],
  };
};
export const getRegionmapVisualization = ({
  paletteService,
  theme,
}: {
  paletteService: PaletteRegistry;
  theme: ThemeServiceStart;
}): Visualization<RegionmapState> => ({
  id: 'lnsRegionmap',

  visualizationTypes: [
    {
      id: 'lnsRegionmap',
      icon: LensIconChartMetric,
      label: i18n.translate('xpack.lens.regionmap.label', {
        defaultMessage: 'Regionmap',
      }),
      groupLabel: i18n.translate('xpack.lens.metric.groupLabel', {
        defaultMessage: 'Single value',
      }),
      sortPriority: 3,
    },
  ],

  getVisualizationTypeId() {
    return 'lnsRegionmap';
  },

  clearLayer(state) {
    return {
      ...state,
      accessor: undefined,
    };
  },

  getLayerIds(state) {
    return [state.layerId];
  },

  getDescription() {
    return {
      icon: LensIconChartMetric,
      label: i18n.translate('xpack.lens.metric.label', {
        defaultMessage: 'Regionmap',
      }),
    };
  },

  getSuggestions,

  initialize(addNewLayer, state) {
    return (
      state || {
        layerId: addNewLayer(),
        accessor: undefined,
        layerType: layerTypes.DATA,
      }
    );
  },

  getConfiguration(props) {
    return {
      groups: [
        {
          groupId: 'regionmap',
          groupLabel: i18n.translate('xpack.lens.metric.label', { defaultMessage: 'Metric' }),
          layerId: props.state.layerId,
          accessors: props.state.accessor
            ? [
                {
                  columnId: props.state.accessor,
                  triggerIcon: undefined,
                  palette: undefined,
                },
              ]
            : [],
          supportsMoreColumns: !props.state.accessor,
          filterOperations: (op: OperationMetadata) => !op.isBucketed && op.dataType === 'number',
          enableDimensionEditor: true,
          required: true,
        },
      ],
    };
  },

  getSupportedLayers() {
    return [
      {
        type: layerTypes.DATA,
        label: i18n.translate('xpack.lens.metric.addLayer', {
          defaultMessage: 'Add visualization layer',
        }),
      },
    ];
  },

  getLayerType(layerId, state) {
    if (state?.layerId === layerId) {
      return state.layerType;
    }
  },

  toExpression: (state, datasourceLayers, attributes) =>
    toExpression(paletteService, state, datasourceLayers, { ...attributes }),
  toPreviewExpression: (state, datasourceLayers) =>
    toExpression(paletteService, state, datasourceLayers, {}),

  setDimension({ prevState, columnId }) {
    return { ...prevState, accessor: columnId };
  },

  removeDimension({ prevState }) {
    return { ...prevState, accessor: undefined, colorMode: ColorMode.None, palette: undefined };
  },

  renderDimensionEditor(domElement, props) {
    render(
      <KibanaThemeProvider theme$={theme.theme$}>
        <I18nProvider>
          <div>dimension editor</div>
        </I18nProvider>
      </KibanaThemeProvider>,
      domElement
    );
  },

  getErrorMessages(state) {
    // Is it possible to break it?
    return undefined;
  },
});
