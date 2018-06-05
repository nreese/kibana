/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import _ from 'lodash';
import dateMath from '@kbn/datemath';
import qs from 'querystring';
import { diffTimeFactory } from './lib/diff_time';
import { diffIntervalFactory } from './lib/diff_interval';
import { SimpleEmitter } from 'ui/utils/simple_emitter';
import chrome from 'ui/chrome';

class Timefilter extends SimpleEmitter {
  constructor() {
    super();
    const self = this;
    this.diffTime = diffTimeFactory(self);
    this.diffInterval = diffIntervalFactory(self);
    this.isTimeRangeSelectorEnabled = false;
    this.isAutoRefreshSelectorEnabled = false;
    this._time = chrome.getUiSettingsClient().get('timepicker:timeDefaults');
    this._refreshInterval = chrome.getUiSettingsClient().get('timepicker:refreshIntervalDefaults');
  }

  getTime = () => {
    return this._time;
  }

  /**
   * Updates timefilter time.
   * @param {Object} time
   * @param {string|moment} from
   * @param {string|moment} to
   * @param {string} mode
   */
  setTime = (time) => {
    this._time = Object.assign(this._time, time);
    this.diffTime();
  }

  getRefreshInterval = () => {
    return this._refreshInterval;
  }

  /**
   * Set timefilter refresh interval.
   * @param {Object} refreshInterval
   * @param {number} value
   * @param {boolean} pause
   */
  setRefreshInterval = (refreshInterval) => {
    this._refreshInterval = Object.assign(this._refreshInterval, refreshInterval);
    this.diffInterval();
  }

  toggleRefresh = () => {
    this.setRefreshInterval({ pause: !this._refreshInterval.pause });
  }

  createFilter = (indexPattern, timeRange) => {
    if (!indexPattern) {
    //in CI, we sometimes seem to fail here.
      return;
    }

    let filter;
    const timefield = indexPattern.timeFieldName && _.find(indexPattern.fields, { name: indexPattern.timeFieldName });

    if (timefield) {
      const bounds = timeRange ? this.calculateBounds(timeRange) : this.getBounds();
      filter = { range: {} };
      filter.range[timefield.name] = {
        gte: bounds.min.valueOf(),
        lte: bounds.max.valueOf(),
        format: 'epoch_millis'
      };
    }

    return filter;
  }

  getBounds = () => {
    return this.calculateBounds(this._time);
  }

  getForceNow = () => {
    const query = qs.parse(window.location.search).forceNow;
    if (!query) {
      return;
    }

    const ticks = Date.parse(query);
    if (isNaN(ticks)) {
      throw new Error(`forceNow query parameter can't be parsed`);
    }
    return new Date(ticks);
  }

  calculateBounds = (timeRange) => {
    const forceNow = this.getForceNow();

    return {
      min: dateMath.parse(timeRange.from, { forceNow }),
      max: dateMath.parse(timeRange.to, { roundUp: true, forceNow })
    };
  }

  getActiveBounds = () => {
    if (this.isTimeRangeSelectorEnabled) {
      return this.getBounds();
    }
  }

  /**
   * Show the time bounds selector part of the time filter
   */
  enableTimeRangeSelector = () => {
    this.isTimeRangeSelectorEnabled = true;
  }

  /**
   * Hide the time bounds selector part of the time filter
   */
  disableTimeRangeSelector = () => {
    this.isTimeRangeSelectorEnabled = false;
  }

  /**
   * Show the auto refresh part of the time filter
   */
  enableAutoRefreshSelector = () => {
    this.isAutoRefreshSelectorEnabled = true;
  }

  /**
   * Hide the auto refresh part of the time filter
   */
  disableAutoRefreshSelector = () => {
    this.isAutoRefreshSelectorEnabled = false;
  }

}

export const timefilter = new Timefilter();
