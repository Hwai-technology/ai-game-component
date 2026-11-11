import test from 'node:test';
import assert from 'node:assert/strict';
import { Physics2DAdapter } from '../src/engine/Physics2DAdapter.ts';

test('Physics2DAdapter: integrates velocity, gravity, and impulses', () => {
  const world = new Physics2DAdapter({ gravity: { x: 0, y: 100 }, airResistance: 0 });

  world.addBody({
    id: 'ball',
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    mass: 2,
    restitution: 0.8,
    friction: 0.1,
    gravityScale: 1,
  });

  // Apply upward impulse (y = -200)
  world.applyImpulse('ball', { x: 50, y: -200 });

  const body = world.getBody('ball')!;
  assert.equal(body.velocity.x, 25); // 50 / 2 = 25
  assert.equal(body.velocity.y, -100); // -200 / 2 = -100

  // Step 1 second -> gravity adds +100 to vy (-100 + 100 = 0)
  world.step(1);

  assert.equal(body.position.x, 25);
  assert.equal(body.position.y, 0); // y went down then up
  assert.equal(body.velocity.y, 0);

  world.dispose();
});

