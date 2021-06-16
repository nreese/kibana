/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Plugin, CoreSetup, CoreStart } from '../../../src/core/public';
import type { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { MapsPluginStart } from '../../../x-pack/plugins/maps/public';
import { setStartServices } from './kibana_services';
import {
  dayNightTerminatorWizardConfig,
  DayNightTerminatorSource,
  DAY_NIGHT_TERMINATOR_SOURCE_TYPE,
} from './day_night_terminator';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SetupDependencies {}

interface StartDependencies {
  data: DataPublicPluginStart;
  maps: MapsPluginStart;
}

export class MapsCustomExtensionsPlugin
  implements Plugin<void, void, SetupDependencies, StartDependencies> {
  public setup(core: CoreSetup, plugins: SetupDependencies) {}

  public start(core: CoreStart, plugins: StartDependencies) {
    setStartServices(core, plugins);

    plugins.maps.registerLayerWizard(dayNightTerminatorWizardConfig);
    plugins.maps.registerSource({
      ConstructorFunction: DayNightTerminatorSource,
      type: DAY_NIGHT_TERMINATOR_SOURCE_TYPE,
    });
  }

  public stop() {}
}
