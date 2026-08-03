/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { PANEL_BADGE_TRIGGER } from '@kbn/ui-actions-plugin/common/trigger_ids';
import { triggers } from '@kbn/ui-actions-plugin/public';
import { useMemo } from 'react';
import { EuiBadge, EuiToolTip } from '@elastic/eui';
import React from 'react';
import type { DefaultPresentationPanelApi, PresentationPanelProps } from '../types';
import { useFrequentCompatibilityChangeActions } from './use_frequent_compatibility_change_actions';

export const useBadges = <
  ApiType extends DefaultPresentationPanelApi = DefaultPresentationPanelApi
>(
  showBadges: boolean,
  api: ApiType,
  getActions: PresentationPanelProps['getActions']
) => {
  const badges = useFrequentCompatibilityChangeActions(PANEL_BADGE_TRIGGER, api, getActions);

  return useMemo(() => {
    if (!showBadges) return [];
    return badges?.map((badge) => {
      const tooltipText = badge.getDisplayNameTooltip?.({
        embeddable: api,
        trigger: triggers[PANEL_BADGE_TRIGGER],
      });
      const badgeElement = (
        <EuiBadge
          key={badge.id}
          iconType={badge.getIconType({ embeddable: api, trigger: triggers[PANEL_BADGE_TRIGGER] })}
          onClick={() => badge.execute({ embeddable: api, trigger: triggers[PANEL_BADGE_TRIGGER] })}
          onClickAriaLabel={badge.getDisplayName({
            embeddable: api,
            trigger: triggers[PANEL_BADGE_TRIGGER],
          })}
          data-test-subj={`embeddablePanelBadge-${badge.id}`}
          {...(tooltipText ? { 'aria-label': tooltipText } : {})}
        >
          {badge.MenuItem
            ? React.createElement(badge.MenuItem, {
                context: {
                  embeddable: api,
                  trigger: triggers[PANEL_BADGE_TRIGGER],
                },
              })
            : badge.getDisplayName({ embeddable: api, trigger: triggers[PANEL_BADGE_TRIGGER] })}
        </EuiBadge>
      );

      return tooltipText ? (
        <EuiToolTip key={badge.id} content={tooltipText}>
          {badgeElement}
        </EuiToolTip>
      ) : (
        badgeElement
      );
    });
  }, [api, badges, showBadges]);
};
