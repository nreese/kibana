/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { i18n } from '@kbn/i18n';
import { asyncForEach } from '@kbn/std';
import { Action } from '@kbn/ui-actions-plugin/public';
import { EmbeddableApiContext } from '@kbn/presentation-publishing';
import { CONTEXT_MENU_TRIGGER } from './lib';
import { uiActions } from './kibana_services';

const registry: Map<string, () => Promise<Action<EmbeddableApiContext>>> = new Map();

export const registerContextMenuAction = (actionId: string, getAction: () => Promise<Action<EmbeddableApiContext>>) => {
  if (registry.has(actionId)) {
    throw new Error(
      i18n.translate('embeddableApi.contextMenuActionRegistry.keyAlreadyExistsError', {
        defaultMessage: `Action {actionId} already exists in the registry.`,
        values: { actionId },
      })
    );
  }

  registry.set(actionId, getAction);
};

export async function getCompatableContextMenuActions(context: EmbeddableApiContext) {
  const actions: Array<Action<EmbeddableApiContext>> = [];
  await asyncForEach([...registry.values()], async (getAction) => {
    const action = await getAction();
    const isCompatable = await action.isCompatible({
      ...context,
      trigger: { id: CONTEXT_MENU_TRIGGER }
    });
    if (isCompatable) actions.push(action);
  });

  return [
    ...actions,
    ...(await uiActions.getTriggerCompatibleActions(CONTEXT_MENU_TRIGGER, context))
  ];
};
