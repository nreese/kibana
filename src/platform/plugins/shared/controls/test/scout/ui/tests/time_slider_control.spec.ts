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

const DASHBOARD_TITLE = 'test time slider control';

test.describe('Time Slider Control', { tag: tags.stateful.classic }, () => {
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

  test('create, edit, and delete controls', async ({ page, pageObjects }) => {
    const { dashboard, datePicker, controls, controlsPage } = pageObjects;

    await test.step('create dashboard with a time slider control', async () => {
      await dashboard.openNewDashboard();
      await datePicker.setAbsoluteRange({
        from: 'Oct 22, 2018 @ 00:00:00.000',
        to: 'Dec 3, 2018 @ 00:00:00.000',
      });
      await dashboard.saveDashboard(DASHBOARD_TITLE);
      await controlsPage.addTimeSliderControl();
      await expect(controls.frames).toHaveCount(1);
      await dashboard.clearUnsavedChanges();
    });

    await test.step('can not add a second time slider control', async () => {
      await dashboard.openAddPanelFlyout();
      await expect(page.testSubj.locator('create-action-Time slider')).toBeDisabled();
      await page.keyboard.press('Escape');
    });

    await test.step('can add a range slider control', async () => {
      await controlsPage.addRangeSliderControl({
        dataViewTitle: 'kibana_sample_data_flights',
        fieldName: 'AvgTicketPrice',
      });
      await expect(controls.frames).toHaveCount(2);
      const secondId = (await controls.getControlIds())[1];
      const { lower, upper } = controlsPage.getRangeSliderBounds(secondId);
      await expect(lower).toHaveAttribute('placeholder', '100');
      await expect(upper).toHaveAttribute('placeholder', '1200');
    });

    await test.step('changing the time slice applies a filter to the range slider', async () => {
      await controlsPage.gotoNextTimeSlice();
      await expect(dashboard.unsavedChangesIndicator).toBeVisible();
      const secondId = (await controls.getControlIds())[1];
      const { lower, upper, spinner } = controlsPage.getRangeSliderBounds(secondId);
      await expect(spinner).toBeHidden();
      await expect(lower).toHaveAttribute('placeholder', '101');
      await expect(upper).toHaveAttribute('placeholder', '1000');
    });

    await test.step('changes to time slice can be discarded', async () => {
      await dashboard.clickQuickSave();
      const valueBefore = await controlsPage.getTimeSlice();
      await controlsPage.gotoNextTimeSlice();
      await expect.poll(() => controlsPage.getTimeSlice()).not.toBe(valueBefore);

      await controlsPage.discardChanges();
      await expect(dashboard.unsavedChangesIndicator).toBeHidden();
      await expect.poll(() => controlsPage.getTimeSlice()).toBe(valueBefore);
    });

    await test.step('dashboard does not load with unsaved changes when changes are discarded', async () => {
      await page.reload();
      await dashboard.waitForRenderComplete();
      await expect(dashboard.unsavedChangesIndicator).toBeHidden();
    });

    await test.step('deletes an existing control', async () => {
      const firstId = (await controls.getControlIds())[0];
      await controls.remove(firstId);
      await expect(controls.frames).toHaveCount(1);
    });
  });
});
