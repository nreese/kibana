export const setTab = (tabs, tabIndex, tab) => [
  ...tabs.slice(0, tabIndex),
  tab,
  ...tabs.slice(tabIndex + 1)
];

export const addTab = (tabs, tab) => [...tabs, tab];

export const moveTab = (tabs, tabIndex, direction) => {
  let newIndex;
  if (direction >= 0) {
    newIndex = tabIndex + 1;
  } else {
    newIndex = tabIndex - 1;
  }

  if (newIndex < 0) {
    // Move first item to last
    return [
      ...tabs.slice(1),
      tabs[0]
    ];
  } else if (newIndex >= tabs.length) {
    const lastItemIndex = tabs.length - 1;
    // Move last item to first
    return [
      tabs[lastItemIndex],
      ...tabs.slice(0, lastItemIndex)
    ];
  } else {
    const swapped = tabs.slice();
    const temp = swapped[newIndex];
    swapped[newIndex] = swapped[tabIndex];
    swapped[tabIndex] = temp;
    return swapped;
  }
};

export const removeTab = (tabs, tabIndex) => [
  ...tabs.slice(0, tabIndex),
  ...tabs.slice(tabIndex + 1)
];

export const newTab = () => ({
  tabId: (new Date()).getTime().toString(),
  id: '', // panel saved object id
  title: '',
  type: 'visualization'
});
