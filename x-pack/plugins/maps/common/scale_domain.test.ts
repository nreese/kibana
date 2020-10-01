/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  scaleLonToXDomain,
  scaleLatToYDomain,
  scaleXDomainToLon,
  scaleYDomainToLat,
} from './scale_domain';

const lonMin = 0;
const lonMax = 1;
const lonRange = lonMax - lonMin;
const latMin = 0;
const latMax = 1;
const latRange = latMax - latMin;

test('scaleLatToYDomain', () => {
  const yMin = 100;
  const yMax = 200;
  const yRange = yMax - yMin;
  expect(scaleLatToYDomain(0.5, latMin, latRange, yMin, yRange)).toBe(150);
  expect(scaleLatToYDomain(0.25, latMin, latRange, yMin, yRange)).toBe(125);
});

test('scaleLonToXDomain', () => {
  const xMin = 100;
  const xMax = 200;
  const xRange = xMax - xMin;
  expect(scaleLonToXDomain(0.5, lonMin, lonRange, xMin, xRange)).toBe(150);
  expect(scaleLonToXDomain(0.25, lonMin, lonRange, xMin, xRange)).toBe(125);
});

test('scaleXDomainToLon', () => {
  const xMin = 100;
  const xMax = 200;
  const xRange = xMax - xMin;
  expect(scaleXDomainToLon(150, xMin, xRange, lonMin, lonRange)).toBe(0.5);
  expect(scaleXDomainToLon(125, xMin, xRange, lonMin, lonRange)).toBe(0.25);
});

test('scaleYDomainToLat', () => {
  const xMin = 100;
  const xMax = 200;
  const xRange = xMax - xMin;
  expect(scaleYDomainToLat(150, xMin, xRange, latMin, latRange)).toBe(0.5);
  expect(scaleYDomainToLat(125, xMin, xRange, latMin, latRange)).toBe(0.25);
});
