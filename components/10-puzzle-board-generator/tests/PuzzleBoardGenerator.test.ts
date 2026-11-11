import test from 'node:test';
import assert from 'node:assert/strict';
import { PuzzleBoardGenerator } from '../src/engine/PuzzleBoardGenerator.ts';

test('PuzzleBoardGenerator: generates identical grids from identical seeds', () => {
  const generator = new PuzzleBoardGenerator<number>();

  const board1 = generator.generate({ rows: 3, columns: 4, seed: 12345 });
  const board2 = generator.generate({ rows: 3, columns: 4, seed: 12345 });
  const board3 = generator.generate({ rows: 3, columns: 4, seed: 99999 });

  assert.deepEqual(board1.grid, board2.grid, 'Same seed must generate identical grids');
  assert.notDeepEqual(board1.grid, board3.grid, 'Different seeds should produce different layouts');
  assert.equal(board1.rows, 3);
  assert.equal(board1.columns, 4);
});

