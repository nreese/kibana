/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { LayerType } from '../../types';

export interface RegionmapState {
  layerId: string;
  layerType: LayerType;
  emsLayerId: string;
  emsField: string;
  accessor: string;
}

export interface RegionmapConfig extends RegionmapState {
  title: string;
  description: string;
}
