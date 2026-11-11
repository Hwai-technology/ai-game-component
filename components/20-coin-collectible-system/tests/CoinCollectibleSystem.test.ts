import test from 'node:test';
import assert from 'node:assert/strict';
import { CoinCollectibleSystem, MockHapticDriver } from '../src/engine/CoinCollectibleSystem.ts';

test('CoinCollectibleSystem: detects proximity collection and invokes haptics', () => {
  const haptic = new MockHapticDriver();
  const system = new CoinCollectibleSystem({
    collectionRadius: 20,
    hapticDriver: haptic,
  });

  system.spawn({ id: 'c1', type: 'coin', position: { x: 50, y: 50 }, value: 10 });
  system.spawn({ id: 'c2', type: 'coin', position: { x: 200, y: 200 }, value: 25 });

  // Player at (100, 100) -> too far from both
  const events1 = system.checkProximity({ x: 100, y: 100 });
  assert.equal(events1.length, 0);

  // Player moves to (55, 52) -> within 20px radius of c1!
  const events2 = system.checkProximity({ x: 55, y: 52 });
  assert.equal(events2.length, 1);
  assert.equal(events2[0]?.item.id, 'c1');
  assert.equal(system.getTotalValue(), 10);
  assert.equal(haptic.triggerCount, 1);

  // c1 should now be collected, cannot be collected again
  const events3 = system.checkProximity({ x: 55, y: 52 });
  assert.equal(events3.length, 0);

  system.dispose();
});

