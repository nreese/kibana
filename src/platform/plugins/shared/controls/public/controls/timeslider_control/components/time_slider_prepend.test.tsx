/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { act, fireEvent, render as rtlRender } from '@testing-library/react';
import { TimeSliderPrepend } from './time_slider_prepend';
import { BehaviorSubject } from 'rxjs';
import { EuiThemeProvider } from '@elastic/eui';
import { ViewMode } from '@kbn/presentation-publishing';

const render = (ui: React.ReactElement) => {
  return rtlRender(ui, { wrapper: EuiThemeProvider });
};

const onNextMock = jest.fn();
const onPreviousMock = jest.fn();
const setIsPopoverOpenMock = jest.fn();
const parentDataLoading$ = new BehaviorSubject<boolean | undefined>(false);
const defaultProps = {
  onNext: onNextMock,
  onPrevious: onPreviousMock,
  parentDataLoading$: parentDataLoading$,
  viewMode: 'view' as ViewMode,
  disablePlayButton: false,
  setIsPopoverOpen: setIsPopoverOpenMock,
  dataLoadingDelay: 0,
  nextFrameDelay: 0
}

describe('TimeSliderPrepend', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    parentDataLoading$.next(false);
  });

  describe('play button', () => {
    test('should continue playing frames when parent finishes loading current frame', (done) => {
      let count = 0;
      onNextMock.mockImplementation(() => {
        count++;
        if (count >= 3) {
          done()
        }
      });
      const { findByTestId } = render(<TimeSliderPrepend {...defaultProps} />);
      onNextMock.mockImplementation();
      findByTestId('timeSlider-playButton').then((node) => {
        act(() => fireEvent.click(node));
        //fireEvent.click(node);
      });
    });
  });
});