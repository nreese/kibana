
import { uiModules } from 'ui/modules';
import React from 'react';

export const kibanaContext = React.createContext({});
export let indexPatterns;

uiModules.get('gis').run(($injector) => {
  indexPatterns = $injector.get('indexPatterns');
  console.log('yesss!!!');
});
