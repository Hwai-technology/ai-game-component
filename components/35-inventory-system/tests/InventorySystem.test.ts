import test from 'node:test';
import assert from 'node:assert/strict';
import { InventorySystem } from '../src/engine/InventorySystem.ts';

test('InventorySystem: stacks stackable items and swaps slots', () => {
  const inv = new InventorySystem({ maxSlots: 5 });

  const potion = { id: 'potion_heal', name: 'Health Potion', isStackable: true, maxStack: 10 };
  const sword = { id: 'sword_iron', name: 'Iron Sword', isStackable: false };

  // Add 6 potions
  const added1 = inv.addItem(potion, 6);
  assert.equal(added1, 6);
  assert.equal(inv.getItemCount('potion_heal'), 6);

  // Add 6 more potions -> 10 in slot 0, 2 in slot 1
  const added2 = inv.addItem(potion, 6);
  assert.equal(added2, 6);
  assert.equal(inv.getItemCount('potion_heal'), 12);
  assert.equal(inv.getState().slots[0]?.quantity, 10);
  assert.equal(inv.getState().slots[1]?.quantity, 2);

  // Add sword into slot 2
  inv.addItem(sword, 1);
  assert.equal(inv.getState().slots[2]?.item.id, 'sword_iron');

  // Swap slot 1 and slot 2
  inv.swapSlots(1, 2);
  assert.equal(inv.getState().slots[1]?.item.id, 'sword_iron');
  assert.equal(inv.getState().slots[2]?.item.id, 'potion_heal');

  inv.dispose();
});
