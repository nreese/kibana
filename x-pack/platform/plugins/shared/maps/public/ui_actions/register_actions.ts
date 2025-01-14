/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreStart } from '@kbn/core/public';
import type { UiActionsStart } from '@kbn/ui-actions-plugin/public';
import { CONTEXT_MENU_TRIGGER } from '@kbn/embeddable-plugin/public';
import { VISUALIZE_GEO_FIELD_TRIGGER } from '@kbn/ui-actions-plugin/public';
import { ACTION_VISUALIZE_GEO_FIELD } from '@kbn/ui-actions-plugin/public';
import { FILTER_BY_MAP_EXTENT } from './filter_by_map_extent/constants';
import { SYNCHRONIZE_MOVEMENT_ACTION } from './synchronize_movement/constants';

export function registerActions(core: CoreStart, uiActions: UiActionsStart) {
  if (core.application.capabilities.maps.show) {
    uiActions.addTriggerActionAsync(VISUALIZE_GEO_FIELD_TRIGGER, ACTION_VISUALIZE_GEO_FIELD, async () => {
      const { visualizeGeoFieldAction } = await import('./actions_module');
      return visualizeGeoFieldAction;
    });
  }
  uiActions.addTriggerActionAsync(CONTEXT_MENU_TRIGGER, FILTER_BY_MAP_EXTENT, async () => {
    const { filterByMapExtentAction } = await import('./actions_module');
    return filterByMapExtentAction;
  });
  uiActions.addTriggerActionAsync(CONTEXT_MENU_TRIGGER, SYNCHRONIZE_MOVEMENT_ACTION, async () => {
    const { synchronizeMovementAction } = await import('./actions_module');
    return synchronizeMovementAction;
  });
}