import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PanelSelect } from './panel_select';

export class TabEditor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: true
    };
  }

  handleToggleCollapse() {
    this.setState(prevState => (
      {  isCollapsed: !prevState.isCollapsed }
    ));
  }

  renderEditor() {
    const labelId = `tabLabel${this.props.tabIndex}`;
    return (
      <div>

        <div className="kuiSideBarFormRow">
          <label className="kuiSideBarFormRow__label" htmlFor={labelId}>
            Tab Label
          </label>
          <div className="kuiSideBarFormRow__control kuiFieldGroupSection--wide">
            <input
              className="kuiTextInput"
              id={labelId}
              type="text"
              value={this.props.title}
              onChange={this.props.handleTitleChange}
            />
          </div>
        </div>

        <PanelSelect
          getPanels={this.props.getPanels}
          onChange={this.props.handlePanelChange}
          value={this.props.panelId}
        />

      </div>
    );
  }

  render() {
    const visibilityToggleClasses = classNames('fa', {
      'fa-caret-right': !this.state.isCollapsed,
      'fa-caret-down': this.state.isCollapsed
    });

    return (
      <div className="sidebar-item">
        <div className="vis-editor-agg-header">
          <button
            aria-label={this.state.isCollapsed ? 'Close Editor' : 'Open Editor'}
            onClick={this.handleToggleCollapse.bind(this)}
            type="button"
            className="kuiButton kuiButton--primary kuiButton--small vis-editor-agg-header-toggle"
          >
            <i aria-hidden="true" className={visibilityToggleClasses} />
          </button>
          <span className="vis-editor-agg-header-title ng-binding">
            {this.props.title}
          </span>
          <div className="vis-editor-agg-header-controls kuiButtonGroup kuiButtonGroup--united">
            <button
              aria-label="Move tab down"
              type="button"
              className="kuiButton kuiButton--small"
              onClick={this.props.moveDown}
              data-test-subj={`tabsEditorMoveDownControl${this.props.tabIndex}`}
            >
              <i aria-hidden="true" className="fa fa-chevron-down" />
            </button>
            <button
              aria-label="Move tab up"
              type="button"
              className="kuiButton kuiButton--small"
              onClick={this.props.moveUp}
              data-test-subj={`tabsEditorMoveUpControl${this.props.tabIndex}`}
            >
              <i aria-hidden="true" className="fa fa-chevron-up" />
            </button>
            <button
              aria-label="Remove tab"
              className="kuiButton kuiButton--danger kuiButton--small"
              type="button"
              onClick={this.props.handleRemove}
              data-test-subj={`tabsEditorRemoveControl${this.props.tabIndex}`}
            >
              <i aria-hidden="true" className="fa fa-times" />
            </button>
          </div>
        </div>

        {this.state.isCollapsed && this.renderEditor()}
      </div>
    );
  }
}

TabEditor.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  title: PropTypes.string,
  panelId: PropTypes.string,
  moveUp: PropTypes.func.isRequired,
  moveDown: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handlePanelChange: PropTypes.func.isRequired,
  getPanels: PropTypes.func.isRequired
};
