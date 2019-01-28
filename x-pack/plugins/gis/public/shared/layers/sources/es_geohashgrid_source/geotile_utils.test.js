import { parseTileKey, getTilePolygon } from './geotile_utils';

it('Should parse tile key', () => {
  expect(parseTileKey('15/23423/1867')).toEqual({
    zoom: 15,
    x: 23423,
    y: 1867,
    tileCount: Math.pow(2, 15)
  });
})

it('Should convert tile key to geojson Polygon', () => {
  const geometry = getTilePolygon('15/23423/1867');
  expect(geometry).toEqual({
    coordinates: [
      [
        [77.34375, 82.92546],
        [77.33276, 82.92546],
        [77.33276, 82.92411],
        [77.34375, 82.92411],
        [77.34375, 82.92546],
      ],
    ],
    type: 'Polygon',
  });
});
