import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistance } from '../src/services/routingService.js';

test('calculates haversine distance', () => {
  const distance = calculateDistance(47.218, -1.553, 47.323, -1.552);
  assert.ok(distance > 11);
  assert.ok(distance < 12.5);
});
