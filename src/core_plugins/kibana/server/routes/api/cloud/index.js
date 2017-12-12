export function registerCloudApi(server) {
  server.route({
    path: '/api/kibana/cloud',
    method: ['GET'],
    handler: (request, reply) => {
      reply(request.getCloudConfig());
    }
  });
}
