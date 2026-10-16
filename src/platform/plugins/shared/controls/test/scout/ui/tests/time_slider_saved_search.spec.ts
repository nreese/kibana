/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { tags } from '@kbn/scout';
import { expect } from '@kbn/scout/ui';
import {
  test,
  ES_ARCHIVE_FLIGHTS,
  KBN_ARCHIVE_DASHBOARD,
  KBN_ARCHIVE_FLIGHTS_DATA_VIEW,
  DEFAULT_INDEX_ID,
} from '../fixtures';

test.describe('Time Slider Control panel interactions', { tag: tags.stateful.classic }, () => {
  test.beforeAll(async ({ esArchiver, kbnClient, uiSettings }) => {
    await esArchiver.loadIfNeeded(ES_ARCHIVE_FLIGHTS);
    await kbnClient.importExport.load(KBN_ARCHIVE_DASHBOARD);
    await kbnClient.importExport.load(KBN_ARCHIVE_FLIGHTS_DATA_VIEW);
    await uiSettings.set({ defaultIndex: DEFAULT_INDEX_ID });
  });

  test.beforeEach(async ({ browserAuth }) => {
    await browserAuth.loginAsAdmin();
  });

  test.afterAll(async ({ kbnClient, uiSettings }) => {
    await kbnClient.importExport.unload(KBN_ARCHIVE_FLIGHTS_DATA_VIEW);
    await kbnClient.importExport.unload(KBN_ARCHIVE_DASHBOARD);
    await uiSettings.unset('defaultIndex');
  });

  test('saved search document count follows the time slice', async ({ page, pageObjects }) => {
    const { dashboard, controlsPage } = pageObjects;
    const documentCount = page.testSubj.locator('savedSearchTotalDocuments');

    await test.step('open dashboard with time slider and saved search', async () => {
      await dashboard.goto();
      await dashboard.clickDashboardTitleLink('timeslider and saved search');
    });

    await test.step('displays document count for global time range when no timeslice is set', async () => {
      await expect(documentCount).toHaveText('14,005 documents');
    });

    await test.step('displays document count for timeslice when timeslice is selected', async () => {
      await controlsPage.gotoNextTimeSlice(); // first slice is just partial slice with no data
      await controlsPage.gotoNextTimeSlice();
      await controlsPage.closeTimeSliderPopover(); // close popover so its not blocking panel
      await dashboard.waitForRenderComplete();
      await expect(documentCount).toHaveText('16 documents');
    });
  });
});
