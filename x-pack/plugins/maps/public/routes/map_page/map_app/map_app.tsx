/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import _ from 'lodash';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { i18n } from '@kbn/i18n';
import { AppLeaveAction, AppMountParameters } from 'kibana/public';
import { Adapters } from 'src/plugins/embeddable/public';
import { Subscription } from 'rxjs';
import type { Query, Filter, TimeRange, IndexPattern } from 'src/plugins/data/common';
import {
  getData,
  getCoreChrome,
  getMapsCapabilities,
  getNavigation,
  getSpacesApi,
  getTimeFilter,
  getToasts,
} from '../../../kibana_services';
import {
  AppStateManager,
  startAppStateSyncing,
  getGlobalState,
  updateGlobalState,
  startGlobalStateSyncing,
  MapsGlobalState,
} from '../url_state';
import {
  esFilters,
  SavedQuery,
  QueryStateChange,
  QueryState,
} from '../../../../../../../src/plugins/data/public';
import { MapContainer } from '../../../connected_components/map_container';
import { getIndexPatternsFromIds } from '../../../index_pattern_util';
import { getTopNavConfig } from '../top_nav_config';
import { goToSpecifiedPath } from '../../../render_app';
import { MapSavedObjectAttributes } from '../../../../common/map_saved_object_type';
import { getEditPath, getFullPath, APP_ID } from '../../../../common/constants';
import { getMapEmbeddableDisplayName } from '../../../../common/i18n_getters';
import {
  getInitialQuery,
  getInitialRefreshConfig,
  getInitialTimeFilters,
  SavedMap,
  unsavedChangesTitle,
  unsavedChangesWarning,
} from '../saved_map';
import { waitUntilTimeLayersLoad$ } from './wait_until_time_layers_load';

interface MapRefreshConfig {
  isPaused: boolean;
  interval: number;
}

export interface Props {
  savedMap: SavedMap;
  // saveCounter used to trigger MapApp render after SaveMap.save
  saveCounter: number;
  onAppLeave: AppMountParameters['onAppLeave'];
  isFullScreen: boolean;
  isOpenSettingsDisabled: boolean;
  enableFullScreen: () => void;
  openMapSettings: () => void;
  inspectorAdapters: Adapters;
  nextIndexPatternIds: string[];
  setQuery: ({
    forceRefresh,
    filters,
    query,
    timeFilters,
    searchSessionId,
  }: {
    filters?: Filter[];
    query?: Query;
    timeFilters?: TimeRange;
    forceRefresh?: boolean;
    searchSessionId?: string;
  }) => void;
  isSaveDisabled: boolean;
  setHeaderActionMenu: AppMountParameters['setHeaderActionMenu'];
  history: AppMountParameters['history'];
}

export interface State {
  initialized: boolean;
  indexPatterns: IndexPattern[];
}

export class MapApp extends React.Component<Props, State> {
  _autoRefreshSubscription: Subscription | null = null;
  _globalSyncUnsubscribe: (() => void) | null = null;
  _queryStateSubscription: Subscription | null = null;
  _appSyncUnsubscribe: (() => void) | null = null;
  _appStateManager = new AppStateManager();
  _prevIndexPatternIds: string[] | null = null;
  _isMounted: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      indexPatterns: [],
      initialized: false,
      isRefreshPaused: true,
      refreshInterval: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this._autoRefreshSubscription = getTimeFilter()
      .getAutoRefreshFetch$()
      .pipe(
        tap(() => {
          this.props.setQuery({ forceRefresh: true });
        }),
        switchMap((done) =>
          waitUntilTimeLayersLoad$(this.props.savedMap.getStore()).pipe(finalize(done))
        )
      )
      .subscribe();

    this._globalSyncUnsubscribe = startGlobalStateSyncing();
    this._appSyncUnsubscribe = startAppStateSyncing(this._appStateManager);

    this._initMap();

