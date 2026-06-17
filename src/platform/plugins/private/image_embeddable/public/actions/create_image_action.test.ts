/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { createImageAction } from './create_image_action';

jest.mock('@kbn/presentation-util', () => {
  return {
    openLazyFlyout: (...args: any[]) => {
      mockOpenLazyFlyout(args);
    },
  };
});

jest.mock('../components/image_editor/get_image_editor', () => {
  return {
    getImageEditor: (...args: any[]) => {
      mockGetImageEditor(args);
    },
  };
});

const mockOpenLazyFlyout = jest.fn();
const mockGetImageEditor = jest.fn();

const parentApi = {
  addNewPanel: jest.fn(),
};

describe('execute', () => {
  test('should add image panel to parent on save', async () => {
    createImageAction.execute({ embeddable: parentApi });
    expect(mockOpenLazyFlyout).toBeCalled();
    const { loadContent } = mockOpenLazyFlyout.mock.calls[0][0][0] ?? {};
    expect(loadContent).toBeDefined();
    await loadContent({
      closeFlyout: () => {},
      ariaLabelledBy: '',
    });
    expect(mockGetImageEditor).toBeCalled();
    const { onSave } = mockGetImageEditor.mock.calls[0][0][0] ?? {};
    expect(onSave).toBeDefined();
    onSave({});
    expect(parentApi.addNewPanel).toBeCalledWith({
      panelType: 'image',
      serializedState: { image_config: {} },
    });
  });
});
