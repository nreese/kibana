/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import uuid from 'uuid';
import { start } from '../../../../../../src/legacy/core_plugins/embeddable_api/public/np_ready/public/legacy';
import { ViewMode } from '../../../../../../src/legacy/core_plugins/embeddable_api/public/np_ready/public';

export class EmbeddedMap extends Component {

  state = {
    embeddable: undefined,
    isError: false,
  };

  componentDidMount() {
    this._loadEmbeddable();
  }

  async _loadEmbeddable() {
    const factory = start.getEmbeddableFactory('map');

    const state = {
      layerList: [
        {
          'id': '0hmz5',
          'alpha': 1,
          'sourceDescriptor': {
          'type': 'EMS_TMS',
            'isAutoSelect': true
          },
          'visible': true,
          'style': {},
          'type': 'VECTOR_TILE',
          'minZoom': 0,
          'maxZoom': 24
        },
      ],
      title: 'Map',
    };
    const input = {
      id: uuid.v4(),
      hidePanelTitles: true,
      viewMode: ViewMode.VIEW,
      isLayerTOCOpen: false,
      openTOCDetails: [],
      hideFilterActions: false,
      mapCenter: { lon: -1.05469, lat: 15.96133, zoom: 1 },
    };

    // @ts-ignore
    const embeddable = await factory.createFromState(
      state,
      input,
      undefined,
    );

    this.setState({ embeddable });
  }

  render() {
    return (
      <div>
        map goes here
      </div>
    );
  }
}
