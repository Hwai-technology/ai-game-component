import test from 'node:test';
import assert from 'node:assert/strict';
import { HealthDamageSystem } from '../src/engine/HealthDamageSystem.ts';

test('HealthDamageSystem: applies defense mitigation, shield absorption, i-frames, and death', () => {
  const hp = new HealthDamageSystem({ maxHealth: 100, invulnerabilityDurationSeconds: 0.5 });

  // Add 30 shield
  hp.addShield(30);

  // Take 50 raw damage with 0 defense: 30 absorbed by shield, 20 from health -> health = 80
  const hit1 = hp.takeDamage(50, 0);
  assert.equal(hit1?.absorbedByShield, 30);
  assert.equal(hit1?.actualHealthLost, 20);
  assert.equal(hp.getState().currentHealth, 80);
  assert.equal(hp.getState().isInvulnerable, true);

  // Immediate second hit -> rejected by i-frames!
  const hit2 = hp.takeDamage(50, 0);
  assert.equal(hit2, null);

  // Advance time past i-frames (0.6s)
  hp.step(0.6);
  assert.equal(hp.getState().isInvulnerable, false);

  // Fatal blow
  let deathFired = false;
  hp.onDeath(() => (deathFired = true));
  hp.takeDamage(100, 0);

  assert.equal(hp.isDead(), true);
  assert.equal(deathFired, true);

  hp.dispose();
});
