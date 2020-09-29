/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { VectorLayer } from '../../layers/vector_layer/vector_layer';
import { LayerWizard, RenderWizardArguments } from '../../layers/layer_wizard_registry';
import { CreateSourceEditor } from './create_source_editor';
import { XYDocumentSourceDescriptor } from '../../../../common/descriptor_types';
import { DOMAIN_TYPE, LAYER_WIZARD_CATEGORY } from '../../../../common/constants';
import { TiledVectorLayer } from '../../layers/tiled_vector_layer/tiled_vector_layer';
import { XYDocumentSource } from './xy_document_source';

export const xyDocumentLayerWizardConfig: LayerWizard = {
  categories: [LAYER_WIZARD_CATEGORY.ELASTICSEARCH],
  description: i18n.translate('xpack.maps.source.xyDocumentDescription', {
    defaultMessage: 'Documents from Elasticsearch',
  }),
  domainType: DOMAIN_TYPE.XY,
  icon: 'logoElasticsearch',
  renderWizard: ({ previewLayers, mapColors }: RenderWizardArguments) => {
    const onSourceConfigChange = (sourceConfig: Partial<XYDocumentSourceDescriptor> | null) => {
      if (!sourceConfig) {
        previewLayers([]);
        return;
      }

      const layerDescriptor = TiledVectorLayer.createDescriptor(
        {
          sourceDescriptor: XYDocumentSource.createDescriptor(sourceConfig),
        },
        mapColors
      );
      previewLayers([layerDescriptor]);
    };
    return <CreateSourceEditor onSourceConfigChange={onSourceConfigChange} />;
  },
  title: i18n.translate('xpack.maps.source.xyDocumentDescription', {
    defaultMessage: 'Documents',
  }),
};
