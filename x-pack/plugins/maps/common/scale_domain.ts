/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export function scaleLonToXDomain(
  lon: number,
  lonMin: number,
  lonRange: number,
  xMin: number,
  xDomainRange: number
) {
  return scale(lon, lonMin, lonRange, xMin, xDomainRange);
}

export function scaleLatToYDomain(
  lat: number,
  latMin: number,
  latRange: number,
  yMin: number,
  yDomainRange: number
) {
  return scale(lat, latMin, latRange, yMin, yDomainRange);
}

export function scaleXDomainToLon(
  x: number,
  xMin: number,
  xDomainRange: number,
  lonMin: number,
  lonRange: number
) {
  return scale(x, xMin, xDomainRange, lonMin, lonRange);
}

export function scaleYDomainToLat(
  x: number,
  yMin: number,
  yDomainRange: number,
  latMin: number,
  latRange: number
) {
  return scale(x, yMin, yDomainRange, latMin, latRange);
}

function scale(
  oldValue: number,
  oldMin: number,
  oldRange: number,
  newMin: number,
  newRange: number
) {
  return ((oldValue - oldMin) * newRange) / oldRange + newMin;
}
