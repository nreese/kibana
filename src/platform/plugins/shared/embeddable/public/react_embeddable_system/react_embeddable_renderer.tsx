/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useMemo } from 'react';

import type { HasSerializedChildState } from '@kbn/presentation-publishing';
import type { PresentationPanelProps } from '@kbn/presentation-panel-plugin/public';
import { PresentationPanel } from '@kbn/presentation-panel-plugin/public';

import type { DefaultEmbeddableApi } from './types';

/**
 * Renders a component from the React Embeddable registry into a Presentation Panel.
 */
export const EmbeddableRenderer = <
  SerializedState extends object = object,
  Api extends DefaultEmbeddableApi<SerializedState> = DefaultEmbeddableApi<SerializedState>,
  ParentApi extends HasSerializedChildState<SerializedState> = HasSerializedChildState<SerializedState>
>({
  type,
  maybeId,
  getParentApi,
  panelProps,
  onApiAvailable,
  hidePanelChrome,
}: {
  type: string;
  maybeId?: string;
  getParentApi: () => ParentApi;
  onApiAvailable?: (api: Api) => void;
  panelProps?: Pick<
    PresentationPanelProps<Api>,
    | 'showShadow'
    | 'showBorder'
    | 'showBadges'
    | 'showNotifications'
    | 'hideLoader'
    | 'hideHeader'
    | 'hideInspector'
    | 'setDragHandles'
    | 'getActions'
  >;
  hidePanelChrome?: boolean;
}) => {
  const componentPromise = useMemo(
    () => {
      return new Promise(async (resolve) => {
        const { renderEmbeddable } = await import('../async_module');
        resolve(await renderEmbeddable({
          type,
          maybeId,
          getParentApi,
          onApiAvailable,
        }));
      });
    },
    /**
     * Disabling exhaustive deps because we do not want to re-fetch the component
     * from the embeddable registry unless the type changes.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type]
  );

  return (
    <PresentationPanel<Api, {}>
      hidePanelChrome={hidePanelChrome}
      {...panelProps}
      Component={componentPromise}
    />
  );
};
