import test from 'node:test';
import assert from 'node:assert/strict';
import { SkillAbilitySystem } from '../src/engine/SkillAbilitySystem.ts';

test('SkillAbilitySystem: checks mana cost, applies cooldown, and steps timers', () => {
  const skills = new SkillAbilitySystem();

  skills.learnSkill({
    id: 'fireball',
    name: 'Fireball',
    manaCost: 30,
    cooldownSeconds: 4,
    targetType: 'single_target',
    basePower: 80,
  });

  // Not enough mana (has 20, needs 30)
  const failCast = skills.cast('fireball', 20);
  assert.equal(failCast.success, false);
  assert.equal(failCast.reason, 'INSUFFICIENT_MANA');

  // Successful cast with 50 mana
  const successCast = skills.cast('fireball', 50);
  assert.equal(successCast.success, true);
  assert.equal(successCast.manaConsumed, 30);

  // Cast immediately again -> rejected by cooldown
  const cdCast = skills.cast('fireball', 50);
  assert.equal(cdCast.success, false);
  assert.equal(cdCast.reason, 'ON_COOLDOWN');

  // Step 4.1s -> cooldown resets
  skills.step(4.1);
  const readyCast = skills.cast('fireball', 50);
  assert.equal(readyCast.success, true);

  skills.dispose();
});
