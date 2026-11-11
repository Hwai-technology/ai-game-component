import test from 'node:test';
import assert from 'node:assert/strict';
import { EndlessRunnerEngine } from '../src/engine/EndlessRunnerEngine.ts';

test('EndlessRunnerEngine: switches lanes, accelerates distance, and handles crash', () => {
  const runner = new EndlessRunnerEngine({ initialSpeed: 100, acceleration: 10 });

  assert.equal(runner.getState().lane, 1); // Center

  runner.performAction('lane_left');
  assert.equal(runner.getState().lane, 0); // Left

  runner.performAction('lane_left'); // Can't go further left
  assert.equal(runner.getState().lane, 0);

  runner.performAction('lane_right');
  assert.equal(runner.getState().lane, 1);

  // Step 2 seconds
  runner.step(2);
  assert.ok(runner.getState().distance >= 200);
  assert.ok(runner.getState().currentSpeed > 100);

  // Crash
  runner.triggerCrash();
  assert.equal(runner.getState().isGameOver, true);

  runner.dispose();
});

