/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { EmbeddablePackageState } from "@kbn/embeddable-plugin/public";
import { LoadDashboardReturn, SavedDashboardInput } from "../services/dashboard_content_management/types";
import { Observable } from "rxjs";
import { SearchSessionInfoProvider } from "@kbn/data-plugin/public";
import { IKbnUrlStateStorage } from "@kbn/kibana-utils-plugin/public";
import { EmbeddableAppContext, HasExecutionContext, HasUniqueId, PublishesDataLoading, PublishesUnsavedChanges, PublishesViewMode } from "@kbn/presentation-publishing";
import { CanAddNewPanel, HasRuntimeChildState, HasSaveNotification, HasSerializedChildState, PresentationContainer } from "@kbn/presentation-containers";
import { PublishesReload } from "@kbn/presentation-publishing/interfaces/fetch/publishes_reload";

export type DashboardApi = PresentationContainer &
  CanAddNewPanel &
  HasExecutionContext &
  HasSaveNotification &
  HasSerializedChildState &
  HasRuntimeChildState &
  HasUniqueId &
  PublishesDataLoading &
  PublishesViewMode &
  PublishesReload &
  PublishesUnsavedChanges;

export interface DashboardCreationOptions {
  getInitialInput?: () => Partial<SavedDashboardInput>;

  getIncomingEmbeddable?: () => EmbeddablePackageState | undefined;

  useSearchSessionsIntegration?: boolean;
  searchSessionSettings?: {
    sessionIdToRestore?: string;
    sessionIdUrlChangeObservable?: Observable<string | undefined>;
    getSearchSessionIdFromURL: () => string | undefined;
    removeSessionIdFromUrl: () => void;
    createSessionRestorationDataProvider: (
      container: DashboardApi
    ) => SearchSessionInfoProvider;
  };

  useControlGroupIntegration?: boolean;
  useSessionStorageIntegration?: boolean;

  useUnifiedSearchIntegration?: boolean;
  unifiedSearchSettings?: { kbnUrlStateStorage: IKbnUrlStateStorage };

  validateLoadedSavedObject?: (result: LoadDashboardReturn) => 'valid' | 'invalid' | 'redirected';

  isEmbeddedExternally?: boolean;

  getEmbeddableAppContext?: (dashboardId?: string) => EmbeddableAppContext;
}