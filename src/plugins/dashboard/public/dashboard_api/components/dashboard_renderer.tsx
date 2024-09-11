/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import '../_dashboard_container.scss';

import classNames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { EuiEmptyPrompt, EuiLoadingElastic, EuiLoadingSpinner, EuiText } from '@elastic/eui';
import { SavedObjectNotFound } from '@kbn/kibana-utils-plugin/common';

import { LocatorPublic } from '@kbn/share-plugin/common';
import { DashboardLocatorParams, DashboardRedirect } from '../../dashboard_container/types';
import { Dashboard404Page } from './dashboard_404';
import { DashboardApi, DashboardCreationOptions } from '../types';
import { getDashboardApi } from '../get_dashboard_api';
import { ExitFullScreenButtonKibanaProvider } from '@kbn/shared-ux-button-exit-full-screen';
import { DashboardViewport } from '../../dashboard_container/component/viewport/dashboard_viewport';
import { DashboardContext } from '../use_dashboard_api';
import { pluginServices } from '../../services/plugin_services';

export interface DashboardRendererProps {
  onApiAvailable: (api: DashboardApi) => void;
  savedObjectId?: string;
  showPlainSpinner?: boolean;
  dashboardRedirect?: DashboardRedirect;
  getCreationOptions?: () => Promise<DashboardCreationOptions>;
  locator?: Pick<LocatorPublic<DashboardLocatorParams>, 'navigate' | 'getRedirectUrl'>;
}

export function DashboardRenderer({
  onApiAvailable,
  savedObjectId,
  getCreationOptions,
  dashboardRedirect,
  showPlainSpinner,
  locator
}: DashboardRendererProps) {
    const dashboardViewport = useRef(null);
    const [loading, setLoading] = useState(true);
    const [dashboardApi, setDashboardApi] = useState<DashboardApi>();
    const [fatalError, setFatalError] = useState<Error | undefined>();

    const {
      chrome,
      customBranding,
      screenshotMode: { isScreenshotMode },
    } = pluginServices.getServices();

    /*
    // TODO pass locator to dashboardApi
    useEffect(() => {
      // In case the locator prop changes, we need to reassign the value in the container
      if (dashboardContainer) dashboardContainer.locator = locator;
    }, [dashboardContainer, locator]);
    */

    useEffect(() => {
      setFatalError(undefined);

      setLoading(true);
      let canceled = false;
      getDashboardApi(savedObjectId, getCreationOptions)
        .then(dashboardApi => {
          if (!canceled) {
            setLoading(false);
            setDashboardApi(dashboardApi);
            if (dashboardApi) {
              onApiAvailable(dashboardApi);
            }
          }
        })
        .catch(error => {
          if (!canceled) {
            setLoading(false);
            setFatalError(error);
          }
        });

      return () => {
        canceled = true;
      };
      // Disabling exhaustive deps because embeddable should only be created on first render.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedObjectId]);

    const loadingSpinner = useMemo(() => {
      return showPlainSpinner ? (
        <EuiLoadingSpinner size="xxl" />
      ) : (
        <EuiLoadingElastic size="xxl" />
      );
    }, [showPlainSpinner]);

    const renderDashboardContents = () => {
      if (fatalError instanceof SavedObjectNotFound) {
        return <Dashboard404Page dashboardRedirect={dashboardRedirect} />;
      }
      if (fatalError) {
        return (
          <EuiEmptyPrompt
            body={
              <EuiText size="s">
                {fatalError.message}
              </EuiText>
            }
            iconType="warning"
            iconColor="danger"
            layout="vertical"
          />
        );
      }

      return loading || !dashboardApi
        ? loadingSpinner
        : <ExitFullScreenButtonKibanaProvider
            coreStart={{ chrome: chrome, customBranding: customBranding }}
          >
            <DashboardContext.Provider value={dashboardApi}>
              <DashboardViewport />
            </DashboardContext.Provider>
          </ExitFullScreenButtonKibanaProvider>;
    }

    return (
      <div
        ref={dashboardViewport}
        className={classNames(
          'dashboardViewport',
          { 'dashboardViewport--screenshotMode': isScreenshotMode },
          { 'dashboardViewport--loading': loading }
        )}
      >
        {dashboardViewport?.current &&
          dashboardApi && (
            <ParentClassController
              viewportRef={dashboardViewport.current}
              dashboardApi={dashboardApi}
            />
          )}
        {renderDashboardContents()}
      </div>
    );
  }
);

/**
 * Maximizing a panel in Dashboard only works if the parent div has a certain class. This
 * small component listens to the Dashboard's expandedPanelId state and adds and removes
 * the class to whichever element renders the Dashboard.
 */
const ParentClassController = ({
  dashboardApi,
  viewportRef,
}: {
  dashboardApi: DashboardApi;
  viewportRef: HTMLDivElement;
}) => {
  useLayoutEffect(() => {
    const parentDiv = viewportRef.parentElement;
    if (!parentDiv) return;

    if (dashboardApi.expandedPanelId) {
      parentDiv.classList.add('dshDashboardViewportWrapper');
    } else {
      parentDiv.classList.remove('dshDashboardViewportWrapper');
    }
  }, [dashboardApi.expandedPanelId, viewportRef.parentElement]);
  return null;
};
