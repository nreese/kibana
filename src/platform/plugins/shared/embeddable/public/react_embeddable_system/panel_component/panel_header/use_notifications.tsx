/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { PANEL_NOTIFICATION_TRIGGER } from '@kbn/ui-actions-plugin/common/trigger_ids';
import { triggers } from '@kbn/ui-actions-plugin/public';
import { useMemo } from 'react';
import { EuiNotificationBadge, EuiToolTip, useEuiTheme } from '@elastic/eui';
import React from 'react';
import type { DefaultPresentationPanelApi, PresentationPanelProps } from '../types';
import { useFrequentCompatibilityChangeActions } from './use_frequent_compatibility_change_actions';

export const useNotifications = <
  ApiType extends DefaultPresentationPanelApi = DefaultPresentationPanelApi
>(
  showNotifications: boolean,
  api: ApiType,
  getActions: PresentationPanelProps['getActions']
) => {
  const notifications = useFrequentCompatibilityChangeActions(
    PANEL_NOTIFICATION_TRIGGER,
    api,
    getActions
  );

  const { euiTheme } = useEuiTheme();

  return useMemo(() => {
    if (!showNotifications) return [];
    return notifications?.map((notification) => {
      let notificationComponent = notification.MenuItem ? (
        React.createElement(notification.MenuItem, {
          key: notification.id,
          context: {
            embeddable: api,
            trigger: triggers[PANEL_NOTIFICATION_TRIGGER],
          },
        })
      ) : (
        <EuiNotificationBadge
          data-test-subj={`embeddablePanelNotification-${notification.id}`}
          key={notification.id}
          css={{ marginTop: euiTheme.size.xs, marginRight: euiTheme.size.xs }}
          onClick={() =>
            notification.execute({ embeddable: api, trigger: triggers[PANEL_NOTIFICATION_TRIGGER] })
          }
        >
          {notification.getDisplayName({
            embeddable: api,
            trigger: triggers[PANEL_NOTIFICATION_TRIGGER],
          })}
        </EuiNotificationBadge>
      );

      if (notification.getDisplayNameTooltip) {
        const tooltip = notification.getDisplayNameTooltip({
          embeddable: api,
          trigger: triggers[PANEL_NOTIFICATION_TRIGGER],
        });

        if (tooltip) {
          notificationComponent = (
            <EuiToolTip position="top" content={tooltip} key={notification.id}>
              {notificationComponent}
            </EuiToolTip>
          );
        }
      }

      return notificationComponent;
    });
  }, [api, euiTheme.size.xs, notifications, showNotifications]);
};
