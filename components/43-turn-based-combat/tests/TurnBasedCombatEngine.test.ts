import test from 'node:test';
import assert from 'node:assert/strict';
import { TurnBasedCombatEngine } from '../src/engine/TurnBasedCombatEngine.ts';

test('TurnBasedCombatEngine: executes speed-based turn order and resolves victory', () => {
  const battle = new TurnBasedCombatEngine([
    { id: 'hero', name: 'Knight', team: 'player', hp: 100, maxHp: 100, attack: 40, defense: 10, speed: 20 },
    { id: 'goblin', name: 'Goblin', team: 'enemy', hp: 30, maxHp: 30, attack: 15, defense: 5, speed: 10 },
  ]);

  // Knight has higher speed (20 > 10) -> acts first
  assert.equal(battle.getActiveCombatant()?.id, 'hero');

  // Knight attacks goblin
  const turn1 = battle.executeAction({
    actorId: 'hero',
    type: 'attack',
    targetId: 'goblin',
  });

  // Damage = 40 - floor(5/2) = 38 -> goblin HP drops from 30 to 0 -> defeated!
  assert.equal(turn1.targetDefeated, true);
  assert.equal(turn1.battleOver, true);
  assert.equal(turn1.winner, 'player');
  assert.equal(battle.getState().isBattleOver, true);

  battle.dispose();
});

