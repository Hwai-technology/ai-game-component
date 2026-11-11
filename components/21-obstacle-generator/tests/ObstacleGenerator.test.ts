import test from 'node:test';
import assert from 'node:assert/strict';
import { ObstacleGenerator } from '../src/engine/ObstacleGenerator.ts';

test('ObstacleGenerator: generates obstacles at defined distance intervals', () => {
  const gen = new ObstacleGenerator({ spawnIntervalMeters: 50, lanesCount: 3 });

  // Distance = 20 -> no spawn
  const s1 = gen.updateDistance(20, 600);
  assert.equal(s1.length, 0);

  // Distance = 55 -> spawns 1 obstacle
  const s2 = gen.updateDistance(55, 600);
  assert.equal(s2.length, 1);
  const obs = s2[0]!;
  assert.ok(obs.lane >= 0 && obs.lane <= 2);

  // Distance = 105 -> spawns 2nd obstacle
  const s3 = gen.updateDistance(105, 600);
  assert.equal(s3.length, 1);
  assert.equal(gen.getActiveObstacles().length, 2);

  gen.dispose();
});
