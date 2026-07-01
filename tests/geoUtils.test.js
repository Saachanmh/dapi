import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBearing,
  formatCoordinates,
  formatDistance,
  formatDuration,
  getCardinalDirection,
  isValidCoordinates,
} from '../src/utils/geoUtils.js';

test('formats distances and durations', () => {
  assert.equal(formatDistance(1.23), '1.2 km');
  assert.equal(formatDistance(0.42), '420 m');
  assert.equal(formatDuration(45), '45 min');
  assert.equal(formatDuration(125), '2h 5min');
});

test('validates and formats coordinates', () => {
  assert.equal(isValidCoordinates(47.218, -1.553), true);
  assert.equal(isValidCoordinates(120, 10), false);

  const coords = formatCoordinates(47.218, -1.553);
  assert.deepEqual(coords.latitude.degrees, 47);
  assert.deepEqual(coords.longitude.degrees, 1);
});

test('calculates bearing and direction', () => {
  const bearing = calculateBearing(47, 0, 47, 1);
  assert.ok(Math.abs(bearing - 90) < 1);
  assert.equal(getCardinalDirection(90), 'E');
});
