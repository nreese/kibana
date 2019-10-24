/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { render } from 'react-dom';
import { I18nProvider } from '@kbn/i18n/react';
import { i18n } from '@kbn/i18n';
import { Ast } from '@kbn/interpreter/target/common';
import { State, PersistableState } from './types';
import { getSuggestions } from './map_suggestions';
import { Visualization, FramePublicAPI } from '../types';
import { generateId } from '../id_generator';
import chartMetricSVG from '../assets/chart_metric.svg';

const toExpression = (
  state: State,
  frame: FramePublicAPI,
  mode: 'reduced' | 'full' = 'full'
): Ast => {
  const [datasource] = Object.values(frame.datasourceLayers);
  const operation = datasource && datasource.getOperationForColumnId(state.accessor);

  return {
    type: 'expression',
    chain: [
      {
        type: 'function',
        function: 'lens_map_chart',
        arguments: {
          title: [(operation && operation.label) || ''],
          accessor: [state.accessor],
          mode: [mode],
        },
      },
    ],
  };
};

export const mapVisualization: Visualization<State, PersistableState> = {
  id: 'lnsMap',

  visualizationTypes: [
    {
      id: 'lnsMap',
      icon: 'gisApp',
      largeIcon: chartMetricSVG,
      label: i18n.translate('xpack.lens.map.label', {
        defaultMessage: 'Map',
      }),
    },
  ],

  getDescription() {
    return {
      icon: chartMetricSVG,
      label: i18n.translate('xpack.lens.map.label', {
        defaultMessage: 'Map',
      }),
    };
  },

  getSuggestions,

  initialize(frame, state) {
    return (
      state || {
        layerId: frame.addNewLayer(),
        accessor: generateId(),
      }
    );
  },

  getPersistableState: state => state,

  renderConfigPanel: (domElement, props) =>
    render(
      <I18nProvider>
        <div>Map config panel</div>
      </I18nProvider>,
      domElement
    ),

  toExpression,
  toPreviewExpression: (state: State, frame: FramePublicAPI) =>
    toExpression(state, frame, 'reduced'),
};
