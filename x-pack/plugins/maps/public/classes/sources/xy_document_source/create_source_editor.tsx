/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import { i18n } from '@kbn/i18n';
import { EuiFormRow, EuiPanel } from '@elastic/eui';
import { IFieldType } from 'src/plugins/data/public';
import { XYDocumentSourceDescriptor } from '../../../../common/descriptor_types';
import { SingleFieldSelect } from '../../../components/single_field_select';
import { getIndexPatternSelectComponent, getIndexPatternService } from '../../../kibana_services';
import { indexPatterns } from '../../../../../../../src/plugins/data/public';

interface Props {
  onSourceConfigChange: (sourceConfig: Partial<XYDocumentSourceDescriptor>) => void;
}

interface State {
  indexPatternId: string;
  xAxisField: string;
  yAxisField: string;
  numericFields: IFieldType[];
}

export class CreateSourceEditor extends Component<Props, State> {
  private _isMounted: boolean = false;

  state = {
    indexPatternId: '',
    xAxisField: '',
    yAxisField: '',
    numericFields: [],
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  _onIndexPatternSelect = async (indexPatternId: string) => {
    if (!indexPatternId || indexPatternId.length === 0) {
      return;
    }

    let indexPattern;
    try {
      indexPattern = await getIndexPatternService().get(indexPatternId);
    } catch (err) {
      return;
    }

    // method may be called again before 'get' returns
    // ignore response when fetched index pattern does not match active index pattern
    if (this._isMounted && indexPattern.id === indexPatternId) {
      this.setState(
        {
          indexPatternId,
          numericFields: indexPattern.fields.filter((field) => {
            return !indexPatterns.isNestedField(field) && ['number', 'date'].includes(field.type);
          }),
        },
        this._previewLayer
      );
    }
  };

  _onXAxisFieldSelect = (xAxisField: string) => {
    this.setState({ xAxisField }, this._previewLayer);
  };

  _onYAxisFieldSelect = (yAxisField: string) => {
    this.setState({ yAxisField }, this._previewLayer);
  };

  _previewLayer() {
    const { indexPatternId, xAxisField, yAxisField } = this.state;

    const sourceConfig =
      indexPatternId && xAxisField && yAxisField
        ? {
            indexPatternId,
            xAxisField,
            yAxisField,
          }
        : null;
    this.props.onSourceConfigChange(sourceConfig);
  }

  renderXAxisFieldSelect() {
    if (!this.state.indexPatternId) {
      return;
    }

    return (
      <EuiFormRow
        label={i18n.translate('xpack.maps.source.xyDocument.xAxisLabel', {
          defaultMessage: 'X axis field',
        })}
      >
        <SingleFieldSelect
          placeholder={i18n.translate('xpack.maps.source.xyDocument.xAxisPlaceholder', {
            defaultMessage: 'Select X axis field',
          })}
          value={this.state.xAxisField}
          onChange={this._onXAxisFieldSelect}
          fields={this.state.numericFields}
        />
      </EuiFormRow>
    );
  }

  renderYAxisFieldSelect() {
    if (!this.state.indexPatternId || !this.state.xAxisField) {
      return;
    }

    return (
      <EuiFormRow
        label={i18n.translate('xpack.maps.source.xyDocument.yAxisLabel', {
          defaultMessage: 'Y axis field',
        })}
      >
        <SingleFieldSelect
          placeholder={i18n.translate('xpack.maps.source.xyDocument.yAxisPlaceholder', {
            defaultMessage: 'Select Y axis field',
          })}
          value={this.state.yAxisField}
          onChange={this._onYAxisFieldSelect}
          fields={this.state.numericFields}
        />
      </EuiFormRow>
    );
  }

  render() {
    const IndexPatternSelect = getIndexPatternSelectComponent();
    return (
      <EuiPanel>
        <EuiFormRow
          label={i18n.translate('xpack.maps.indexPatternSelectLabel', {
            defaultMessage: 'Index pattern',
          })}
        >
          <IndexPatternSelect
            indexPatternId={this.state.indexPatternId}
            onChange={this._onIndexPatternSelect}
            placeholder={i18n.translate('xpack.maps.indexPatternSelectPlaceholder', {
              defaultMessage: 'Select index pattern',
            })}
            isClearable={false}
          />
        </EuiFormRow>

        {this.renderXAxisFieldSelect()}

        {this.renderYAxisFieldSelect()}
      </EuiPanel>
    );
  }
}
