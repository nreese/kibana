/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { SuggestionRequest, VisualizationSuggestion } from '../types';
import type { RegionmapState } from '../../common/expressions';

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
  console.log(emsAutoSuggest);
  console.log(activeData);
  return [];
}