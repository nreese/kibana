/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import type { ExpressionFunctionDefinition } from '../../../../../../src/plugins/expressions/common';
import type { LensMultiTable } from '../../types';
import type { RegionmapConfig } from './types';

interface RegionmapRender {
  type: 'render';
  as: 'lens_regionmap_chart_renderer';
  value: RegionmapChartProps;
}

export interface RegionmapChartProps {
  data: LensMultiTable;
  args: RegionmapConfig;
}

export const regionmapChart: ExpressionFunctionDefinition<
  'lens_regionmap_chart',
  LensMultiTable,
  Omit<RegionmapConfig, 'layerId' | 'layerType'>,
  RegionmapRender
> = {
  name: 'lens_regionmap_chart',
  type: 'render',
  help: 'A regionmap chart',
  args: {
    title: {
      types: ['string'],
      help: i18n.translate('xpack.lens.metric.title.help', {
        defaultMessage: 'The chart title.',
      }),
    },
    description: {
      types: ['string'],
      help: '',
    },
    emsField: {
      types: ['string'],
      help: 'emsField',
    },
    emsLayerId: {
      types: ['string'],
      help: 'emsLayerId',
    },
    bucketColumnId: {
      types: ['string'],
      help: 'bucketColumnId',
    },
    metricColumnId: {
      types: ['string'],
      help: 'metricColumnId',
    },
  },
  inputTypes: ['lens_multitable'],
  fn(data, args) {
    return {
      type: 'render',
      as: 'lens_regionmap_chart_renderer',
      value: {
        data,
        args,
      },
    } as RegionmapRender;
  },
};
