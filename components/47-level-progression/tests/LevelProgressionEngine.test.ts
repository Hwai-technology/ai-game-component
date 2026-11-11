import test from 'node:test';
import assert from 'node:assert/strict';
import { LevelProgressionEngine } from '../src/engine/LevelProgressionEngine.ts';

test('LevelProgressionEngine: completes level, unlocks next level, and calculates stars', () => {
  const progression = new LevelProgressionEngine({ totalLevels: 5, initialUnlockedLevels: 1 });

  assert.equal(progression.getLevel(1)?.isUnlocked, true);
  assert.equal(progression.getLevel(2)?.isUnlocked, false);

  // Complete level 1 with 3 stars and 5000 score
  const res = progression.completeLevel(1, 5000, 3);
  assert.equal(res.starsEarned, 3);
  assert.equal(res.nextLevelUnlocked, true);

  assert.equal(progression.getLevel(2)?.isUnlocked, true);

  const summary = progression.getSummary();
  assert.equal(summary.completedLevelsCount, 1);
  assert.equal(summary.totalStarsEarned, 3);
  assert.equal(summary.highestLevelUnlocked, 2);

  progression.dispose();
});