    this.props.onAppLeave((actions) => {
      if (this.props.savedMap.hasUnsavedChanges()) {
        return actions.confirm(unsavedChangesWarning, unsavedChangesTitle);
      }
      return actions.default() as AppLeaveAction;
    });
  }

  componentDidUpdate() {
    this._updateIndexPatterns();
  }

  componentWillUnmount() {
    this._isMounted = false;

    if (this._autoRefreshSubscription) {
      this._autoRefreshSubscription.unsubscribe();
    }
    if (this._globalSyncUnsubscribe) {
      this._globalSyncUnsubscribe();
    }
    if (this._appSyncUnsubscribe) {
      this._appSyncUnsubscribe();
    }
    if (this._queryStateSubscription) {
      this._queryStateSubscription.unsubscribe();
    }

    this.props.onAppLeave((actions) => {
      return actions.default();
    });
  }

  async _updateIndexPatterns() {
    const { nextIndexPatternIds } = this.props;

    if (_.isEqual(nextIndexPatternIds, this._prevIndexPatternIds)) {
      return;
    }

    this._prevIndexPatternIds = nextIndexPatternIds;

    const indexPatterns = await getIndexPatternsFromIds(nextIndexPatternIds);
    if (this._isMounted) {
      this.setState({ indexPatterns });
    }
  }

  _dispatchQueryChange = ({
    filters,
    query,
    time,
  }: {
    filters?: Filter[];
    query?: Query;
    time?: TimeRange;
  }) => {
    if (!filters || !query || !time) {
      return;
    }

    this.props.setQuery({
      forceRefresh: false,
      filters,
      query,
      timeFilters: time,
    });

    // sync appState
    this._appStateManager.setQueryAndFilters({
      filters: getData().query.filterManager.getAppFilters(),
      query,
    });

    // sync globalState
    const updatedGlobalState: MapsGlobalState = {
      filters: getData().query.filterManager.getGlobalFilters(),
    };
    if (time) {
      updatedGlobalState.time = time;
    }
    updateGlobalState(updatedGlobalState, !this.state.initialized);
  };

  _initMapAndLayerSettings(mapSavedObjectAttributes: MapSavedObjectAttributes) {
    const globalState: MapsGlobalState = getGlobalState();

    let savedObjectFilters = [];
    if (mapSavedObjectAttributes.mapStateJSON) {
      const mapState = JSON.parse(mapSavedObjectAttributes.mapStateJSON);
      if (mapState.filters) {
        savedObjectFilters = mapState.filters;
      }
    }
    const appFilters = this._appStateManager.getFilters() || [];

    const query = getInitialQuery({
      mapStateJSON: mapSavedObjectAttributes.mapStateJSON,
      appState: this._appStateManager.getAppState(),
    });
    if (query) {
      getData().query.queryString.setQuery(query);
    }

    this._dispatchQueryChange({
      filters: [..._.get(globalState, 'filters', []), ...appFilters, ...savedObjectFilters],
      query,
      time: getInitialTimeFilters({
        mapStateJSON: mapSavedObjectAttributes.mapStateJSON,
        globalState,
      }),
    });

    this._dispatchRefreshConfigChange(
      getInitialRefreshConfig({
        mapStateJSON: mapSavedObjectAttributes.mapStateJSON,
        globalState,
      })
    );
  }

  _dispatchRefreshConfigChange({ isPaused, interval }: MapRefreshConfig) {
    updateGlobalState(
      {
        refreshInterval: {
          pause: isPaused,
          value: interval,
        },
      },
      !this.state.initialized
    );
  }

  async _initMap() {
    try {
      await this.props.savedMap.whenReady();
    } catch (err) {
      if (this._isMounted) {
        getToasts().addWarning({
          title: i18n.translate('xpack.maps.loadMap.errorAttemptingToLoadSavedMap', {
            defaultMessage: `Unable to load map`,
          }),
          text: `${err.message}`,
        });
        goToSpecifiedPath('/');
      }
      return;
    }

    if (!this._isMounted) {
      return;
    }

    const sharingSavedObjectProps = this.props.savedMap.getSharingSavedObjectProps();
    const spaces = getSpacesApi();
    if (spaces && sharingSavedObjectProps?.outcome === 'aliasMatch') {
      // We found this object by a legacy URL alias from its old ID; redirect the user to the page with its new ID, preserving any URL hash
      const newObjectId = sharingSavedObjectProps?.aliasTargetId; // This is always defined if outcome === 'aliasMatch'
      const newPath = `${getEditPath(newObjectId)}${this.props.history.location.hash}`;
      await spaces.ui.redirectLegacyUrl(newPath, getMapEmbeddableDisplayName());
      return;
    }

    this.props.savedMap.setBreadcrumbs();
    getCoreChrome().docTitle.change(this.props.savedMap.getTitle());
    const savedObjectId = this.props.savedMap.getSavedObjectId();
    if (savedObjectId) {
      getCoreChrome().recentlyAccessed.add(
        getFullPath(savedObjectId),
        this.props.savedMap.getTitle(),
        savedObjectId
      );
    }

    this._initMapAndLayerSettings(this.props.savedMap.getAttributes());

    // TopNavMenu sets useDefaultBehaviors to true making SearchBar stateful.
    // Query state tracked by data plugin with stateful SearchBar.
    // Subscribe to query state changes instead of passing callbacks to SearchBar.
    this._queryStateSubscription = getData().query.state$.subscribe(({
      changes,
      state,
    }: {
      changes: QueryStateChange;
      state: QueryState;
    }) => {
      console.log(changes);
      console.log(state);

      if (changes.refreshInterval) {
        this._dispatchRefreshConfigChange({
          isPaused: state.refreshInterval.pause,
          interval: state.refreshInterval.value,
        });
      }

      if (changes.query || changes.time || changes.filters) {
        this._dispatchQueryChange({
          filters: state.filters,
          query: state.query,
          time: state.time,
        });
      }
    });

    this.setState({ initialized: true });
  }

  _renderTopNav() {
    if (this.props.isFullScreen) {
      return null;
    }

    const topNavConfig = getTopNavConfig({
      savedMap: this.props.savedMap,
      isOpenSettingsDisabled: this.props.isOpenSettingsDisabled,
      isSaveDisabled: this.props.isSaveDisabled,
      enableFullScreen: this.props.enableFullScreen,
      openMapSettings: this.props.openMapSettings,
      inspectorAdapters: this.props.inspectorAdapters,
    });

    const { TopNavMenu } = getNavigation().ui;
    return (
      <TopNavMenu
        useDefaultBehaviors={true}
        setMenuMountPoint={this.props.setHeaderActionMenu}
        appName={APP_ID}
        config={topNavConfig}
        indexPatterns={this.state.indexPatterns}
        onQuerySubmit={(payload, isUpdate) => {
          if (!isUpdate) {
            console.log('forceRefresh');
            this.props.setQuery({ forceRefresh: true });
          }
        }}
        showSearchBar={true}
        showFilterBar={true}
        showDatePicker={true}
        showSaveQuery={!!getMapsCapabilities().saveQuery}
        savedQueryId={this._appStateManager.getAppState().savedQueryId}
        onSavedQueryIdChange={(newId: string | undefined) => {
          this._appStateManager.setQueryAndFilters({
            savedQueryId: newId,
          });
        }}
      />
    );
  }

  _addFilter = async (newFilters: Filter[]) => {
    newFilters.forEach((filter) => {
      filter.$state = { store: esFilters.FilterStateStore.APP_STATE };
    });
    this._dispatchQueryChange({
      filters: [...getData().query.filterManager.getFilters(), ...newFilters],
    });
  };

  _renderLegacyUrlConflict() {
    const sharingSavedObjectProps = this.props.savedMap.getSharingSavedObjectProps();
    const spaces = getSpacesApi();
    return spaces && sharingSavedObjectProps?.outcome === 'conflict'
      ? spaces.ui.components.getLegacyUrlConflict({
          objectNoun: getMapEmbeddableDisplayName(),
          currentObjectId: this.props.savedMap.getSavedObjectId()!,
          otherObjectId: sharingSavedObjectProps.aliasTargetId!,
          otherObjectPath: `${getEditPath(sharingSavedObjectProps.aliasTargetId!)}${
            this.props.history.location.hash
          }`,
        })
      : null;
  }

  render() {
    if (!this.state.initialized) {
      return null;
    }

    return (
      <div id="maps-plugin" className={this.props.isFullScreen ? 'mapFullScreen' : ''}>
        {this._renderTopNav()}
        <h1 className="euiScreenReaderOnly">{`screenTitle placeholder`}</h1>
        <div id="react-maps-root">
          {this._renderLegacyUrlConflict()}
          <MapContainer
            addFilters={this._addFilter}
            title={this.props.savedMap.getAttributes().title}
            description={this.props.savedMap.getAttributes().description}
            waitUntilTimeLayersLoad$={waitUntilTimeLayersLoad$(this.props.savedMap.getStore())}
            isSharable
          />
        </div>
      </div>
    );
  }
}
