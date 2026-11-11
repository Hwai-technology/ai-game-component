import test from 'node:test';
import assert from 'node:assert/strict';
import { CharacterStatsEngine } from '../src/engine/CharacterStatsEngine.ts';

test('CharacterStatsEngine: calculates derived statistics and levels up with XP', () => {
  const stats = new CharacterStatsEngine({
    level: 1,
    initialAttributes: { strength: 15, agility: 10, intelligence: 10, vitality: 12 },
  });

  const d1 = stats.getDerived();
  assert.equal(d1.maxHealth, 12 * 10 + 20); // 140
  assert.equal(d1.attackPower, 15 * 2 + 10); // 40

  // Add 150 XP -> Level 1 needs 100 XP -> Levels up to Level 2!
  const lvlUp = stats.addXp(150);
  assert.equal(lvlUp.levelsGained, 1);
  assert.equal(lvlUp.currentLevel, 2);
  assert.equal(stats.getState().level, 2);

  // Strength grew from 15 to 17
  assert.equal(stats.getState().primary.strength, 17);

  stats.dispose();
});
