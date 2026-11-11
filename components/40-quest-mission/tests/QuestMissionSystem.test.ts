import test from 'node:test';
import assert from 'node:assert/strict';
import { QuestMissionSystem } from '../src/engine/QuestMissionSystem.ts';

test('QuestMissionSystem: tracks multi-objective progress and unlocks prerequisite quests', () => {
  const quests = new QuestMissionSystem();

  // Quest 1: Tutorial
  quests.registerQuest({
    id: 'q_tutorial',
    title: 'Begin Journey',
    description: 'Collect coins and defeat 1 slime',
    objectives: [
      { id: 'coins', description: 'Collect 10 coins', targetCount: 10, currentCount: 0, isCompleted: false },
      { id: 'slime', description: 'Defeat 1 slime', targetCount: 1, currentCount: 0, isCompleted: false },
    ],
    rewards: { coins: 100, xp: 50 },
  });

  // Quest 2: Locked behind Quest 1
  quests.registerQuest({
    id: 'q_boss',
    title: 'Defeat Dragon',
    description: 'Slain the ancient beast',
    prerequisiteQuestIds: ['q_tutorial'],
    objectives: [{ id: 'boss', description: 'Defeat boss', targetCount: 1, currentCount: 0, isCompleted: false }],
  });

  assert.equal(quests.getQuest('q_tutorial')?.status, 'available');
  assert.equal(quests.getQuest('q_boss')?.status, 'locked');

  // Start Tutorial
  quests.startQuest('q_tutorial');
  assert.equal(quests.getQuest('q_tutorial')?.status, 'in_progress');

  // Advance coins
  quests.advanceObjective('q_tutorial', 'coins', 10);
  assert.equal(quests.getQuest('q_tutorial')?.progressPercentage, 50);
  assert.equal(quests.getQuest('q_tutorial')?.status, 'in_progress');

  // Advance slime -> completes quest!
  let completedId = '';
  quests.onQuestComplete((id) => (completedId = id));
  quests.advanceObjective('q_tutorial', 'slime', 1);

  assert.equal(quests.getQuest('q_tutorial')?.status, 'completed');
  assert.equal(completedId, 'q_tutorial');

  // Quest 2 should now automatically unlock to 'available'!
  assert.equal(quests.getQuest('q_boss')?.status, 'available');

  quests.dispose();
});
