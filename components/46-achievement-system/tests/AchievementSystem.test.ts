import test from 'node:test';
import assert from 'node:assert/strict';
import { AchievementSystem } from '../src/engine/AchievementSystem.ts';

test('AchievementSystem: tracks incremental progress and triggers unlock events', () => {
  const achSystem = new AchievementSystem();

  achSystem.register({
    id: 'coin_hoarder',
    title: 'Coin Hoarder',
    description: 'Collect 100 coins',
    maxProgress: 100,
    rewardCoins: 50,
  });

  let unlockFired = false;
  achSystem.onUnlock((evt) => {
    if (evt.achievement.definition.id === 'coin_hoarder') {
      unlockFired = true;
    }
  });

  // Progress 60 coins -> not yet unlocked
  achSystem.addProgress('coin_hoarder', 60);
  assert.equal(achSystem.getAchievement('coin_hoarder')?.isUnlocked, false);
  assert.equal(achSystem.getAchievement('coin_hoarder')?.currentProgress, 60);

  // Progress 40 more coins -> unlocks!
  const evt = achSystem.addProgress('coin_hoarder', 40);
  assert.ok(evt !== null);
  assert.equal(achSystem.getAchievement('coin_hoarder')?.isUnlocked, true);
  assert.equal(unlockFired, true);

  achSystem.dispose();
});
