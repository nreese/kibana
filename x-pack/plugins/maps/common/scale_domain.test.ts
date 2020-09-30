/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  scaleLonToXDomain,
  scaleLatToYDomain,
  scaleXDomainToLat,
  scaleYDomainToLon,
} from './scale_domain';

test('scaleLatToYDomain', () => {
  const yMin = 100;
  const yMax = 200;
  const yRange = yMax - yMin;
  expect(scaleLatToYDomain(0.5, yMin, yRange)).toBe(150);
  expect(scaleLatToYDomain(0.25, yMin, yRange)).toBe(125);
});

test('scaleLonToXDomain', () => {
  const xMin = 100;
  const xMax = 200;
  const xRange = xMax - xMin;
  expect(scaleLonToXDomain(0.5, xMin, xRange)).toBe(150);
  expect(scaleLonToXDomain(0.25, xMin, xRange)).toBe(125);
});

test('scaleXDomainToLat', () => {
  const xMin = 100;
  const xMax = 200;
  const xRange = xMax - xMin;
  expect(scaleXDomainToLat(150, xMin, xRange)).toBe(0.5);
  expect(scaleXDomainToLat(125, xMin, xRange)).toBe(0.25);
});

test('scaleYDomainToLon', () => {
  const xMin = 100;
  const xMax = 200;
  const xRange = xMax - xMin;
  expect(scaleYDomainToLon(150, xMin, xRange)).toBe(0.5);
  expect(scaleYDomainToLon(125, xMin, xRange)).toBe(0.25);
});
