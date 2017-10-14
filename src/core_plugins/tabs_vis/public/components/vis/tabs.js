import '../../vis.less';
import React from 'react';
import PropTypes from 'prop-types';
import { DashboardViewMode } from '../../../../kibana/public/dashboard/dashboard_view_mode';
import { DashboardPanel } from '../../../../kibana/public/dashboard/panel';
import {
  KuiTabs,
  KuiTab,
} from 'ui_framework/components';

export function Tabs({ changeTab, children, getContainerApi, getEmbeddableHandler, panels, openPanel }) {

  console.log(openPanel);

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

  const renderPanels = () => {
    return panels.map((panel) => {
      const style = {
        zIndex: panel.tabId === openPanel.tabId ? 1 : -1
      };
      return (
        <div
          className="stackable"
          style={style}
          key={panel.tabId}
        >
          <DashboardPanel
            dashboardViewMode={DashboardViewMode.VIEW}
            isFullScreenMode={false}
            panel={panel}
            getEmbeddableHandler={getEmbeddableHandler}
            isExpanded={false}
            getContainerApi={getContainerApi}
            onToggleExpanded={() => {}}
            onDeletePanel={() => {}}
            onPanelFocused={() => {}}
            onPanelBlurred={() => {}}
          />
        </div>
      );
    });
  };

  return (
    <div className="tabs-vis">
      <KuiTabs>
        {renderTabs()}
      </KuiTabs>

      {renderPanels()}

    </div>
  );
}

Tabs.propTypes = {
  changeTab: PropTypes.func.isRequired,
  children: PropTypes.node,
  getContainerApi: PropTypes.func.isRequired,
  getEmbeddableHandler: PropTypes.func.isRequired,
  panels: PropTypes.array.isRequired,
  openPanel: PropTypes.object.isRequired
};
