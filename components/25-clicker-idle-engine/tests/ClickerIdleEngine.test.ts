import test from 'node:test';
import assert from 'node:assert/strict';
import { ClickerIdleEngine } from '../src/engine/ClickerIdleEngine.ts';

test('ClickerIdleEngine: handles clicks, generator purchases, passive income, and offline math', () => {
  const engine = new ClickerIdleEngine({ initialCurrency: 100, clickPower: 5 });

  engine.registerGenerator({
    id: 'miner',
    name: 'Gold Miner',
    baseCost: 50,
    costMultiplier: 1.2,
    baseProductionPerSecond: 10,
  });

  // Manual click
  engine.click();
  assert.equal(engine.getState().currency, 105);

  // Buy miner (costs 50) -> currency 55, miner count 1
  const bought = engine.buyGenerator('miner');
  assert.equal(bought, true);
  assert.equal(engine.getState().currency, 55);
  assert.equal(engine.getPassiveIncomePerSecond(), 10);

  // Advance 3 seconds -> +30 currency -> 85
  engine.step(3);
  assert.equal(engine.getState().currency, 85);

  // Offline calculation: 10 seconds later -> +100 currency
  const now = Date.now();
  const offlineGain = engine.processOfflineProgress(now + 10000);
  assert.equal(offlineGain, 100);
  assert.equal(engine.getState().currency, 185);

  engine.dispose();
});
