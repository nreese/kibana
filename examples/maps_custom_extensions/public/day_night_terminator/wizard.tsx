/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { LAYER_WIZARD_CATEGORY } from '../../../../x-pack/plugins/maps/common/constants';
import { LayerWizard, RenderWizardArguments } from '../../../../x-pack/plugins/maps/public';

export const dayNightTerminatorWizardConfig: LayerWizard = {
  categories: [LAYER_WIZARD_CATEGORY.REFERENCE],
  description: 'Show the boundary of where night starts, and day begins.',
  renderWizard: ({ previewLayers, mapColors }: RenderWizardArguments) => {
    return <div>Hello world</div>;
  },
  title: 'Day night terminator',
};
