/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { partition } from 'lodash';
import { i18n } from '@kbn/i18n';
import { SuggestionRequest, VisualizationSuggestion } from '../types';
import type { RegionmapState } from '../../common/expressions';
import { RegionmapChartIcon } from './regionmap_chart_icon';

/**
 * Generate suggestions for the regionmap chart.
 *
 * @param opts
 */
export function getSuggestions({
  table,
  state,
  keptLayerIds,
  activeData,
}: SuggestionRequest<RegionmapState>,
emsAutoSuggest: (sampleValuesConfig: SampleValuesConfig) => unknown): Array<VisualizationSuggestion<RegionmapState>> {
  if (!activeData) {
    return [];
  }

  const [buckets, metrics] = partition(table.columns, (col) => col.operation.isBucketed);

  const suggestions: Array<VisualizationSuggestion<RegionmapState>> = [];
  buckets
    .filter((col) => {
      return col.operation.dataType === 'string';
    })
    .forEach(bucket => {
      const sampleValues: string[] = [];
      for (const key in activeData) {
        const dataTable = activeData[key];
        dataTable.rows.forEach(row => {
          const value = row[bucket.columnId];
          if (value && value !== '__other__' && !sampleValues.includes(value)) {
            sampleValues.push(value);
          }
        });
      }

      const emsSuggestion = emsAutoSuggest({ sampleValues });
      if (emsSuggestion) {
        metrics.forEach(metric => {
          suggestions.push({
            title: i18n.translate('xpack.lens.regionmap.suggestionLabel', {
              defaultMessage: '{emsLayerLabel} by {metricLabel}',
              values: {
                emsLayerLabel: emsSuggestion.displayName,
                metricLabel: metric.operation.label.toLowerCase(),
              },
            }),
            score: 0.5,
            state: {
              emsLayerId: emsSuggestion.layerId,
              emsField: emsSuggestion.field,
              metricColId: metric.columnId,
              bucketColId: bucket.columnId,
            },
            previewIcon: RegionmapChartIcon,
          });
        });
      }
    });

  return suggestions;
}