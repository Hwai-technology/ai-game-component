import test from 'node:test';
import assert from 'node:assert/strict';
import { PowerUpSystem } from '../src/engine/PowerUpSystem.ts';

test('PowerUpSystem: activates buffs, extends duration, and handles expiration', () => {
  const system = new PowerUpSystem();

  system.register({
    id: 'shield',
    name: 'Energy Shield',
    durationSeconds: 5,
    stackingPolicy: 'extend',
    cooldownSeconds: 2,
  });

  assert.equal(system.isActive('shield'), false);

  system.activate('shield');
  assert.equal(system.isActive('shield'), true);
  assert.equal(system.getActiveBuff('shield')?.remainingSeconds, 5);

  // Extend with 2nd activation
  system.activate('shield');
  assert.equal(system.getActiveBuff('shield')?.remainingSeconds, 10);

  // Step 6 seconds -> remaining = 4s
  system.step(6);
  assert.equal(system.isActive('shield'), true);
  assert.equal(system.getActiveBuff('shield')?.remainingSeconds, 4);

  // Step 5 seconds -> expired!
  let expiredId = '';
  system.onLifecycle((evt) => {
    if (evt.type === 'expired') expiredId = evt.id;
  });

  system.step(5);
  assert.equal(system.isActive('shield'), false);
  assert.equal(expiredId, 'shield');

  system.dispose();
});

