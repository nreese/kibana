/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Component, RefObject } from 'react';
import uuid from 'uuid/v4';
import { EuiLoadingChart } from '@elastic/eui';
import { EmbeddableFactory, ViewMode } from '../../../../../src/plugins/embeddable/public';

interface Props {
  layerList: LayerList[];
  factory: EmbeddableFactory<MapEmbeddableInput, MapEmbeddableOutput, MapEmbeddable>;
}

interface State {
  mapEmbeddable: MapEmbeddableType | undefined;
}

export class StaticMap extends Component<Props, State> {
  private _isMounted = false;
  private _prevLayerList: LayerList[] = [];
  private readonly _embeddableRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  state: State = {};

  componentDidMount() {
    this._isMounted = true;
    this._setupEmbeddable();
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.state.mapEmbeddable) {
      this.state.mapEmbeddable.destroy();
    }
  }

  componentDidUpdate() {
    if (this.state.mapEmbeddable && this._prevLayerList !== this.props.layerList) {
      this.state.mapEmbeddable.setLayerList(this.props.layerList);
      this._prevLayerList = this.props.layerList;
    }
  }

  async _setupEmbeddable() {
    const mapEmbeddable = await this.props.factory.create({
      id: uuid(),
      attributes: { 
        title: '',
        layerListJSON: JSON.stringify(this.props.layerList),
      },
      filters: [],
      hidePanelTitles: true,
      viewMode: ViewMode.VIEW,
      isLayerTOCOpen: false,
      hideFilterActions: true,
      // can use mapSettings to center map on anomalies
      mapSettings: {
        disableInteractive: true,
        hideToolbarOverlay: true,
        hideLayerControl: false,
        hideViewControl: true,
        initialLocation: 'AUTO_FIT_TO_BOUNDS', // this will startup based on data-extent
        autoFitToDataBounds: true, // this will auto-fit when there are changes to the filter and/or query
      },
    });

    if (this._isMounted) {
      this.setState({ mapEmbeddable }, () => {
        if (this._embeddableRef.current) {
          this.state.mapEmbeddable.render(this._embeddableRef.current);
        }
      });
    }
  }

  render() {
    if (!this.state.mapEmbeddable) {
      return <EuiLoadingChart mono size="l" />;
    }

    return <div className="mapEmbeddableContainer" ref={this._embeddableRef} />;
  }
}
