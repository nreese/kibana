/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithKibanaRenderContext } from '@kbn/test-jest-helpers';
import type { Datatable } from '@kbn/expressions-plugin/common';
import type { LegendActionProps, SeriesIdentifier } from '@elastic/charts';
import type { DataLayerConfig } from '../../common';
import { LayerTypes } from '../../common/constants';
import { getLegendAction } from './legend_action';
import type { LegendCellValueActions } from './legend_action_popover';
import { mockPaletteOutput } from '../../common/test_utils';
import type { FieldFormat } from '@kbn/field-formats-plugin/common';
import type { InvertedRawValueMap, LayerFieldFormats } from '../helpers';
import type { RawValue } from '@kbn/data-plugin/common';
import { ESQL_TABLE_TYPE } from '@kbn/data-plugin/common';
import { FILTER_CELL_ACTION_TYPE } from '@kbn/cell-actions/constants';
import type { CellValueAction } from '../types';

const legendCellValueActions: LegendCellValueActions = [
  { id: 'action_1', displayName: 'Action 1', iconType: 'testIcon1', execute: () => {} },
  { id: 'action_2', displayName: 'Action 2', iconType: 'testIcon2', execute: () => {} },
];

const table: Datatable = {
  type: 'datatable',
  rows: [
    {
      xAccessorId: 1585758120000,
      splitAccessorId: "Men's Clothing",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585758360000,
      splitAccessorId: "Women's Accessories",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585758360000,
      splitAccessorId: "Women's Clothing",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585759380000,
      splitAccessorId: "Men's Clothing",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585759380000,
      splitAccessorId: "Men's Shoes",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585759380000,
      splitAccessorId: "Women's Clothing",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585760700000,
      splitAccessorId: "Men's Clothing",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585760760000,
      splitAccessorId: "Men's Clothing",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585760760000,
      splitAccessorId: "Men's Shoes",
      yAccessorId: 1,
    },
    {
      xAccessorId: 1585761120000,
      splitAccessorId: "Men's Shoes",
      yAccessorId: 1,
    },
  ],
  columns: [
    {
      id: 'xAccessorId',
      name: 'order_date per minute',
      meta: {
        type: 'date',
        field: 'order_date',
        source: 'esaggs',
        index: 'indexPatternId',
        sourceParams: {
          indexPatternId: 'indexPatternId',
          type: 'date_histogram',
          params: {
            field: 'order_date',
            timeRange: { from: '2020-04-01T16:14:16.246Z', to: '2020-04-01T17:15:41.263Z' },
            useNormalizedEsInterval: true,
            scaleMetricValues: false,
            interval: '1m',
            drop_partials: false,
            min_doc_count: 0,
            extended_bounds: {},
          },
        },
        params: { id: 'date', params: { pattern: 'HH:mm' } },
      },
    },
    {
      id: 'splitAccessorId',
      name: 'Top values of category.keyword',
      meta: {
        type: 'string',
        field: 'category.keyword',
        source: 'esaggs',
        index: 'indexPatternId',
        sourceParams: {
          indexPatternId: 'indexPatternId',
          type: 'terms',
          params: {
            field: 'category.keyword',
            orderBy: 'yAccessorId',
            order: 'desc',
            size: 3,
            otherBucket: false,
            otherBucketLabel: 'Other',
            missingBucket: false,
            missingBucketLabel: 'Missing',
          },
        },
        params: {
          id: 'terms',
          params: {
            id: 'string',
            otherBucketLabel: 'Other',
            missingBucketLabel: 'Missing',
            parsedUrl: {
              origin: 'http://localhost:5601',
              pathname: '/jiy/app/kibana',
              basePath: '/jiy',
            },
          },
        },
      },
    },
    {
      id: 'yAccessorId',
      name: 'Count of records',
      meta: {
        type: 'number',
        source: 'esaggs',
        index: 'indexPatternId',
        sourceParams: {
          indexPatternId: 'indexPatternId',
          params: {},
        },
        params: { id: 'number' },
      },
    },
  ],
};

