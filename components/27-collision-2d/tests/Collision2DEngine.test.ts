import test from 'node:test';
import assert from 'node:assert/strict';
import { Collision2DEngine } from '../src/engine/Collision2DEngine.ts';

test('Collision2DEngine: tests AABB and Circle intersections accurately', () => {
  const engine = new Collision2DEngine(64);

  // Box 1: (0,0) to (50,50)
  engine.addCollider({
    id: 'b1',
    shape: { type: 'box', bounds: { x: 0, y: 0, width: 50, height: 50 } },
  });

  // Box 2: (40,40) to (90,90) -> overlaps b1!
  engine.addCollider({
    id: 'b2',
    shape: { type: 'box', bounds: { x: 40, y: 40, width: 50, height: 50 } },
  });

  // Circle 3: at (200, 200) radius 20 -> far away
  engine.addCollider({
    id: 'c3',
    shape: { type: 'circle', bounds: { x: 200, y: 200, radius: 20 } },
  });

  const pairs = engine.detectCollisions();
  assert.equal(pairs.length, 1);
  assert.ok(
    (pairs[0]!.a.id === 'b1' && pairs[0]!.b.id === 'b2') ||
      (pairs[0]!.a.id === 'b2' && pairs[0]!.b.id === 'b1')
  );

  engine.dispose();
});
