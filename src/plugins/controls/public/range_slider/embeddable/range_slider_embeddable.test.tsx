/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ControlGroupInput } from '@kbn/controls-plugin/common';
import { lazyLoadReduxToolsPackage } from '@kbn/presentation-util-plugin/public';
import { storybookFlightsDataView } from '@kbn/presentation-util-plugin/public/mocks';
import { RANGE_SLIDER_CONTROL } from '../../../common';
import { ControlGroupContainer } from '../../control_group/embeddable/control_group_container';
import { pluginServices } from '../../services';
import { injectStorybookDataView } from '../../services/data_views/data_views.story';
import { RangeSliderEmbeddableFactory } from './range_slider_embeddable_factory';

describe('initialize', () => {
  pluginServices.getServices().controls.getControlFactory = jest
    .fn()
    .mockImplementation((type: string) => {
      if (type === RANGE_SLIDER_CONTROL) return new RangeSliderEmbeddableFactory();
    });

  describe('without value', () => {
    test('should notify control group when initialization is finished', async () => {
      const reduxEmbeddablePackage = await lazyLoadReduxToolsPackage();
      const controlGroupInput = { chainingSystem: 'NONE', panels: {} } as ControlGroupInput;
      const container = new ControlGroupContainer(reduxEmbeddablePackage, controlGroupInput);

      const slider = await container.addRangeSliderControl({
        id: '34a689e9',
        dataViewId: '436fd64e',
        fieldName: 'value',
      });

      expect(container.getOutput().embeddableLoaded['34a689e9']).toBe(true);
    });
  });

  describe('with value', () => {
    test('should contain error state when field can not be found', async () => {
      const reduxEmbeddablePackage = await lazyLoadReduxToolsPackage();
      const controlGroupInput = { chainingSystem: 'NONE', panels: {} } as ControlGroupInput;
      const container = new ControlGroupContainer(reduxEmbeddablePackage, controlGroupInput);

      injectStorybookDataView(storybookFlightsDataView);

      const slider = await container.addRangeSliderControl({
        id: '34a689e9',
        dataViewId: '436fd64e',
        fieldName: 'myField',
        value: ['1', '3'],
      });

      // await redux dispatch
      await new Promise((resolve) => process.nextTick(resolve));

      const reduxState = slider.getState();
      expect(reduxState.output.loading).toBe(false);
      expect(reduxState.componentState.error).toBe('Could not locate field: myField');
    });

    test('should notify control group when initialization is finished', async () => {
      const reduxEmbeddablePackage = await lazyLoadReduxToolsPackage();
      const controlGroupInput = { chainingSystem: 'NONE', panels: {} } as ControlGroupInput;
      const container = new ControlGroupContainer(reduxEmbeddablePackage, controlGroupInput);

      injectStorybookDataView(storybookFlightsDataView);

      /*pluginServices.getServices().dataViews.get = jest.fn().mockImplementation(() => {
        return {

        };
      });*/

      const slider = await container.addRangeSliderControl({
        id: '34a689e9',
        dataViewId: '436fd64e',
        fieldName: 'value',
        value: ['1', '3'],
      });

      // await redux dispatch
      await new Promise((resolve) => process.nextTick(resolve));

      console.log(slider.getState());

      expect(container.getOutput().embeddableLoaded['34a689e9']).toBe(true);
    });
  });
});