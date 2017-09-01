import './vis.less';
import './tabs_vis_controller';
import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import tabsVisTemplate from './tabs_vis.html';
import tabsOptionsTemplate from './tabs_vis_options.html';

function TabsVisProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);

  // return the visType object, which kibana will use to display and configure new Vis object of this type.
  return VisFactory.createAngularVisualization({
    name: 'tabs_vis',
    title: 'Tabs',
    icon: 'fa fa-gear',
    description: 'Organize visualizations and searches in tabs',
    category: CATEGORY.OTHER,
    visConfig: {
      template: tabsVisTemplate,
      defaults: {
        tabs: [
          {
            title: '1',
            type: 'visualization',
            id: '8d265790-8f2d-11e7-8c54-f9aca5a9885c',
          },
          {
            title: '2',
            type: 'visualization',
            id: '0c606250-8e5f-11e7-b53f-350aa627b95a',
          },
          {
            title: '3',
            type: 'visualization',
            id: '73fbab40-8e5f-11e7-b53f-350aa627b95a',
          }
        ]
      }
    },
    editorConfig: {
      optionsTemplate: tabsOptionsTemplate
    },
    requestHandler: 'none',
    responseHandler: 'none',
  });
}

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(TabsVisProvider);

// export the provider so that the visType can be required with Private()
export default TabsVisProvider;
