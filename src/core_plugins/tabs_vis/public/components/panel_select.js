import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

export class PanelSelect extends Component {
  constructor(props) {
    super(props);

    this.loadOptions = this.loadOptions.bind(this);
  }

  loadOptions(input, callback) {
    this.props.getPanels(input).then((panelSavedObjects) => {
      const options = panelSavedObjects.map((panelSavedObject) => {
        return {
          label: panelSavedObject.attributes.title,
          value: panelSavedObject.id
        };
      });
      callback(null, { options: options });
    });
  }

  render() {
    return (
      <div className="kuiSideBarFormRow">
        <label className="kuiSideBarFormRow__label" htmlFor="panelSelect">
          Tab content
        </label>
        <div className="kuiSideBarFormRow__control kuiFieldGroupSection--wide">
          <Select.Async
            className="tab-react-select"
            placeholder="Select..."
            value={this.props.value}
            loadOptions={this.loadOptions}
            onChange={this.props.onChange}
            resetValue={''}
            inputProps={{ id: 'panelSelect' }}
          />
        </div>
      </div>
    );
  }
}

PanelSelect.propTypes = {
  getPanels: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
