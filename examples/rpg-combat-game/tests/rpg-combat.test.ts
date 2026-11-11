import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RpgCombatGame } from '../src/index.js';

describe('RpgCombatGame Composition Suite', () => {
  it('initializes stats, inventory, equipment, and combatants', () => {
    const game = new RpgCombatGame({ name: 'Paladin Arthur', strength: 20 });
    assert.equal(game.inventory.getItemCount('potion_hp'), 3);
    assert.equal(game.heroHealth.getState().currentHealth, 100);

    const activeActor = game.combat.getActiveCombatant();
    assert.ok(activeActor);
    // Hero has 14 speed vs goblin 10, so Hero acts first
    assert.equal(activeActor.id, game.heroId);
  });

  it('equips weapons and enhances character stats', () => {
    const game = new RpgCombatGame();
    const initialStrength = game.stats.getEffectivePrimary().strength;

    game.equipWeapon({
      id: 'sword_excalibur',
      name: 'Excalibur',
      slotType: 'main_hand',
      modifiers: { strength: 10 },
    });

    const boostedStrength = game.stats.getEffectivePrimary().strength;
    assert.equal(boostedStrength, initialStrength + 10);
  });

  it('executes combat turns, skill casts, and potion consumption', () => {
    const game = new RpgCombatGame();

    // 1. Hero takes first turn: casts 'slash'
    const result = game.heroCastSkill('slash');
    assert.equal(result.skillUsed, true);
    assert.ok(result.turnResult.damageInflicted > 0);
    assert.ok(result.turnResult.target);
    assert.ok(result.turnResult.target.hp < 80, 'Enemy must take damage');

    // 2. Enemy takes second turn
    const enemyResult = game.enemyAutoTurn();
    assert.ok(enemyResult);
    assert.equal(enemyResult.actor.id, game.enemyId);
    assert.ok(enemyResult.damageInflicted > 0);

    // 3. Hero uses potion
    const initialCount = game.inventory.getItemCount('potion_hp');
    const potionUsed = game.useHealthPotion();
    assert.equal(potionUsed, true);
    assert.equal(game.inventory.getItemCount('potion_hp'), initialCount - 1);
  });

  it('provides cartoon styled UI tokens for HP bars and action cards', () => {
    const game = new RpgCombatGame();
    const theme = game.getCombatUiTheme();
    assert.ok(theme.heroHpBar.fill);
    assert.ok(theme.enemyHpBar.fill);
    assert.notEqual(theme.heroHpBar.fill, theme.enemyHpBar.fill);
    assert.equal(theme.heroHpBar.borderRadius, 999);
  });
});
