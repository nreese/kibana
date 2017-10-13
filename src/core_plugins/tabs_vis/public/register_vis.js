import './vis.less';
import './tabs_vis_controller';
import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisController } from './vis_controller';
import { TabsVisEditor } from './components/vis_editor';

function TabsVisProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);

  // return the visType object, which kibana will use to display and configure new Vis object of this type.
  return VisFactory.createBaseVisualization({
    name: 'tabs_vis',
    title: 'Tabs',
    icon: 'fa fa-gear',
    description: 'Organize visualizations and searches in tabs',
    category: CATEGORY.OTHER,
    isExperimental: true,
    visualization: VisController,
    visConfig: {
      defaults: {
        tabs: []
      }
    },
    editor: 'default',
    editorConfig: {
      optionsTemplate: TabsVisEditor
    },
    requestHandler: 'none',
    responseHandler: 'none',
  });
}

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(TabsVisProvider);

// export the provider so that the visType can be required with Private()
export default TabsVisProvider;
