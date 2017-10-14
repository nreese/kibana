const _ = require('lodash');
import React from 'react';
import { TabsContainerAPI } from './tabs_container_api';
import { render, unmountComponentAtNode } from 'react-dom';
import { Tabs } from './components/vis/tabs';

export class VisController {
  constructor(el, vis) {
    this.el = el;
    this.vis = vis;
    this.openPanel;
    this.panels = [];
    this.containerApi = new TabsContainerAPI(vis.getUiState(), vis.API.getAppState);
  }

  render(visData, status) {
    if (status.params) {
      this.panels = _.cloneDeep(this.vis.params.tabs).filter((panel) => {
        if (panel.id && panel.id.length > 0) {
          return true;
        }
        return false;
      });
      if (this.openPanel) {
        this.changeTab(this.openPanel);
      } else if (this.panels.length > 0) {
        this.changeTab(this.panels[0]);
      }
    }
    return Promise.resolve();
  }

  drawVis() {
    render(
      <Tabs
        changeTab={this.changeTab}
        getContainerApi={this.getContainerApi}
        getEmbeddableHandler={this.getEmbeddableHandler}
        panels={this.panels}
        openPanel={this.openPanel}
      />,
      this.el);
  }

  destroy() {
    unmountComponentAtNode(this.el);
  }

  changeTab = (newPanel) => {
    this.openPanel = newPanel;
    this.drawVis();
  }

  getEmbeddableHandler = (panelType) => {
    return this.vis.API.embeddableHandlers.byName[panelType];
  }

  getContainerApi = () => {
    return this.containerApi;
  }
}
