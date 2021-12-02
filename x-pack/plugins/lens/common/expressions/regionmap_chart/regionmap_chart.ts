/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { ColorMode } from '../../../../../../src/plugins/charts/common';
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
    accessor: {
      types: ['string'],
      help: i18n.translate('xpack.lens.metric.accessor.help', {
        defaultMessage: 'The column whose value is being displayed',
      }),
    },
    colorMode: {
      types: ['string'],
      default: `"${ColorMode.None}"`,
      options: [ColorMode.None, ColorMode.Labels, ColorMode.Background],
      help: i18n.translate('xpack.lens.metric.colorMode.help', {
        defaultMessage: 'Which part of metric to color',
      }),
    },
    palette: {
      types: ['palette'],
      help: i18n.translate('xpack.lens.metric.palette.help', {
        defaultMessage: 'Provides colors for the values',
      }),
    },
    hideLabels: {
      types: ['boolean'],
      help: '',
    },
    legendDisplay: {
      types: ['string'],
      options: ['default', 'show', 'hide'],
      help: '',
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
