const _ = require('lodash');
import { uiModules } from 'ui/modules';
import { DashboardViewMode } from '../../kibana/public/dashboard/dashboard_view_mode';
import { TabsContainerAPI } from './tabs_container_api';

const module = uiModules.get('kibana/tabs_vis', ['kibana']);
module.controller('KbnTabsVisController', ($scope, getAppState) => {
  $scope.tabs = _.cloneDeep($scope.vis.params.tabs);
  $scope.viewOnlyMode = DashboardViewMode.VIEW;
  $scope.containerApi = new TabsContainerAPI($scope.uiState, getAppState());
  $scope.changeTab = (newTab) => {
    $scope.openTab = newTab.id;
    $scope.tabs.forEach((tab) => {
      if (newTab.id === tab.id) {
        tab.zIndex = 1;
      } else {
        tab.zIndex = -1;
      }
    });
  };
  $scope.changeTab($scope.tabs[0]);
  $scope.renderComplete();
});
