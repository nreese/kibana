import { ContainerAPI } from 'ui/embeddable';

export class TabsContainerAPI extends ContainerAPI {
  constructor(uiState, appState) {
    super();
    this.uiState = uiState;
    this.appState = appState;
  }

  addFilter() {}

  updatePanel() {}

  getAppState() {
    return this.appState;
  }

  createChildUistate(path, initialState) {
    console.log(this.uiState);
    return this.uiState.createChild(path, initialState, true);
  }

  registerPanelIndexPattern() {}

}
