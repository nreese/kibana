import '../../vis.less';
import React from 'react';
import PropTypes from 'prop-types';
import { DashboardViewMode } from '../../../../kibana/public/dashboard/dashboard_view_mode';
import { DashboardPanel } from '../../../../kibana/public/dashboard/panel';
import {
  KuiTabs,
  KuiTab,
} from 'ui_framework/components';

export function Tabs({ changeTab, getContainerApi, getEmbeddableHandler, panels, openPanel }) {

  const tabs = panels.map((panel, index) => {
    return {
      id: panel.id,
      name: panel.title ? panel.title : index,
      panel: panel
    };
  });

  const renderTabs = () => {
    return tabs.map((tab) => (
      <KuiTab
        onClick={() => changeTab(tab.panel)}
        isSelected={tab.id === openPanel.id}
        key={tab.id}
      >
        {tab.name}
      </KuiTab>
    ));
  };

  const renderPanel = () => {
    if (!openPanel) {
      return;
    }
    return (
      <DashboardPanel
        dashboardViewMode={DashboardViewMode.VIEW}
        isFullScreenMode={false}
        panel={openPanel}
        getEmbeddableHandler={getEmbeddableHandler}
        isExpanded={false}
        getContainerApi={getContainerApi}
        onToggleExpanded={() => {}}
        onDeletePanel={() => {}}
        onPanelFocused={() => {}}
        onPanelBlurred={() => {}}
      />
    );
  };

  return (
    <div className="tabs-vis">
      <KuiTabs>
        {renderTabs()}
      </KuiTabs>

      {renderPanel()}

    </div>
  );
}

Tabs.propTypes = {
  changeTab: PropTypes.func.isRequired,
  getContainerApi: PropTypes.func.isRequired,
  getEmbeddableHandler: PropTypes.func.isRequired,
  panels: PropTypes.array.isRequired,
  openPanel: PropTypes.object.isRequired
};
