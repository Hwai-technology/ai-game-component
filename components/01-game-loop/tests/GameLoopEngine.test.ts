import test from 'node:test';
import assert from 'node:assert/strict';
import { GameLoopEngine } from '../src/engine/GameLoopEngine.ts';

test('GameLoopEngine: deterministic manual stepping with fixed timestep', () => {
  const loop = new GameLoopEngine({ fps: 60, fixedTimestep: true });
  let updateTicks = 0;
  let totalSimulatedTime = 0;

  loop.onUpdate(({ deltaTime, totalTime }) => {
    updateTicks++;
    totalSimulatedTime = totalTime;
    assert.equal(deltaTime, 1 / 60);
  });

  // Step exactly 1/30 second (33.33ms) -> should trigger exactly 2 fixed updates of 1/60s
  loop.step(1 / 30);

  assert.equal(updateTicks, 2);
  assert.equal(Math.round(totalSimulatedTime * 60), 2);
  assert.equal(loop.getState().frameCount, 2);

  loop.dispose();
});

test('GameLoopEngine: pause and resume states', () => {
  const loop = new GameLoopEngine({ fps: 60 });
  let count = 0;
  loop.onUpdate(() => count++);

  loop.pause();
  assert.equal(loop.getState().isPaused, true);
  loop.step(1 / 60);
  assert.equal(count, 0, 'No updates when paused');

  loop.resume();
  assert.equal(loop.getState().isPaused, false);
  loop.step(1 / 60);
  assert.equal(count, 1, 'Updates resume');

  loop.dispose();
});
