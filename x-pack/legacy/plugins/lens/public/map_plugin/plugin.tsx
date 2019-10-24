/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreSetup } from 'src/core/public';
import { mapVisualization } from './map_visualization';
import { getFormat, FormatFactory } from 'ui/visualize/loader/pipeline_helpers/utilities';
import { npSetup } from 'ui/new_platform';
import { ExpressionsSetup } from '../../../../../../src/legacy/core_plugins/expressions/public';
import { setup as expressionsSetup } from '../../../../../../src/legacy/core_plugins/expressions/public/legacy';
import { getMapRenderer, mapColumns, map } from './expression';

export interface MapPluginSetupPlugins {
  expressions: ExpressionsSetup;
  // TODO this is a simulated NP plugin.
  // Once field formatters are actually migrated, the actual shim can be used
  fieldFormat: {
    formatFactory: FormatFactory;
  };
}

class MapPlugin {
  constructor() {}

  setup(
    _core: CoreSetup | null,
    { expressions, fieldFormat }: MapPluginSetupPlugins
  ) {
    expressions.registerFunction(() => mapColumns);
    expressions.registerFunction(() => map);
    expressions.registerRenderer(() => getMapRenderer(fieldFormat.formatFactory));

    return mapVisualization;
  }

  stop() {}
}

const plugin = new MapPlugin();

export const mapSetup = () =>
  plugin.setup(npSetup.core, {
    expressions: expressionsSetup,
    fieldFormat: {
      formatFactory: getFormat,
    },
  });
export const mapStop = () => plugin.stop();
