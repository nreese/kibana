/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */
import { test as base } from '@kbn/scout';
import type { KibanaUrl, ScoutPage, ScoutWorkerFixtures, ScoutTestFixtures } from '@kbn/scout';
import type { ControlsExtendedPageObjects } from './page_objects';
import { extendPageObjects } from './page_objects';

export const ES_ARCHIVE_FLIGHTS =
  'src/platform/test/functional/fixtures/es_archiver/kibana_sample_data_flights';
export const KBN_ARCHIVE_DASHBOARD =
  'src/platform/test/functional/fixtures/kbn_archiver/dashboard/current/kibana';
export const KBN_ARCHIVE_FLIGHTS_DATA_VIEW =
  'src/platform/test/functional/fixtures/kbn_archiver/kibana_sample_data_flights_index_pattern';
export const DEFAULT_INDEX_ID = '0bf35f60-3dc9-11e8-8660-4d65aa086b3c';

interface PageObjectsDeps {
  pageObjects: ControlsExtendedPageObjects;
  page: ScoutPage;
  kbnUrl: KibanaUrl;
}
type UseFn = (pageObjects: ControlsExtendedPageObjects) => Promise<void>;

export interface ControlsTestFixtures extends ScoutTestFixtures {
  pageObjects: ControlsExtendedPageObjects;
}

export const test = base.extend<ControlsTestFixtures, ScoutWorkerFixtures>({
  pageObjects: async ({ pageObjects, page, kbnUrl }: PageObjectsDeps, use: UseFn) => {
    await use(extendPageObjects(pageObjects, page, kbnUrl));
  },
});
