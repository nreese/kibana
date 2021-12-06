/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { I18nProvider } from '@kbn/i18n-react';
import uuid from 'uuid/v4';
import React from 'react';
import ReactDOM from 'react-dom';
import { IUiSettingsClient, ThemeServiceStart } from 'kibana/public';
import { KibanaThemeProvider } from '../../../../../src/plugins/kibana_react/public';
import type {
  ExpressionRenderDefinition,
  IInterpreterRenderHandlers,
} from '../../../../../src/plugins/expressions/public';
import type { FormatFactory } from '../../common';
import type { RegionmapChartProps } from '../../common/expressions';
export type { RegionmapChartProps, RegionmapState, RegionmapConfig } from '../../common/expressions';
import { StaticMap } from './static_map';
import {
  FIELD_ORIGIN,
  LAYER_TYPE,
  SOURCE_TYPES,
  STYLE_TYPE,
  COLOR_MAP_TYPE,
  VectorLayerDescriptor,
} from '../../../maps/common';

export const getRegionmapChartRenderer = (
  formatFactory: FormatFactory,
  uiSettings: IUiSettingsClient,
  theme: ThemeServiceStart,
  mapEmbeddableFactory: EmbeddableFactory<MapEmbeddableInput, MapEmbeddableOutput, MapEmbeddable>,
  baseMapLayer: LayerDescriptor,
): ExpressionRenderDefinition<RegionmapChartProps> => ({
  name: 'lens_regionmap_chart_renderer',
  displayName: 'Regionmap chart',
  help: 'Regionmap chart renderer',
  validate: () => undefined,
  reuseDomNode: true,
  render: (domNode: Element, config: RegionmapChartProps, handlers: IInterpreterRenderHandlers) => {
    ReactDOM.render(
      <KibanaThemeProvider theme$={theme.theme$}>
        <I18nProvider>
          <RegionmapChart {...config} formatFactory={formatFactory} uiSettings={uiSettings} factory={mapEmbeddableFactory} baseMapLayer={baseMapLayer}  />
        </I18nProvider>
      </KibanaThemeProvider>,
      domNode,
      () => {
        handlers.done();
      }
    );
    handlers.onDestroy(() => ReactDOM.unmountComponentAtNode(domNode));
  },
});

export function RegionmapChart({
  data,
  args,
  formatFactory,
  uiSettings,
  factory,
  baseMapLayer,
}: RegionmapChartProps & {
  formatFactory: FormatFactory;
  uiSettings: IUiSettingsClient;
  mapEmbeddableFactory: EmbeddableFactory<MapEmbeddableInput, MapEmbeddableOutput, MapEmbeddable>;
  baseMapLayer: LayerDescriptor;
}) {
  console.log(data);
  console.log(args);

  const tableKeys = Object.keys(data.tables)

  const regionmapLayerDescriptor = tableKeys.length
    ? {
      id: uuid(),
      label: args.title,
      joins: [
        {
          leftField: args.emsField,
          right: {
            id: args.metricColumnId,
            type: SOURCE_TYPES.TABLE_SOURCE,
            __rows: data.tables[tableKeys[0]].rows,
            __columns: [
              {
                name: args.bucketColumnId,
                type: 'string',
              },
              {
                name: args.metricColumnId,
                type: 'number',
              },
            ],
            // Right join/term is the field in the doc you’re trying to join it to (foreign key - e.g. US)
            term: args.bucketColumnId,
          },
        },
      ],
      sourceDescriptor: {
        type: 'EMS_FILE',
        id: args.emsLayerId,
      },
      style: {
        type: 'VECTOR',
        // @ts-ignore missing style properties. Remove once 'VectorLayerDescriptor' type is updated
        properties: {
          fillColor: {
            type: STYLE_TYPE.DYNAMIC,
            options: {
              color: 'Blue to Red',
              colorCategory: 'palette_0',
              fieldMetaOptions: { isEnabled: true, sigma: 3 },
              type: COLOR_MAP_TYPE.ORDINAL,
              field: {
                name: args.metricColumnId,
                origin: FIELD_ORIGIN.JOIN,
              },
              useCustomColorRamp: false,
            },
          },
          lineWidth: { type: STYLE_TYPE.STATIC, options: { size: 1 } },
        },
        isTimeAware: false,
      },
      type: LAYER_TYPE.GEOJSON_VECTOR,
    }
    : null;

  const layerList = [];
  if (baseMapLayer) {
    layerList.push(baseMapLayer);
  }
  if (regionmapLayerDescriptor) {
    layerList.push(regionmapLayerDescriptor);
  }
  
  return <StaticMap layerList={layerList} factory={factory} />;

  /*const getEmptyState = () => (
    <VisualizationContainer className="lnsMetricExpression__container">
      <EmptyPlaceholder icon={LensIconChartMetric} />
    </VisualizationContainer>
  );

  if (!accessor || !firstTable) {
    return getEmptyState();
  }

  const column = firstTable.columns.find(({ id }) => id === accessor);
  const row = firstTable.rows[0];
  if (!column || !row) {
    return getEmptyState();
  }
  const rawValue = row[accessor];

  // NOTE: Cardinality and Sum never receives "null" as value, but always 0, even for empty dataset.
  // Mind falsy values here as 0!
  if (!['number', 'string'].includes(typeof rawValue)) {
    return getEmptyState();
  }

  const value =
    column && column.meta?.params
      ? formatFactory(column.meta?.params).convert(rawValue)
      : Number(Number(rawValue).toFixed(3)).toString();

  const color = getColorStyling(rawValue, colorMode, palette, uiSettings.get('theme:darkMode'));

  return (
    <VisualizationContainer className="lnsMetricExpression__container">
      <AutoScale key={value}>
        <div data-test-subj="lns_metric_value" className="lnsMetricExpression__value" style={color}>
          {value}
        </div>
        {mode === 'full' && (
          <div data-test-subj="lns_metric_title" className="lnsMetricExpression__title">
            {metricTitle}
          </div>
        )}
      </AutoScale>
    </VisualizationContainer>
  );*/
}
