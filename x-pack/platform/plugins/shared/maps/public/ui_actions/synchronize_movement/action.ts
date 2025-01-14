/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { type EmbeddableApiContext, apiIsOfType } from '@kbn/presentation-publishing';
import { createAction } from '@kbn/ui-actions-plugin/public';
import { apiHasVisualizeConfig } from '@kbn/visualizations-plugin/public';
import { isLensApi } from '@kbn/lens-plugin/public';
import { MAP_SAVED_OBJECT_TYPE } from '../../../common/constants';
import { isLegacyMapApi } from '../../legacy_visualizations/is_legacy_map';
import { mapEmbeddablesSingleton } from '../../react_embeddable/map_embeddables_singleton';
import { SYNCHRONIZE_MOVEMENT_ACTION } from './constants';

export const synchronizeMovementAction = createAction<EmbeddableApiContext>({
  id: SYNCHRONIZE_MOVEMENT_ACTION,
  type: SYNCHRONIZE_MOVEMENT_ACTION,
  order: 21,
  getDisplayName: () => {
    return i18n.translate('xpack.maps.synchronizeMovementAction.title', {
      defaultMessage: 'Synchronize map movement',
    });
  },
  getDisplayNameTooltip: () => {
    return i18n.translate('xpack.maps.synchronizeMovementAction.tooltipContent', {
      defaultMessage:
        'Synchronize maps, so that if you zoom and pan in one map, the movement is reflected in other maps',
    });
  },
  getIconType: () => {
    return 'crosshairs';
  },
  isCompatible: async ({ embeddable }: EmbeddableApiContext) => {
    if (!mapEmbeddablesSingleton.hasMultipleMaps()) {
      return false;
    }
    return (
      apiIsOfType(embeddable, MAP_SAVED_OBJECT_TYPE) ||
      (isLensApi(embeddable) && embeddable.getSavedVis()?.visualizationType === 'lnsChoropleth') ||
      (apiHasVisualizeConfig(embeddable) && isLegacyMapApi(embeddable))
    );
  },
  execute: async () => {
    const { openModal } = await import('./modal');
    openModal();
  },
});
