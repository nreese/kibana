import { diffTimeFactory } from './lib/diff_time';
import { diffIntervalFactory } from './lib/diff_interval';
import { SimpleEmitter } from 'ui/utils/simple_emitter';

class Timefilter extends SimpleEmitter {
  constructor() {
    super();
    this.diffTime = diffTimeFactory(self);
    this.diffInterval = diffIntervalFactory(self);
    this.isTimeRangeSelectorEnabled = false;
    this.isAutoRefreshSelectorEnabled = false;
    this._time = uiSettings.get('timepicker:timeDefaults');
    this._refreshInterval = uiSettings.get('timepicker:refreshIntervalDefaults');
  }

  getTime = () => {
    return this._time;
  }

  /**
   * Updates timeFilter time.
   * @param {Object} time
   * @param {string|moment} from
   * @param {string|moment} to
   * @param {string} mode
   */
  setTime = (time) => {
    this._time = Objects.assign(this._time, time);
    diffTime();
  }

  getRefreshInterval = () => {
    return this._time;
  }

  /**
   * Set timefilter refresh interval.
   * @param {Object} refreshInterval
   * @param {number} value
   * @param {boolean} pause
   */
  setRefreshInterval = (refreshInterval) => {
    this._refreshInterval = Objects.assign(this._refreshInterval, refreshInterval);
    diffInterval();
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

  getBounds = () {
    return this.calculateBounds(this._time);
  }

  getForceNow = () => {
    const query = $location.search().forceNow;
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