const sampleLayer: DataLayerConfig = {
  layerId: 'first',
  type: 'dataLayer',
  layerType: LayerTypes.DATA,
  seriesType: 'line',
  isStacked: false,
  isPercentage: false,
  isHorizontal: false,
  showLines: true,
  xAccessor: 'c',
  accessors: ['a', 'b'],
  splitAccessors: ['splitAccessorId'],
  columnToLabel: '{"a": "Label A", "b": "Label B", "d": "Label D"}',
  xScaleType: 'ordinal',
  isHistogram: false,
  palette: mockPaletteOutput,
  table,
};

const invertedRawValueMap: InvertedRawValueMap = new Map(
  table.columns.map((c) => [c.id, new Map<string, RawValue>()])
);

/** Builds a getLegendAction component for the given layer. */
const buildComponent = (layer: DataLayerConfig): React.ComponentType<LegendActionProps> =>
  getLegendAction(
    [layer],
    jest.fn(),
    [legendCellValueActions],
    {
      first: {
        splitSeriesAccessors: {
          splitAccessorId: {
            format: { id: 'string' },
            formatter: {
              convertToText(x: unknown) {
                return x;
              },
            } as FieldFormat,
          },
        },
      } as unknown as LayerFieldFormats,
    },
    {
      first: { table: layer.table, invertedRawValueMap, formattedColumns: {} },
    },
    {}
  );

/**
 * Series props where the y-accessor key ('b') matches a layer accessor,
 * anchoring the series to the given split value.
 */
const makeSeriesProps = (splitValue: string): LegendActionProps => ({
  color: 'rgb(109, 204, 177)',
  label: splitValue,
  series: [
    {
      seriesKeys: [splitValue, 'b'],
      splitAccessors: new Map().set('splitAccessorId', splitValue),
    },
  ] as unknown as SeriesIdentifier[],
});

/** Renders the component, clicks the action button, and returns the userEvent instance. */
const renderAndOpen = async (
  Component: React.ComponentType<LegendActionProps>,
  props: LegendActionProps
) => {
  const user = userEvent.setup();
  renderWithKibanaRenderContext(<Component {...props} />);
  await user.click(await screen.findByRole('button', { name: /legend actions/i }));
  return { user };
};

