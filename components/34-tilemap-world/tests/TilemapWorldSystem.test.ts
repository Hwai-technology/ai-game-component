import test from 'node:test';
import assert from 'node:assert/strict';
import { TilemapWorldSystem } from '../src/engine/TilemapWorldSystem.ts';

test('TilemapWorldSystem: projects coordinates and detects solid tile collision', () => {
  // 32x32 tiles, 3x3 grid
  // Collision layer has a solid wall at tile (1, 1) -> tileId = 1
  const map = new TilemapWorldSystem({
    tileWidth: 32,
    tileHeight: 32,
    layers: [
      {
        name: 'collision',
        isSolid: true,
        data: [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 0],
        ],
      },
    ],
  });

  // World pos (10, 10) is in tile (0, 0) -> not solid
  assert.equal(map.isWorldPosSolid({ x: 10, y: 10 }), false);

  // World pos (40, 40) is in tile (1, 1) -> SOLID!
  assert.equal(map.isWorldPosSolid({ x: 40, y: 40 }), true);

  // Out of bounds -> solid
  assert.equal(map.isWorldPosSolid({ x: -5, y: 10 }), true);

  map.dispose();
});

