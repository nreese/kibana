/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  ColorMode,
  CustomPaletteState,
  PaletteOutput,
} from '../../../../../../src/plugins/charts/common';
import { CustomPaletteParams, LayerType } from '../../types';

export interface RegionmapState {
  layerId: string;
  accessor?: string;
  layerType: LayerType;
  colorMode?: ColorMode;
  palette?: PaletteOutput<CustomPaletteParams>;
  hideLabels: boolean;
  legendDisplay: 'default' | 'show' | 'hide';
}

export interface RegionmapConfig extends Omit<RegionmapState, 'palette' | 'colorMode'> {
  title: string;
  description: string;
  metricTitle: string;
  mode: 'reduced' | 'full';
  colorMode: ColorMode;
  palette: PaletteOutput<CustomPaletteState>;
}
