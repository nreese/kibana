const _ = require('lodash');
import { uiModules } from 'ui/modules';
import { DashboardViewMode } from '../../kibana/public/dashboard/dashboard_view_mode';
import { TabsContainerAPI } from './tabs_container_api';

const module = uiModules.get('kibana/tabs_vis', ['kibana']);
module.controller('KbnTabsVisController', ($scope, getAppState) => {
  $scope.viewOnlyMode = DashboardViewMode.VIEW;
  $scope.containerApi = new TabsContainerAPI($scope.uiState, getAppState());
  $scope.changeTab = (newTab) => {
    $scope.openTab = newTab.tabId;
    $scope.tabs.forEach((tab) => {
      if (newTab.tabId === tab.tabId) {
        tab.zIndex = 1;
      } else {
        tab.zIndex = -1;
      }
    });
  };
  $scope.renderComplete();

  $scope.$watch('vis.params', (visParams) => {
    $scope.tabs = _.cloneDeep(visParams.tabs).filter((tab) => {
      if (tab.id && tab.id.length > 0) {
        return true;
      }
      return false;
    });
    $scope.changeTab($scope.tabs[0]);
  });


});
