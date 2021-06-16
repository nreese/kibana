/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// derived from https://raw.githubusercontent.com/joergdietrich/Leaflet.Terminator/master/index.js

// https://en.wikipedia.org/wiki/Julian_day
// Julian date is the number assigned to the solar day in the Julian day count
// starting from noon Universal time, with Julian day number 0 assigned to the day starting at noon on Monday, January 1, 4713 BC
// Julian day for UNIX EPOCH, 1970-01-01, is 2440587.5 days since Julian day 0;
const UNIX_EPOCH_JULIAN_DATE = 2440587.5;
const J2000 = 2451545.0;

const RADIANS_TO_DEGREES = 180 / Math.PI;
const DEGREES_TO_RADIANS = Math.PI / 180;

const MS_IN_DAY = 86400000;
const HOURS_IN_DAY = 24;

const resolution = 2;

export function getDayNightTerminator(timeExtent: Timeslice): Feature {
  const julianDate = getJulianDate(timeExtent.min);
  const gst = getGMST(julianDate);
  const latLng = [];

  const sunEclipticLongitude = getSunEclipticLongitude(julianDate);
  const eclipticObliquity = getEclipticObliquity(julianDate);
  const sunEquatorialPosition = getSunEquatorialPosition(sunEclipticLongitude, eclipticObliquity);
  for (let i = 0; i <= 720 * resolution; i++) {
    const lng = -360 + i / resolution;
    const hourAngle = getHourAngle(lng, sunEquatorialPosition, gst);
    latLng[i + 1] = [latitude(hourAngle, sunEquatorialPosition), lng];
  }
  if (sunEquatorialPosition.delta < 0) {
    latLng[0] = [90, -360];
    latLng[latLng.length] = [90, 360];
  } else {
    latLng[0] = [-90, -360];
    latLng[latLng.length] = [-90, 360];
  }
  return latLng;
}

function getJulianDate(date: number): number {
  const daysSinceUnixEpoch = date / MS_IN_DAY;
  return daysSinceUnixEpoch + UNIX_EPOCH_JULIAN_DATE;
}

function getGMST(julianDate: number) {
  /* Calculate Greenwich Mean Sidereal Time according to
     http://aa.usno.navy.mil/faq/docs/GAST.php */
  const daysSinceJ2000 = julianDate - J2000;
  // Low precision equation is good enough for our purposes.
  return (18.697374558 + 24.06570982441908 * daysSinceJ2000) % HOURS_IN_DAY;
}

// Compute the position of the Sun in ecliptic coordinates at julianDate.
// http://en.wikipedia.org/wiki/Position_of_the_Sun
function getSunEclipticLongitude(julianDate: number) {
  const daysSinceJ2000 = julianDate - J2000;
  let meanLongitudeOfSun = 280.46 + 0.9856474 * daysSinceJ2000;
  meanLongitudeOfSun %= 360;
  const meanAnomalyOfSun = 357.528 + 0.9856003 * daysSinceJ2000;
  g %= 360;

  return (
    meanLongitudeOfSun +
    1.915 * Math.sin(meanAnomalyOfSun * DEGREES_TO_RADIANS) +
    0.02 * Math.sin(2 * meanAnomalyOfSun * DEGREES_TO_RADIANS)
  );
}

// http://en.wikipedia.org/wiki/Axial_tilt#Obliquity_of_the_ecliptic_.28Earth.27s_axial_tilt.29
function getEclipticObliquity(julianDate: number) {
  const daysSinceJ2000 = julianDate - J2000;
  // Julian centuries since J2000.0
  const T = daysSinceJ2000 / 36525;
  return (
    23.43929111 -
    T *
      (46.836769 / 3600 -
        T *
          (0.0001831 / 3600 +
            T * (0.0020034 / 3600 - T * (0.576e-6 / 3600 - (T * 4.34e-8) / 3600))))
  );
}

/* Compute the Sun's equatorial position from its ecliptic
 * position. Inputs are expected in degrees. Outputs are in
 * degrees as well. */
function getSunEquatorialPosition(sunEclipticLongitude, eclipticObliquity) {
  let alpha =
    Math.atan(
      Math.cos(eclipticObliquity * DEGREES_TO_RADIANS) *
        Math.tan(sunEclipticLongitude * DEGREES_TO_RADIANS)
    ) * RADIANS_TO_DEGREES;
  const delta =
    Math.asin(
      Math.sin(eclipticObliquity * DEGREES_TO_RADIANS) *
        Math.sin(sunEclipticLongitude * DEGREES_TO_RADIANS)
    ) * RADIANS_TO_DEGREES;

  const lQuadrant = Math.floor(sunEclipticLongitude / 90) * 90;
  const raQuadrant = Math.floor(alpha / 90) * 90;
  alpha = alpha + (lQuadrant - raQuadrant);

  return { alpha, delta };
}

// Compute the hour angle of the sun for a longitude on
// Earth. Return the hour angle in degrees.
function getHourAngle(lng, sunEquatorialPosition, gst) {
  const lst = gst + lng / 15;
  return lst * 15 - sunEquatorialPosition.alpha;
}

// For a given hour angle and sun position, compute the
// latitude of the terminator in degrees.
function latitude(hourAngle, sunEquatorialPosition) {
  return (
    Math.atan(
      -Math.cos(hourAngle * DEGREES_TO_RADIANS) /
        Math.tan(sunEquatorialPosition.delta * DEGREES_TO_RADIANS)
    ) * RADIANS_TO_DEGREES
  );
}
