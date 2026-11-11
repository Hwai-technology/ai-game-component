import test from 'node:test';
import assert from 'node:assert/strict';
import { PlatformerMovementSystem } from '../src/engine/PlatformerMovementSystem.ts';

test('PlatformerMovementSystem: jumps, executes double jump, and lands on floor', () => {
  const player = new PlatformerMovementSystem(
    { jumpVelocity: -400, gravity: 1000, maxDoubleJumps: 1 },
    { x: 0, y: 100 }
  );

  // Initial step on floor (floorY = 100)
  player.step(0.016, 0, 100);
  assert.equal(player.getState().isGrounded, true);

  // Jump
  player.requestJump();
  player.step(0.016, 0, 100);
  assert.equal(player.getState().isGrounded, false);
  assert.equal(player.getState().isJumping, true);
  assert.ok(player.getState().position.y < 100);

  // Double jump in mid-air
  player.step(0.1, 0, 100);
  player.requestJump();
  player.step(0.016, 0, 100);
  assert.equal(player.getState().canDoubleJump, false, 'Consumed double jump');
  assert.ok(player.getState().velocity.y <= -300);

  // Fall back to ground
  player.step(1.5, 0, 100);
  assert.equal(player.getState().position.y, 100);
  assert.equal(player.getState().isGrounded, true);

  player.dispose();
});
