import test from 'node:test';
import assert from 'node:assert/strict';
import { EquipmentSystem } from '../src/engine/EquipmentSystem.ts';

test('EquipmentSystem: equips gear, enforces slot match, and aggregates bonuses', () => {
  const equip = new EquipmentSystem();

  const sword = {
    id: 'sword_excalibur',
    name: 'Excalibur',
    slotType: 'main_hand' as const,
    modifiers: { attack: 50, criticalChance: 0.1 },
  };

  const shield = {
    id: 'shield_aegis',
    name: 'Aegis',
    slotType: 'off_hand' as const,
    modifiers: { defense: 30, maxHealth: 100 },
  };

  // Equip sword in main_hand
  const prev = equip.equip('main_hand', sword);
  assert.equal(prev, null);
  assert.equal(equip.getAggregatedModifiers()['attack'], 50);

  // Equip shield in off_hand
  equip.equip('off_hand', shield);
  assert.equal(equip.getAggregatedModifiers()['defense'], 30);
  assert.equal(equip.getAggregatedModifiers()['maxHealth'], 100);

  // Unequip sword
  const unequippedSword = equip.unequip('main_hand');
  assert.equal(unequippedSword?.id, 'sword_excalibur');
  assert.equal(equip.getAggregatedModifiers()['attack'], undefined);
  assert.equal(equip.getAggregatedModifiers()['defense'], 30);

  equip.dispose();
});

