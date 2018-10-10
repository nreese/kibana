const INDEX_NAME = '.kibana_actions';

let omniActionIndexCreation;

const createOmniActionIndex = (callCluster) => {
  const createIndexParams = {
    index: INDEX_NAME,
    body: {
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      },
      mappings: {
        _doc: {
          properties: {
            actionTitle: {
              type: 'text'
            },
            appName: {
              type: 'text'
            },
            relativeUrl: {
              type: 'keyword'
            },
            isGlobal: {
              type: 'boolean'
            },
          }
        }
      }
    }
  };

  // delete index if exists

  return callCluster('indices.create', createIndexParams);
}

const registerOmniBarAction = async (callCluster, { id, actionTitle, appName, isGlobal, relativeUrl }) => {
  await omniActionIndexCreation;

  const insertCmd = {
    index: {
      _index: INDEX_NAME
    }
  };

  // Just using bulk because I had that example handy - should not use bulk
  const bulk = [];
  bulk.push({
    index: {
      _index: INDEX_NAME
    }
  });
  bulk.push({
    _id: id,
    actionTitle,
    appName,
    relativeUrl,
    isGlobal,
  });
  callCluster('bulk', { body: bulk });
}

export async function omniBarMixin(kbnServer, server) {
  const adminCluster = server.plugins.elasticsearch.getCluster('admin');
  const callCluster = adminCluster.callWithInternalUser.bind(adminCluster);

  try {
    omniActionIndexCreation = createOmniActionIndex(callCluster);
  } catch (error) {
    throw new Error('Unable to create omni bar action index');
  }

  server.decorate('server', 'registerOmniBarAction',
    ({ id, actionTitle, appName, isGlobal, relativeUrl }) => {
    registerOmniBarAction(callCluster, { id, actionTitle, appName, isGlobal, relativeUrl })
  });

  // register stuff for OSS apps
}
