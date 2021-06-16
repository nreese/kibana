/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { CoreStart } from 'kibana/public';
import type { StartDependencies } from './plugin';

let coreStart: CoreStart;
let pluginsStart: StartDependencies;
export function setStartServices(core: CoreStart, plugins: StartDependencies) {
  coreStart = core;
  pluginsStart = plugins;
}

export const getTimeFilter = () => pluginsStart.data.query.timefilter.timefilter;
