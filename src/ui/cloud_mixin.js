
export function cloudMixin(kbnServer, server) {
  let cloudEnabled = false;
  let cloudConfig = {};

  server.decorate('request', 'getCloudConfig', () => {
    return {
      enabled: cloudEnabled,
      ...cloudConfig
    };
  });

  server.decorate('server', 'setCloudConfig', (newCloudConfig) => {
    cloudEnabled = true;
    cloudConfig = newCloudConfig;
  });
}
