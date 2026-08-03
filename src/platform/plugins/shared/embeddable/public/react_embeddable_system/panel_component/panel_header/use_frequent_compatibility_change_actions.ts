/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { useEffect, useState } from 'react';
import { Subscription, switchMap } from 'rxjs';

import type { Action } from '@kbn/ui-actions-plugin/public';
import { triggers } from '@kbn/ui-actions-plugin/public';
import type { EmbeddableApiContext } from '@kbn/presentation-publishing';
import { uiActions } from '../../../kibana_services';
import type { DefaultPresentationPanelApi, PresentationPanelProps } from '../types';

const disabledNotifications = ['ACTION_FILTERS_NOTIFICATION'];

export const useFrequentCompatibilityChangeActions = <
  ApiType extends DefaultPresentationPanelApi = DefaultPresentationPanelApi
>(
  triggerId: string,
  api: ApiType,
  getActions: PresentationPanelProps['getActions']
) => {
  const [actions, setActions] = useState<Action<EmbeddableApiContext>[]>([]);

  /**
   * Get all actions once on mount of the panel. Any actions that are Frequent Compatibility
   * Change Actions need to be subscribed to so they can change over the lifetime of this panel.
   */
  useEffect(() => {
    let canceled = false;
    const subscriptions = new Subscription();
    const context = { embeddable: api };
    const getTriggerCompatibleActions = getActions ?? uiActions.getTriggerCompatibleActions;
    const getActionsForTrigger = async () => {
      let nextActions: Action<EmbeddableApiContext>[] =
        ((await getTriggerCompatibleActions(
          triggerId,
          context
        )) as Action<EmbeddableApiContext>[]) ?? [];

      const disabledActions = (api.disabledActionIds$?.value ?? []).concat(disabledNotifications);
      nextActions = nextActions.filter((badge) => disabledActions.indexOf(badge.id) === -1);
      return nextActions;
    };

    const handleActionCompatibilityChange = (
      isCompatible: boolean,
      action: Action<EmbeddableApiContext>
    ) => {
      if (canceled) return;
      setActions((currentActions) => {
        const newActions = currentActions?.filter((current) => current.id !== action.id);
        if (isCompatible) return [...newActions, action];
        return newActions;
      });
    };

    (async () => {
      const initialActions = await getActionsForTrigger();
      if (canceled) return;
      setActions(initialActions);

      // subscribe to any frequently changing badge actions
      const frequentlyChangingActions = await uiActions.getFrequentlyChangingActionsForTrigger(
        triggerId,
        context
      );
      if (canceled) return;
      for (const action of frequentlyChangingActions) {
        const compatibilitySubject = action
          .getCompatibilityChangesSubject(context)
          ?.pipe(
            switchMap(async () => {
              return await action.isCompatible({
                ...context,
                trigger: triggers[triggerId],
              });
            })
          )
          .subscribe(async (isCompatible) => {
            handleActionCompatibilityChange(isCompatible, action as Action<EmbeddableApiContext>);
          });
        subscriptions.add(compatibilitySubject);
      }
    })();

    return () => {
      canceled = true;
      subscriptions.unsubscribe();
    };
  }, [triggerId, api, getActions]);

  return actions;
};