describe('getLegendAction', () => {
  it('does not render when no series key matches a layer accessor', () => {
    const Component = buildComponent(sampleLayer);
    // Neither "Women's Accessories" nor 'test' equals accessor 'a' or 'b' → layerIndex === -1
    const props: LegendActionProps = {
      color: 'rgb(109, 204, 177)',
      label: "Women's Accessories",
      series: [
        {
          seriesKeys: ["Women's Accessories", 'test'],
          splitAccessors: new Map().set('splitAccessorId', "Women's Accessories"),
        },
      ] as unknown as SeriesIdentifier[],
    };
    renderWithKibanaRenderContext(<Component {...props} />);
    expect(screen.queryByRole('button', { name: /legend actions/i })).not.toBeInTheDocument();
  });

  it('does not render when the split accessor value is not found in the data', () => {
    const Component = buildComponent(sampleLayer);
    // 'b' matches accessor 'b' so layer is found, but 'test' has no matching row
    renderWithKibanaRenderContext(<Component {...makeSeriesProps('test')} />);
    expect(screen.queryByRole('button', { name: /legend actions/i })).not.toBeInTheDocument();
  });

  it('renders the action button when a matching layer and row are found', () => {
    const Component = buildComponent(sampleLayer);
    renderWithKibanaRenderContext(<Component {...makeSeriesProps("Women's Accessories")} />);
    expect(screen.getByRole('button', { name: /legend actions/i })).toBeInTheDocument();
    expect(screen.getByTestId("legend-Women's Accessories - Label B")).toBeInTheDocument();
  });

  it('shows cell value actions in the popover', async () => {
    const Component = buildComponent(sampleLayer);
    await renderAndOpen(Component, makeSeriesProps("Women's Accessories"));
    expect(await screen.findByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('disables filter actions when the split column is a non-filterable computed column', async () => {
    const tableWithComputedColumn: Datatable = {
      ...table,
      meta: { type: ESQL_TABLE_TYPE },
      columns: table.columns.map((col) =>
        col.id === 'splitAccessorId'
          ? {
              ...col,
              isComputedColumn: true,
              meta: {
                ...col.meta,
                sourceParams: {
                  ...col.meta.sourceParams,
                  sourceField: col.name,
                  isSourceFieldFilterable: false,
                },
              },
            }
          : col
      ),
    };
    const Component = buildComponent({ ...sampleLayer, table: tableWithComputedColumn });
    await renderAndOpen(Component, makeSeriesProps("Women's Accessories"));
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Filter for' })).toBeDisabled();
      expect(screen.getByRole('menuitem', { name: 'Filter out' })).toBeDisabled();
    });
    expect(screen.getByTestId('legendFilterFooterMessage')).toBeInTheDocument();
  });

  it('omits Filter for/out for a non-filterable computed date column, but keeps other cell actions', async () => {
    // There's no warning message to show for a suppressed date column, so showing disabled
    // Filter for/out buttons with nothing to explain them would be confusing — they're omitted
    // even though the popover itself still renders for the other (unrelated) cell actions.
    const tableWithComputedDateColumn: Datatable = {
      ...table,
      meta: { type: ESQL_TABLE_TYPE },
      columns: table.columns.map((col) =>
        col.id === 'splitAccessorId'
          ? {
              ...col,
              isComputedColumn: true,
              meta: {
                ...col.meta,
                type: 'date',
                sourceParams: {
                  ...col.meta.sourceParams,
                  sourceField: col.name,
                  isSourceFieldFilterable: false,
                },
              },
            }
          : col
      ),
    };
    const Component = buildComponent({ ...sampleLayer, table: tableWithComputedDateColumn });
    await renderAndOpen(Component, makeSeriesProps("Women's Accessories"));
    expect(await screen.findByText('Action 1')).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Filter for' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Filter out' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('legendFilterFooterMessage')).not.toBeInTheDocument();
  });

  it('does not render an action button for a non-filterable computed date column with no other actions', () => {
    const tableWithComputedDateColumn: Datatable = {
      ...table,
      meta: { type: ESQL_TABLE_TYPE },
      columns: table.columns.map((col) =>
        col.id === 'splitAccessorId'
          ? {
              ...col,
              isComputedColumn: true,
              meta: {
                ...col.meta,
                type: 'date',
                sourceParams: {
                  ...col.meta.sourceParams,
                  sourceField: col.name,
                  isSourceFieldFilterable: false,
                },
              },
            }
          : col
      ),
    };
    const Component = getLegendAction(
      [{ ...sampleLayer, table: tableWithComputedDateColumn }],
      jest.fn(),
      [[]],
      {
        first: {
          splitSeriesAccessors: {
            splitAccessorId: {
              format: { id: 'string' },
              formatter: {
                convertToText(x: unknown) {
                  return x;
                },
              } as FieldFormat,
            },
          },
        } as unknown as LayerFieldFormats,
      },
      {
        first: {
          table: tableWithComputedDateColumn,
          invertedRawValueMap,
          formattedColumns: {},
        },
      },
      {}
    );
    renderWithKibanaRenderContext(<Component {...makeSeriesProps("Women's Accessories")} />);
    expect(screen.queryByRole('button', { name: /legend actions/i })).not.toBeInTheDocument();
  });

  it('does not disable filter actions for a renamed computed column', async () => {
    // A RENAME column has isComputedColumn=true, but isSourceFieldFilterable=true means the
    // underlying index field is still addressable — filtering should work normally.
    const tableWithRenamedComputedColumn: Datatable = {
      ...table,
      meta: { type: ESQL_TABLE_TYPE },
      columns: table.columns.map((col) =>
        col.id === 'splitAccessorId'
          ? {
              ...col,
              isComputedColumn: true,
              meta: {
                ...col.meta,
                sourceParams: {
                  ...col.meta.sourceParams,
                  // sourceField ('category.keyword') differs from col.name
                  sourceField: 'category.keyword',
                  isSourceFieldFilterable: true,
                },
              },
            }
          : col
      ),
    };
    const Component = buildComponent({ ...sampleLayer, table: tableWithRenamedComputedColumn });
    await renderAndOpen(Component, makeSeriesProps("Women's Accessories"));
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Filter for' })).toBeEnabled();
      expect(screen.getByRole('menuitem', { name: 'Filter out' })).toBeEnabled();
    });
    expect(screen.queryByTestId('legendFilterFooterMessage')).not.toBeInTheDocument();
  });

  it('renders the action button when the split column has isComputedColumn set to false', () => {
    const tableWithIndexField: Datatable = {
      ...table,
      columns: table.columns.map((col) =>
        col.id === 'splitAccessorId' ? { ...col, isComputedColumn: false } : col
      ),
    };
    const Component = buildComponent({ ...sampleLayer, table: tableWithIndexField });
    renderWithKibanaRenderContext(<Component {...makeSeriesProps("Women's Accessories")} />);
    expect(screen.getByRole('button', { name: /legend actions/i })).toBeInTheDocument();
  });

  describe('compatible cell actions with filter type', () => {
    const filterCellAction: CellValueAction = {
      id: 'filter-action',
      type: FILTER_CELL_ACTION_TYPE,
      iconType: 'plusInCircle',
      displayName: 'Filter for value',
      execute: jest.fn(),
    };

    const nonFilterCellAction: CellValueAction = {
      id: 'drilldown-action',
      type: 'drilldown',
      iconType: 'popout',
      displayName: 'Open in app',
      execute: jest.fn(),
    };

    /** ES|QL table where splitAccessorId is a text field containing a blank value. */
    const esqlBlankTextTable: Datatable = {
      ...table,
      meta: { type: ESQL_TABLE_TYPE },
      rows: [{ xAccessorId: 1585758120000, splitAccessorId: '', yAccessorId: 1 }],
      columns: table.columns.map((col) =>
        col.id === 'splitAccessorId'
          ? { ...col, meta: { ...col.meta, esType: 'text' } }
          : col
      ),
    };

    const buildWithActions = (
      testTable: Datatable,
      actions: CellValueAction[]
    ): React.ComponentType<LegendActionProps> =>
      getLegendAction(
        [{ ...sampleLayer, table: testTable }],
        jest.fn(),
        [actions],
        {
          first: {
            splitSeriesAccessors: {
              splitAccessorId: {
                format: { id: 'string' },
                formatter: { convertToText: (x: unknown) => x } as FieldFormat,
              },
            },
          } as unknown as LayerFieldFormats,
        },
        { first: { table: testTable, invertedRawValueMap, formattedColumns: {} } },
        {}
      );

    it('disables a filter-type cell action when the column is not filterable', async () => {
      const Component = buildWithActions(esqlBlankTextTable, [filterCellAction]);
      await renderAndOpen(Component, makeSeriesProps(''));
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Filter for value' })).toBeDisabled();
      });
    });

    it('does not call execute on a disabled filter-type cell action', async () => {
      const execute = jest.fn();
      const Component = buildWithActions(esqlBlankTextTable, [{ ...filterCellAction, execute }]);
      const { user } = await renderAndOpen(Component, makeSeriesProps(''));
      const item = await screen.findByRole('menuitem', { name: 'Filter for value' });
      await user.click(item);
      expect(execute).not.toHaveBeenCalled();
    });

    it('leaves a non-filter cell action enabled when the column is not filterable', async () => {
      const Component = buildWithActions(esqlBlankTextTable, [nonFilterCellAction]);
      await renderAndOpen(Component, makeSeriesProps(''));
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Open in app' })).toBeEnabled();
      });
    });

    it('enables a filter-type cell action when the column is filterable', async () => {
      const filterable: Datatable = {
        ...table,
        meta: { type: ESQL_TABLE_TYPE },
      };
      const Component = buildWithActions(filterable, [filterCellAction]);
      await renderAndOpen(Component, makeSeriesProps("Women's Accessories"));
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Filter for value' })).toBeEnabled();
      });
    });
  });
});
