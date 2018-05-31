/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { DashboardAddPanel } from './add_panel';
import React from 'react';
import ReactDOM from 'react-dom';

import {
  EuiPopover,
} from '@elastic/eui';

let isOpen = false;

export function showOptionsPopover(anchorElement) {
  if (isOpen) {
    return;
  }

  isOpen = true;

  const container = (
    <span>hello</span>
  );
  ReactDOM.render(container, anchorElement);

  const onClose = () => {
    //ReactDOM.unmountComponentAtNode(container);
    //isOpen = false;
  };

  const element = (
    <EuiPopover
      button={container}
      closePopover={onClose}
      isOpen={true}
    >
      <div style={{ width: '300px' }}>Popover content that&rsquo;s wider than the default width</div>
    </EuiPopover>
  );
  ReactDOM.render(element, anchorElement);
}
