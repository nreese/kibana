/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PluginInitializer } from 'kibana/public';
import { PluginInitializerContext } from 'kibana/public';
import { MapsPlugin, MapsPluginSetup, MapsPluginStart } from './plugin';
import { MapsXPackConfig } from '../config';

export type { MapsPluginSetup, MapsPluginStart };

export const plugin: PluginInitializer<MapsPluginSetup, MapsPluginStart> = (
  initContext: PluginInitializerContext<MapsXPackConfig>
) => {
  // @ts-ignore
  return new MapsPlugin(initContext);
};

export { MAP_SAVED_OBJECT_TYPE } from '../common/constants';

export type { LICENSED_FEATURES } from './licensed_features';

export type { DataRequest } from './classes/util/data_request';

export type { IField } from './classes/fields/field';

export type { ImmutableSourceProperty, ISource, SourceEditorArgs } from './classes/sources/source';

export type {
  BoundsFilters,
  GeoJsonWithMeta,
  IVectorSource,
  SourceTooltipConfig,
} from './classes/sources/vector_source';

export type { LayerWizard, RenderWizardArguments } from './classes/layers/layer_wizard_registry';

export type {
  ITooltipProperty,
  RenderTooltipContentParams,
} from './classes/tooltips/tooltip_property';

export { MapsStartApi } from './api';

export type { MapEmbeddable, MapEmbeddableInput, MapEmbeddableOutput } from './embeddable';

export type { EMSTermJoinConfig, SampleValuesConfig } from './ems_autosuggest';
