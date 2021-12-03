/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup } from 'kibana/public';
import type { ExpressionsSetup } from '../../../../../src/plugins/expressions/public';
import type { ChartsPluginSetup } from '../../../../../src/plugins/charts/public';
import type { EditorFrameSetup } from '../types';
import type { FormatFactory } from '../../common';

export interface RegionmapVisualizationPluginSetupPlugins {
  expressions: ExpressionsSetup;
  formatFactory: FormatFactory;
  editorFrame: EditorFrameSetup;
  charts: ChartsPluginSetup;
}

export class RegionmapVisualization {
  setup(
    core: CoreSetup,
    { expressions, formatFactory, editorFrame, charts }: RegionmapVisualizationPluginSetupPlugins
  ) {
    editorFrame.registerVisualization(async () => {
      const { getRegionmapVisualization, getRegionmapChartRenderer } = await import('../async_services');
      const palettes = await charts.palettes.getPalettes();
      const [, { embeddable }] = await core.getStartServices();
      const mapEmbeddableFactory = embeddable.getEmbeddableFactory('map');
      console.log(mapEmbeddableFactory);

      if (!mapEmbeddableFactory) {
        return;
      }

      const fileLayers = await mapEmbeddableFactory.savedObjectMetaData.getEmsFileLayers();
      console.log(fileLayers);

      expressions.registerRenderer(() =>
        getRegionmapChartRenderer(formatFactory, core.uiSettings, core.theme)
      );
      return getRegionmapVisualization({ 
        paletteService: palettes,
        theme: core.theme,
        emsAutoSuggest: (sampleValuesConfig: SampleValuesConfig) => {
          return mapEmbeddableFactory.savedObjectMetaData.emsAutoSuggest(sampleValuesConfig, fileLayers);
        }
      });
    });
  }
}
