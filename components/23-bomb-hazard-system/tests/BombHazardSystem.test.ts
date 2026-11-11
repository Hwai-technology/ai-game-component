import test from 'node:test';
import assert from 'node:assert/strict';
import { BombHazardSystem } from '../src/engine/BombHazardSystem.ts';

test('BombHazardSystem: detonates on fuse expiration and applies radial damage falloff', () => {
  const system = new BombHazardSystem();

  // Place bomb at (0, 0) with radius 100, baseDamage 100, fuse 2.0s
  system.placeBomb('b1', { x: 0, y: 0 }, 100, 100, 2.0);

  const targets = [
    { id: 'near_player', position: { x: 10, y: 0 } }, // 10 units away -> high damage
    { id: 'far_player', position: { x: 80, y: 0 } }, // 80 units away -> lower damage
    { id: 'outside_player', position: { x: 150, y: 0 } }, // 150 units away -> outside radius!
  ];

  // Advance 1 second -> still ticking
  const d1 = system.step(1.0, targets);
  assert.equal(d1.length, 0);

  // Advance 1.1 seconds -> explodes!
  const d2 = system.step(1.1, targets);
  assert.equal(d2.length, 1);

  const impacts = d2[0]!.impacts;
  assert.equal(impacts.length, 2, 'Only 2 targets inside radius');

  const near = impacts.find((i) => i.targetId === 'near_player')!;
  const far = impacts.find((i) => i.targetId === 'far_player')!;

  assert.ok(near.damageInflicted > far.damageInflicted, 'Near target takes more damage');

  system.dispose();
});
