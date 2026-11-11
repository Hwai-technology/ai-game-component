import test from 'node:test';
import assert from 'node:assert/strict';
import { CharacterMovementController } from '../src/engine/CharacterMovementController.ts';

test('CharacterMovementController: accelerates towards input and decelerates when released', () => {
  const controller = new CharacterMovementController({
    maxSpeed: 100,
    acceleration: 200,
    deceleration: 300,
  });

  // Step 0.5s moving right (input = { x: 1, y: 0 }) -> speed reaches 100
  controller.step(0.5, { x: 1, y: 0 });
  const state1 = controller.getState();
  assert.equal(state1.facing, 'right');
  assert.equal(state1.velocity.x, 100);
  assert.ok(state1.position.x > 0);

  // Release input (input = { x: 0, y: 0 }) -> decelerates
  controller.step(0.2, { x: 0, y: 0 });
  const state2 = controller.getState();
  assert.ok(state2.velocity.x < 100);

  controller.dispose();
});

