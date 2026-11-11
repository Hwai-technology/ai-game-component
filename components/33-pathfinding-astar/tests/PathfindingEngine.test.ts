import test from 'node:test';
import assert from 'node:assert/strict';
import { PathfindingEngine } from '../src/engine/PathfindingEngine.ts';

test('PathfindingEngine: finds path around obstacle wall using A*', () => {
  const finder = new PathfindingEngine({ allowDiagonal: false });

  // 3x3 grid:
  // [ S, -1, G ]  where -1 is wall at (1, 0)
  // [ 0,  0, 0 ]
  // [ 0,  0, 0 ]
  const grid = [
    [0, -1, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const start = { x: 0, y: 0 };
  const goal = { x: 2, y: 0 };

  const result = finder.findPath(grid, start, goal);
  assert.equal(result.found, true);
  assert.ok(result.path.length > 0);

  // Path must not step into obstacle (1,0)
  const hitsWall = result.path.some((pt) => pt.x === 1 && pt.y === 0);
  assert.equal(hitsWall, false, 'Path navigated around obstacle');

  assert.deepEqual(result.path[0], start);
  assert.deepEqual(result.path[result.path.length - 1], goal);

  finder.dispose();
});
