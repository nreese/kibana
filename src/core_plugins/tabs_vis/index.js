export default function (kibana) {
  return new kibana.Plugin({
    require: ['kibana'],
    uiExports: {
      visTypes: [
        'plugins/tabs_vis/register_vis'
      ]
    }
  });
}
