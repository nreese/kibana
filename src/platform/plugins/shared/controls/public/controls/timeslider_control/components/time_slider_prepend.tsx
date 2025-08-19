/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { EuiButtonIcon, EuiFlexItem } from '@elastic/eui';
import type { PublishesDataLoading, ViewMode } from '@kbn/presentation-publishing';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';
import type { Subscription } from 'rxjs';
import { debounceTime, first, map } from 'rxjs';
import { PlayButton } from './play_button';
import { TimeSliderStrings } from './time_slider_strings';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
  parentDataLoading$: PublishesDataLoading['dataLoading$'];
  viewMode: ViewMode;
  disablePlayButton: boolean;
  setIsPopoverOpen: (isPopoverOpen: boolean) => void;
  dataLoadingDelay?: number;
  nextFrameDelay?: number;
}

export const TimeSliderPrepend: FC<Props> = (props: Props) => {
  const [isPaused, setIsPaused] = useState(true);
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
  const [subscription, setSubscription] = useState<Subscription | undefined>(undefined);

  const playNextFrame = useCallback(() => {
    // advance to next frame
    props.onNext();

    const waitForControlOutputConsumersToLoad$ = props.parentDataLoading$.pipe(
      // debounce to give time for parent to start loading from time changes
      debounceTime(props.dataLoadingDelay ?? 300),
      first((isLoading: boolean | undefined) => {
        return !isLoading;
      }),
      map(() => {
        // Observable notifies subscriber when loading is finished
        // Return void to not expose internal implementation details of observable
        return;
      })
    );
    const nextFrameSubscription = waitForControlOutputConsumersToLoad$
      .pipe(first())
      .subscribe(() => {
        // use timeout to display frame for small time period before moving to next frame
        const nextTimeoutId = window.setTimeout(() => {
          playNextFrame();
        }, props.nextFrameDelay ?? 1750);
        setTimeoutId(nextTimeoutId);
      });
    setSubscription(nextFrameSubscription);
  }, [props]);

  const onPlay = useCallback(() => {
    props.setIsPopoverOpen(true);
    setIsPaused(false);
    playNextFrame();
  }, [props, playNextFrame]);

  const onPause = useCallback(() => {
    props.setIsPopoverOpen(true);
    setIsPaused(true);
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(undefined);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(undefined);
    }
  }, [props, subscription, timeoutId]);

  return (
    <>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          onClick={() => {
            onPause();
            props.onPrevious();
          }}
          iconType="framePrevious"
          color="text"
          aria-label={TimeSliderStrings.control.getPreviousButtonAriaLabel()}
          data-test-subj="timeSlider-previousTimeWindow"
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <PlayButton
          onPlay={onPlay}
          onPause={onPause}
          viewMode={props.viewMode}
          disablePlayButton={props.disablePlayButton}
          isPaused={isPaused}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          onClick={() => {
            onPause();
            props.onNext();
          }}
          iconType="frameNext"
          color="text"
          aria-label={TimeSliderStrings.control.getNextButtonAriaLabel()}
          data-test-subj="timeSlider-nextTimeWindow"
        />
      </EuiFlexItem>
    </>
  );
};
