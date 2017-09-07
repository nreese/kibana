import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TabEditor } from './tab_editor';
import { KuiButton, KuiButtonIcon } from 'ui_framework/components';
import { addTab, moveTab, newTab, removeTab, setTab } from '../editor_utils';

export class TabsVisEditor extends Component {
  constructor(props) {
    super(props);

    this.getPanels = async (search) => {
      const visualizations = await props.scope.vis.API.savedObjectsClient.find({
        type: ['visualization'],
        fields: ['title'],
        search: `${search}*`,
        search_fields: ['title^3', 'description'],
        perPage: 25
      });
      return visualizations.savedObjects;
      /*const searches = await props.scope.vis.API.savedObjectsClient.find({
        type: ['search'],
        fields: ['title'],
        search: `${search}*`,
        search_fields: ['title^3', 'description'],
        perPage: 20
      });

      return visualizations.savedObjects.concat(searches.savedObjects);*/
    };
  }

  setVisParam(paramName, paramValue) {
    const params = _.cloneDeep(this.props.scope.vis.params);
    params[paramName] = paramValue;
    this.props.stageEditorParams(params);
  }

  handleTabTitleChange(tabIndex, evt) {
    const updatedTab = this.props.scope.vis.params.tabs[tabIndex];
    updatedTab.title = evt.target.value;
    this.setVisParam('tabs', setTab(this.props.scope.vis.params.tabs, tabIndex, updatedTab));
  }

  handlePanelChange(tabIndex, evt) {
    const updatedTab = this.props.scope.vis.params.tabs[tabIndex];
    updatedTab.id = evt.value;
    this.setVisParam('tabs', setTab(this.props.scope.vis.params.tabs, tabIndex, updatedTab));
  }

  handleRemoveTab(tabIndex) {
    this.setVisParam('tabs', removeTab(this.props.scope.vis.params.tabs, tabIndex));
  }

  moveTab(tabIndex, direction) {
    this.setVisParam('tabs', moveTab(this.props.scope.vis.params.tabs, tabIndex, direction));
  }

  handleAddTab() {
    this.setVisParam('tabs', addTab(this.props.scope.vis.params.tabs, newTab()));
  }

  renderTabs() {
    return this.props.scope.vis.params.tabs.map((tabParams, tabIndex) => {
      return (
        <TabEditor
          key={tabParams.tabId}
          tabIndex={tabIndex}
          title={tabParams.title}
          panelId={tabParams.id}
          moveUp={this.moveTab.bind(this, tabIndex, -1)}
          moveDown={this.moveTab.bind(this, tabIndex, 1)}
          handleRemove={this.handleRemoveTab.bind(this, tabIndex)}
          handleTitleChange={this.handleTabTitleChange.bind(this, tabIndex)}
          handlePanelChange={this.handlePanelChange.bind(this, tabIndex)}
          getPanels={this.getPanels}
        />
      );
    });
  }

  render() {
    return (
      <div>

        {this.renderTabs()}

        <div className="kuiSideBarFormRow">
          <KuiButton
            buttonType="primary"
            type="button"
            icon={<KuiButtonIcon type="create" />}
            onClick={this.handleAddTab.bind(this)}
            data-test-subj="tabsEditorAddBtn"
          >
            Add
          </KuiButton>
        </div>
      </div>
    );
  }
}

TabsVisEditor.propTypes = {
  scope: PropTypes.object.isRequired,
  stageEditorParams: PropTypes.func.isRequired
};
