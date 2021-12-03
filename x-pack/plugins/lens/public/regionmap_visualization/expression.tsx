/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { I18nProvider } from '@kbn/i18n-react';
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

export const getRegionmapChartRenderer = (
  formatFactory: FormatFactory,
  uiSettings: IUiSettingsClient,
  theme: ThemeServiceStart
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
          <RegionmapChart {...config} formatFactory={formatFactory} uiSettings={uiSettings} />
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
}: RegionmapChartProps & { formatFactory: FormatFactory; uiSettings: IUiSettingsClient }) {
  //const { metricTitle, accessor, mode, colorMode, palette } = args;
  //const firstTable = Object.values(data.tables)[0];

  return <div>Regionmap</div>;

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
