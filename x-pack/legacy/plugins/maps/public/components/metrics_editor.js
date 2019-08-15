/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import {
  EuiButtonIcon,
  EuiButton,
  EuiPanel,
} from '@elastic/eui';
import { MetricEditor } from './metric_editor';
import { DefaultEditorAggGroup } from '../../../../../../src/legacy/ui/public/vis/editors/default/components/agg_group';
import { Schemas } from 'ui/vis/editors/default/schemas';
import { AggConfigs } from 'ui/vis/agg_configs';

const geoTileGridSchema = new Schemas([
  {
    group: 'metrics',
    name: 'metric',
    title: i18n.translate('maps.geoTileGrid.schemas.metricTitle', {
      defaultMessage: 'Grid cell metric',
    }),
    min: 1,
    max: Infinity,
    aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality', 'top_hits'],
    defaults: [
      { schema: 'metric', type: 'count' },
    ],
  }
]);

export function MetricsEditor({ indexPattern, metrics, onChange, allowMultipleMetrics, metricsFilter }) {

  function onAggParamsChange(args) {
    console.log('onAggParamsChange args', args);
  }

  function onAggTypeChange(args) {
    console.log('onAggTypeChange args', args);
  }

  function onToggleEnableAgg(args) {
    console.log('onToggleEnableAgg args', args);
  }

  function setTouched(args) {
    console.log('setTouched', args)
  }

  function setValidity(args) {
    console.log('setValidity', args)
  }

  const state = {
    aggs: new AggConfigs(indexPattern, [], geoTileGridSchema.metrics)
  };

  return (
    <DefaultEditorAggGroup
      groupName="metrics"
      schemas={geoTileGridSchema.metrics}
      onAggParamsChange={onAggParamsChange}
      onAggTypeChange={onAggTypeChange}
      onToggleEnableAgg={onToggleEnableAgg}
      setTouched={setTouched}
      setValidity={setValidity}
      state={state}
    />
  );
}

MetricsEditor.propTypes = {
  metrics: PropTypes.array,
  fields: PropTypes.object,  // indexPattern.fields IndexedArray object
  onChange: PropTypes.func.isRequired,
  allowMultipleMetrics: PropTypes.bool,
  metricsFilter: PropTypes.func,
};

MetricsEditor.defaultProps = {
  metrics: [
    { type: 'count' }
  ],
  allowMultipleMetrics: true
};
