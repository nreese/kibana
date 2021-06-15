/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import uuid from 'uuid/v4';
import { LAYER_TYPE, LAYER_WIZARD_CATEGORY } from '../../../../x-pack/plugins/maps/common';
import { LayerWizard, RenderWizardArguments } from '../../../../x-pack/plugins/maps/public';
import { DayNightTerminatorSource, SourceDescriptor } from './source';
import { CreateSourceEditor } from './create_source_editor';

export const dayNightTerminatorWizardConfig: LayerWizard = {
  categories: [LAYER_WIZARD_CATEGORY.REFERENCE],
  description: 'Show the boundary where day ends and night begins.',
  renderWizard: ({ previewLayers, mapColors }: RenderWizardArguments) => {
    const onSourceConfigChange = (sourceConfig: Partial<SourceDescriptor>) => {
      if (!sourceConfig) {
        previewLayers([]);
        return;
      }

      const layerDescriptor = {
        id: uuid(),
        sourceDescriptor: DayNightTerminatorSource.createDescriptor(sourceConfig),
        type: LAYER_TYPE.VECTOR,
      };
      previewLayers([layerDescriptor]);
    };

    return <CreateSourceEditor onSourceConfigChange={onSourceConfigChange} />;
  },
  title: 'Day night terminator',
};
