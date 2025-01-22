/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup } from '@kbn/core/public';
import { CONTEXT_MENU_TRIGGER } from '@kbn/embeddable-plugin/public';
import { CREATE_PATTERN_ANALYSIS_TO_ML_AD_JOB_TRIGGER } from '@kbn/ml-ui-actions';
import { type UiActionsSetup, ADD_PANEL_TRIGGER } from '@kbn/ui-actions-plugin/public';
import type { MlPluginStart, MlStartDependencies } from '../plugin';
import { createApplyEntityFieldFiltersAction } from './apply_entity_filters_action';
import { createClearSelectionAction } from './clear_selection_action';
import { createAddSwimlanePanelAction } from './create_swim_lane';
import { createAddSingleMetricViewerPanelAction } from './create_single_metric_viewer';
import {
  createCategorizationADJobAction,
  createCategorizationADJobTrigger,
} from './open_create_categorization_job_action';
import { createVisToADJobAction } from './open_vis_in_ml_action';
import {
  entityFieldSelectionTrigger,
  EXPLORER_ENTITY_FIELD_SELECTION_TRIGGER,
  SWIM_LANE_SELECTION_TRIGGER,
  swimLaneSelectionTrigger,
  smvEntityFieldSelectionTrigger,
  SINGLE_METRIC_VIEWER_ENTITY_FIELD_SELECTION_TRIGGER,
} from './triggers';
import { createAddAnomalyChartsPanelAction } from './create_anomaly_chart';
export { CREATE_LENS_VIS_TO_ML_AD_JOB_ACTION } from './open_vis_in_ml_action';
export { SWIM_LANE_SELECTION_TRIGGER };
import { APPLY_INFLUENCER_FILTERS_ACTION, APPLY_TIME_RANGE_SELECTION_ACTION, CONTROLLED_BY_SINGLE_METRIC_VIEWER_FILTER, OPEN_IN_ANOMALY_EXPLORER_ACTION, OPEN_IN_SINGLE_METRIC_VIEWER_ACTION } from './constants';
/**
 * Register ML UI actions
 */
export function registerMlUiActions(
  uiActions: UiActionsSetup,
  core: CoreSetup<MlStartDependencies, MlPluginStart>
) {
  // Initialize actions
  const addSingleMetricViewerPanelAction = createAddSingleMetricViewerPanelAction(
    core.getStartServices
  );
  const addSwimlanePanelAction = createAddSwimlanePanelAction(core.getStartServices);
  const applyEntityFieldFilterAction = createApplyEntityFieldFiltersAction(core.getStartServices);
  const smvApplyEntityFieldFilterAction = createApplyEntityFieldFiltersAction(
    core.getStartServices,
    CONTROLLED_BY_SINGLE_METRIC_VIEWER_FILTER
  );
  const clearSelectionAction = createClearSelectionAction(core.getStartServices);
  const visToAdJobAction = createVisToADJobAction(core.getStartServices);
  const categorizationADJobAction = createCategorizationADJobAction(core.getStartServices);

  const addAnomalyChartsPanelAction = createAddAnomalyChartsPanelAction(core.getStartServices);

  // Register actions
  uiActions.registerAction(applyEntityFieldFilterAction);
  uiActions.registerAction(smvApplyEntityFieldFilterAction);
  uiActions.registerAction(categorizationADJobAction);
  uiActions.registerAction(addAnomalyChartsPanelAction);

  // Assign triggers
  uiActions.addTriggerAction(ADD_PANEL_TRIGGER, addSingleMetricViewerPanelAction);
  uiActions.addTriggerAction(ADD_PANEL_TRIGGER, addSwimlanePanelAction);
  uiActions.addTriggerAction(ADD_PANEL_TRIGGER, addAnomalyChartsPanelAction);

  uiActions.addTriggerActionAsync(CONTEXT_MENU_TRIGGER, OPEN_IN_ANOMALY_EXPLORER_ACTION, async () => {
    const { createOpenInExplorerAction } = await import('./context_menu_actions_module');
    return createOpenInExplorerAction(core.getStartServices);
  });
  uiActions.addTriggerActionAsync(CONTEXT_MENU_TRIGGER, OPEN_IN_SINGLE_METRIC_VIEWER_ACTION, async () => {
    const { createOpenInSingleMetricViewerAction } = await import('./context_menu_actions_module');
    return createOpenInSingleMetricViewerAction(core.getStartServices);
  });

  uiActions.registerTrigger(swimLaneSelectionTrigger);
  uiActions.registerTrigger(entityFieldSelectionTrigger);
  uiActions.registerTrigger(smvEntityFieldSelectionTrigger);
  uiActions.registerTrigger(createCategorizationADJobTrigger);

  uiActions.addTriggerActionAsync(SWIM_LANE_SELECTION_TRIGGER, APPLY_INFLUENCER_FILTERS_ACTION, async () => {
    const { createApplyInfluencerFiltersAction } = await import('../embeddables/anomaly_swimlane/swimlane_module');
    return createApplyInfluencerFiltersAction(core.getStartServices);
  });
  uiActions.addTriggerActionAsync(SWIM_LANE_SELECTION_TRIGGER, APPLY_TIME_RANGE_SELECTION_ACTION, async () => {
    const { createApplyTimeRangeSelectionAction } = await import('../embeddables/anomaly_swimlane/swimlane_module');
    return createApplyTimeRangeSelectionAction(core.getStartServices);
  });
  uiActions.addTriggerActionAsync(SWIM_LANE_SELECTION_TRIGGER, OPEN_IN_ANOMALY_EXPLORER_ACTION, async () => {
    const { createOpenInExplorerAction } = await import('./context_menu_actions_module');
    return createOpenInExplorerAction(core.getStartServices);
  });
  uiActions.addTriggerActionAsync(SWIM_LANE_SELECTION_TRIGGER, OPEN_IN_SINGLE_METRIC_VIEWER_ACTION, async () => {
    const { createOpenInSingleMetricViewerAction } = await import('./context_menu_actions_module');
    return createOpenInSingleMetricViewerAction(core.getStartServices);
  });
  uiActions.addTriggerAction(SWIM_LANE_SELECTION_TRIGGER, clearSelectionAction);
  uiActions.addTriggerAction(EXPLORER_ENTITY_FIELD_SELECTION_TRIGGER, applyEntityFieldFilterAction);
  uiActions.addTriggerAction(
    SINGLE_METRIC_VIEWER_ENTITY_FIELD_SELECTION_TRIGGER,
    smvApplyEntityFieldFilterAction
  );
  uiActions.addTriggerAction(CONTEXT_MENU_TRIGGER, visToAdJobAction);
  uiActions.addTriggerAction(
    CREATE_PATTERN_ANALYSIS_TO_ML_AD_JOB_TRIGGER,
    categorizationADJobAction
  );
}
