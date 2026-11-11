import test from 'node:test';
import assert from 'node:assert/strict';
import { IPoolable } from '../src/types/index.ts';
import { SpawnPoolManager } from '../src/engine/SpawnPoolManager.ts';

interface Particle extends IPoolable {
  x: number;
  y: number;
}

test('SpawnPoolManager: reuses pooled entities without allocations', () => {
  let counter = 0;
  const pool = new SpawnPoolManager<Particle>({
    factory: () => ({ id: `p_${counter++}`, isActive: false, x: 0, y: 0 }),
    initialSize: 5,
    maxSize: 10,
  });

  assert.equal(pool.getPoolCount(), 5);
  assert.equal(pool.getActiveCount(), 0);

  // Acquire 2 particles
  const p1 = pool.acquire()!;
  const p2 = pool.acquire()!;
  assert.equal(p1.isActive, true);
  assert.equal(p2.isActive, true);
  assert.equal(pool.getActiveCount(), 2);
  assert.equal(pool.getPoolCount(), 3);

  // Release p1
  pool.release(p1);
  assert.equal(p1.isActive, false);
  assert.equal(pool.getActiveCount(), 1);
  assert.equal(pool.getPoolCount(), 4);

  // Re-acquire -> should return p1 (recycled!)
  const p3 = pool.acquire()!;
  assert.equal(p3.id, p1.id);

  pool.dispose();
});
