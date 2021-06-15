/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { Component } from 'react';
import { EuiPanel } from '@elastic/eui';
import { DAY_NIGHT_TERMINATOR_SOURCE_TYPE, SourceDescriptor } from './source';

interface Props {
  onSourceConfigChange: (sourceConfig: Partial<SourceDescriptor>) => void;
}

interface State {
  numSamples: number;
}

export class CreateSourceEditor extends Component<Props, State> {
  state: State = {
    numSamples: 3,
  };

  componentDidMount() {
    this._previewLayer();
  }

  _previewLayer() {
    this.props.onSourceConfigChange({
      type: DAY_NIGHT_TERMINATOR_SOURCE_TYPE,
      numSamples: this.state.numSamples,
    });
  }

  render() {
    return (
      <EuiPanel>
        <div>Day night terminator</div>
      </EuiPanel>
    );
  }
}
