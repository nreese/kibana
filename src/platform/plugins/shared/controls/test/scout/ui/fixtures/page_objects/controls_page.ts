/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */
import type { Locator } from 'playwright-core';
import type { ScoutPage } from '@kbn/scout';

/**
 * Time slider and range slider interactions for dashboard controls tests.
 */
export class ControlsPage {
  readonly timeSliderPopover: Locator;

  constructor(private readonly page: ScoutPage) {
    this.timeSliderPopover = this.page.testSubj.locator('timeSlider-popoverContents');
  }

  async addTimeSliderControl() {
    await this.page.testSubj.click('dashboardAddTopNavButton');
    await this.page.testSubj.click('create-action-Time slider');
  }

  async addRangeSliderControl({
    dataViewTitle,
    fieldName,
  }: {
    dataViewTitle: string;
    fieldName: string;
  }) {
    await this.page.testSubj.click('dashboardAddTopNavButton');
    await this.page.testSubj.click('create-action-Control');
    await this.page.testSubj.locator('control-editor-flyout').waitFor({ state: 'visible' });
    await this.page.testSubj.click('open-data-view-picker');
    await this.page.testSubj.click(`data-view-picker-${dataViewTitle}`);
    await this.page.testSubj.fill('field-search-input', fieldName);
    await this.page.testSubj.click(`field-picker-select-${fieldName}`);
    await this.page.testSubj.click('create__rangeSliderControl');
    await this.page.testSubj.click('control-editor-save');
    await this.page.testSubj.locator('control-editor-flyout').waitFor({ state: 'hidden' });
  }

  getRangeSliderBounds(controlId: string) {
    const control = this.page.testSubj.locator(`range-slider-control-${controlId}`);
    return {
      lower: control.locator('[data-test-subj="rangeSlider__lowerBoundFieldNumber"]'),
      upper: control.locator('[data-test-subj="rangeSlider__upperBoundFieldNumber"]'),
      spinner: control.locator('.euiLoadingSpinner'),
    };
  }

  /** The next/previous buttons pause playback, which always opens the popover. */
  async gotoNextTimeSlice() {
    await this.page.testSubj.click('timeSlider-nextTimeWindow');
    await this.timeSliderPopover.waitFor({ state: 'visible' });
  }

  async openTimeSliderPopover() {
    if (!(await this.timeSliderPopover.isVisible())) {
      await this.page.testSubj.click('timeSlider-popoverToggleButton');
      await this.timeSliderPopover.waitFor({ state: 'visible' });
    }
  }

  async closeTimeSliderPopover() {
    if (await this.timeSliderPopover.isVisible()) {
      await this.page.testSubj.click('timeSlider-popoverToggleButton');
      await this.timeSliderPopover.waitFor({ state: 'hidden' });
    }
  }

  async getTimeSlice() {
    await this.openTimeSliderPopover();
    return this.timeSliderPopover.locator('.euiRangeDraggable').getAttribute('aria-valuetext');
  }

  /**
   * Discards unsaved changes through the save split-button menu (or the app menu when the
   * item is rendered inline) and confirms the modal.
   */
  async discardChanges() {
    const discardItem = this.page.testSubj.locator('dashboardDiscardChangesMenuItem');
    if (!(await discardItem.isVisible())) {
      await this.page.testSubj.click('dashboardQuickSaveMenuItem-secondary-button');
    }
    await discardItem.click();
    await this.page.testSubj.click('confirmModalConfirmButton');
  }
}
