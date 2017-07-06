export function geoContains(collar, bounds) {
  //test if bounds top_left is inside collar
  if(bounds.top_left.lat > collar.top_left.lat || bounds.top_left.lon < collar.top_left.lon) {
    return false;
  }

  //test if bounds bottom_right is inside collar
  if(bounds.bottom_right.lat < collar.bottom_right.lat || bounds.bottom_right.lon > collar.bottom_right.lon) {
    return false;
  }

  //both corners are inside collar so collar contains bounds
  return true;
}
