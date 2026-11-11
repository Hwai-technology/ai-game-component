import test from 'node:test';
import assert from 'node:assert/strict';
import { GameTimerSystem } from '../src/engine/GameTimerSystem.ts';

test('GameTimerSystem: runs countdown, triggers expire callback, and respects pause', () => {
  const system = new GameTimerSystem();
  const timer = system.createTimer({
    mode: 'countdown',
    durationSeconds: 10,
    autoStart: true,
  });

  let expiredFired = false;
  timer.onExpire(() => {
    expiredFired = true;
  });

  // Step 4 seconds
  system.step(4);
  assert.equal(timer.getState().remainingSeconds, 6);
  assert.equal(timer.getState().isExpired, false);

  // Pause timer
  timer.pause();
  system.step(3);
  assert.equal(timer.getState().remainingSeconds, 6, 'Should not advance while paused');

  // Resume and finish
  timer.resume();
  system.step(7);
  assert.equal(timer.getState().remainingSeconds, 0);
  assert.equal(timer.getState().isExpired, true);
  assert.equal(expiredFired, true);

  system.dispose();
});

