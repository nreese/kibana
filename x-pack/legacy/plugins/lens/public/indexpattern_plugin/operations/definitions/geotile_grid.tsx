/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { OperationDefinition } from '.';
import { FieldBasedIndexPatternColumn } from './column_types';

export interface GeoTileGridIndexPatternColumn extends FieldBasedIndexPatternColumn {
  operationType: 'geotile_grid';
}

export const geoTileGridOperation: OperationDefinition<GeoTileGridIndexPatternColumn> = {
  type: 'geotile_grid',
  displayName: i18n.translate('xpack.lens.indexPattern.geoTileGrid', {
    defaultMessage: 'geotile grid',
  }),
  getPossibleOperationForField: ({ aggregationRestrictions, aggregatable, type }) => {
    if (
      type === 'geo_point' &&
      aggregatable
    ) {
      return {
        dataType: 'geo_point',
        isBucketed: true,
        scale: 'interval',
      };
    }
  },
  buildColumn({ suggestedPriority, field, indexPattern }) {
    return {
      label: field.name,
      dataType: 'geo_point',
      operationType: 'geotile_grid',
      suggestedPriority,
      sourceField: field.name,
      isBucketed: true,
      scale: 'interval',
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
    type: 'geotile_grid',
    schema: 'segment',
    params: {
      field: column.sourceField,
      precision: 0,
    },
  }),
  paramEditor: ({ state, setState, currentColumn: currentColumn, layerId }) => {
    return (
      <div>
        geotile_grid param editor TBD
      </div>
    );
  },
};
