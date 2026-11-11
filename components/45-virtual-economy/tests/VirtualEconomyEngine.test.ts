import test from 'node:test';
import assert from 'node:assert/strict';
import { VirtualEconomyEngine } from '../src/engine/VirtualEconomyEngine.ts';

test('VirtualEconomyEngine: manages currency balances and denies overspending', () => {
  const economy = new VirtualEconomyEngine({
    initialBalances: { coins: 50, gems: 5 },
  });

  assert.equal(economy.getBalance('coins'), 50);
  assert.equal(economy.canAfford('coins', 60), false);
  assert.equal(economy.canAfford('coins', 40), true);

  // Spend 40 coins
  const tx1 = economy.spend('coins', 40, 'shop_potion');
  assert.equal(tx1.balanceAfter, 10);
  assert.equal(economy.getBalance('coins'), 10);

  // Try overspending -> throws error
  assert.throws(() => {
    economy.spend('coins', 20);
  }, /Insufficient coins/i);

  // Earn coins
  const tx2 = economy.earn('coins', 100, 'level_reward');
  assert.equal(tx2.balanceAfter, 110);
  assert.equal(economy.getBalance('coins'), 110);
  assert.equal(economy.getState().transactions.length, 2);

  economy.dispose();
});
