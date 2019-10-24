/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { i18n } from '@kbn/i18n';
import { IInterpreterRenderFunction } from '../../../../../../src/legacy/core_plugins/expressions/public';
import { ExpressionFunction } from '../../../../../../src/plugins/expressions/common';
import { FormatFactory } from '../../../../../../src/legacy/ui/public/visualize/loader/pipeline_helpers/utilities';
import { VisualizationContainer } from '../visualization_container';

export interface MapColumns {
  columnIds: string[];
}

interface Args {
  columns: MapColumns;
}

export interface MapRender {
    type: 'render';
    as: 'lens_map_renderer';
    value: MapProps;
  }

export const map: ExpressionFunction<
  'lens_map',
  any,
  Args,
  any
> = ({
  name: 'lens_datatable',
  type: 'render',
  help: i18n.translate('xpack.lens.datatable.expressionHelpLabel', {
    defaultMessage: 'Datatable renderer',
  }),
  args: {
    title: {
      types: ['string'],
      help: i18n.translate('xpack.lens.datatable.titleLabel', {
        defaultMessage: 'Title',
      }),
    },
    columns: {
      types: ['lens_datatable_columns'],
      help: '',
    },
  },
  context: {
    types: ['lens_multitable'],
  },
  fn(data: any, args: Args) {
    return {
      type: 'render',
      as: 'lens_datatable_renderer',
      value: {
        data,
        args,
      },
    };
  },
  // TODO the typings currently don't support custom type args. As soon as they do, this can be removed
} as unknown) as ExpressionFunction<'lens_datatable', KibanaDatatable, Args, DatatableRender>;

type MapColumnsResult = MapColumns & { type: 'lens_map_columns' };

export const mapColumns: ExpressionFunction<
  'lens_map_columns',
  null,
  MapColumns,
  MapColumnsResult
> = {
  name: 'lens_map_columns',
  aliases: [],
  type: 'lens_map_columns',
  help: '',
  context: {
    types: ['null'],
  },
  args: {
    columnIds: {
      types: ['geo_point'],
      multi: true,
      help: '',
    },
  },
  fn: function fn(_context: unknown, args: MapColumns) {
    return {
      type: 'lens_map_columns',
      ...args,
    };
  },
};

export interface MapProps {
    data: any;
    args: any;
  }

export const getMapRenderer = (
  formatFactory: FormatFactory
): IInterpreterRenderFunction<MapProps> => ({
  name: 'lens_map_renderer',
  displayName: i18n.translate('xpack.lens.map.visualizationName', {
    defaultMessage: 'Map',
  }),
  help: '',
  validate: () => {},
  reuseDomNode: true,
  render: async (domNode: Element, config: MapProps, _handlers: unknown) => {
    ReactDOM.render(<MapComponent {...config} formatFactory={formatFactory} />, domNode);
  },
});

function MapComponent(props: MapProps & { formatFactory: FormatFactory }) {
  return (
    <VisualizationContainer>
      <div>
        Map
      </div>
    </VisualizationContainer>
  );
}
