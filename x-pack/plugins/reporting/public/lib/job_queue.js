/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { addSystemApiHeader } from 'ui/system_api';
import { kfetch } from 'ui/kfetch';

const baseUrl = '../api/reporting/jobs';

export const reportingJobQueue = {
  list(page = 0) {
    return kfetch({
      pathname: `${baseUrl}/list`,
      query: { page },
      headers: addSystemApiHeader({})
    });
  },

  total() {
    return kfetch({
      pathname: `${baseUrl}/count`,
      headers: addSystemApiHeader({})
    });
  },

  getContent(jobId) {
    return kfetch({
      pathname: `${baseUrl}/output/${jobId}`,
      headers: addSystemApiHeader({})
    });
  }
};
