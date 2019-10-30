/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { OperationDefinition } from '.';
import { FieldBasedIndexPatternColumn } from './column_types';

export interface GeoCentroidIndexPatternColumn extends FieldBasedIndexPatternColumn {
  operationType: 'geo_centroid';
}

export const geoCentroidOperation: OperationDefinition<GeoCentroidIndexPatternColumn> = {
  type: 'geo_centroid',
  displayName: i18n.translate('xpack.lens.indexPattern.geoCentroid', {
    defaultMessage: 'Geo centroid',
  }),
  getPossibleOperationForField: ({ aggregationRestrictions, aggregatable, type }) => {
    if (
      type === 'geo_point' &&
      aggregatable
    ) {
      return {
        dataType: 'geo_point',
        isBucketed: false,
        scale: 'ratio',
      };
    }
  },
  buildColumn({ suggestedPriority, field, indexPattern }) {
    return {
      label: field.name,
      dataType: 'geo_point',
      operationType: 'geo_centroid',
      suggestedPriority,
      sourceField: field.name,
      isBucketed: false,
      scale: 'ratio',
    };
  },
  isTransferable: (column, newIndexPattern) => {
    return false;
  },
  transfer: (column, newIndexPattern) => {
    return column;
  },
  onFieldChange: (oldColumn, indexPattern, field) => {
    return {
      ...oldColumn,
      label: field.name,
      sourceField: field.name,
    };
  },
  toEsAggsConfig: (column, columnId) => ({
    id: columnId,
    enabled: true,
    type: 'geo_centroid',
    schema: 'segment',
    params: {
      field: column.sourceField,
    },
  }),
  paramEditor: ({ state, setState, currentColumn: currentColumn, layerId }) => {
    return (
      <div>
        geo_centroid param editor TBD
      </div>
    );
  },
};
