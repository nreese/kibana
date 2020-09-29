/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import uuid from 'uuid/v4';
import { SOURCE_TYPES } from '../../../../common/constants';
import { AbstractESSource } from '../es_source';
import { registerSource } from '../source_registry';

export class XYDocumentSource extends AbstractESSource {
  static type = SOURCE_TYPES.XY_DOCUMENT;

  static createDescriptor(descriptor: Partial<XYDocumentSourceDescriptor>) {
    return {
      ...descriptor,
      id: descriptor.id ? descriptor.id : uuid(),
      type: XYDocumentSource.type,
    };
  }
}

registerSource({
  ConstructorFunction: XYDocumentSource,
  type: SOURCE_TYPES.XY_DOCUMENT,
});
