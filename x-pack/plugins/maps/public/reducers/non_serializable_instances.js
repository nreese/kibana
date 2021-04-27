/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createSelector } from 'reselect';
import { RequestAdapter } from '../../../../../src/plugins/inspector/common/adapters/request';
import { MapAdapter } from '../inspector/adapters/map_adapter';
import { ES_GEO_FIELD_TYPE } from '../../common/constants';
import { getShowMapsInspectorAdapter } from '../kibana_services';
import { indexPatterns as indexPatternsUtils } from '../../../../../src/plugins/data/public';

const REGISTER_CANCEL_CALLBACK = 'REGISTER_CANCEL_CALLBACK';
const UNREGISTER_CANCEL_CALLBACK = 'UNREGISTER_CANCEL_CALLBACK';
const SET_EVENT_HANDLERS = 'SET_EVENT_HANDLERS';
const SET_CHARTS_PALETTE_SERVICE_GET_COLOR = 'SET_CHARTS_PALETTE_SERVICE_GET_COLOR';
export const SET_INDEX_PATTERNS = 'SET_INDEX_PATTERNS';

function createInspectorAdapters() {
  const inspectorAdapters = {
    requests: new RequestAdapter(),
  };
  if (getShowMapsInspectorAdapter()) {
    inspectorAdapters.map = new MapAdapter();
  }
  return inspectorAdapters;
}

// Reducer
export function nonSerializableInstances(state, action = {}) {
  if (!state) {
    return {
      indexPatterns: [],
      inspectorAdapters: createInspectorAdapters(),
      cancelRequestCallbacks: new Map(), // key is request token, value is cancel callback
      eventHandlers: {},
      chartsPaletteServiceGetColor: null,
    };
  }

  switch (action.type) {
    case REGISTER_CANCEL_CALLBACK:
      state.cancelRequestCallbacks.set(action.requestToken, action.callback);
      return {
        ...state,
      };
    case UNREGISTER_CANCEL_CALLBACK:
      state.cancelRequestCallbacks.delete(action.requestToken);
      return {
        ...state,
      };
    case SET_EVENT_HANDLERS: {
      return {
        ...state,
        eventHandlers: action.eventHandlers,
      };
    }
    case SET_CHARTS_PALETTE_SERVICE_GET_COLOR: {
      return {
        ...state,
        chartsPaletteServiceGetColor: action.chartsPaletteServiceGetColor,
      };
    }
    case SET_INDEX_PATTERNS: {
      return {
        ...state,
        indexPatterns: action.indexPatterns,
      };
    }
    default:
      return state;
  }
}

// Selectors
export const getInspectorAdapters = ({ nonSerializableInstances }) => {
  return nonSerializableInstances.inspectorAdapters;
};

export const getCancelRequestCallbacks = ({ nonSerializableInstances }) => {
  return nonSerializableInstances.cancelRequestCallbacks;
};

export const getEventHandlers = ({ nonSerializableInstances }) => {
  return nonSerializableInstances.eventHandlers;
};

export function getChartsPaletteServiceGetColor({ nonSerializableInstances }) {
  return nonSerializableInstances.chartsPaletteServiceGetColor;
}

// Actions
export const registerCancelCallback = (requestToken, callback) => {
  return {
    type: REGISTER_CANCEL_CALLBACK,
    requestToken,
    callback,
  };
};

export const unregisterCancelCallback = (requestToken) => {
  return {
    type: UNREGISTER_CANCEL_CALLBACK,
    requestToken,
  };
};

export const cancelRequest = (requestToken) => {
  return (dispatch, getState) => {
    if (!requestToken) {
      return;
    }

    const cancelCallback = getCancelRequestCallbacks(getState()).get(requestToken);
    if (cancelCallback) {
      cancelCallback();
      dispatch(unregisterCancelCallback(requestToken));
    }
  };
};

export const setEventHandlers = (eventHandlers = {}) => {
  return {
    type: SET_EVENT_HANDLERS,
    eventHandlers,
  };
};

export function setChartsPaletteServiceGetColor(chartsPaletteServiceGetColor) {
  return {
    type: SET_CHARTS_PALETTE_SERVICE_GET_COLOR,
    chartsPaletteServiceGetColor,
  };
}

export function getIndexPatterns({ nonSerializableInstances }) {
  return nonSerializableInstances.indexPatterns;
}

export const getGeoFields = createSelector(getIndexPatterns, (indexPatterns) => {
  const geoFields = [];
  indexPatterns.forEach((indexPattern) => {
    indexPattern.fields.forEach((field) => {
      if (
        indexPattern.id &&
        !indexPatternsUtils.isNestedField(field) &&
        (field.type === ES_GEO_FIELD_TYPE.GEO_POINT || field.type === ES_GEO_FIELD_TYPE.GEO_SHAPE)
      ) {
        geoFields.push({
          geoFieldName: field.name,
          geoFieldType: field.type,
          indexPatternTitle: indexPattern.title,
          indexPatternId: indexPattern.id,
        });
      }
    });
  });
  return geoFields;
});
