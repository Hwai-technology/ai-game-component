import test from 'node:test';
import assert from 'node:assert/strict';
import { SlidingPuzzleSystem } from '../src/engine/SlidingPuzzleSystem.ts';

test('SlidingPuzzleSystem: validates adjacent sliding and recognizes victory', () => {
  // Board: [1, 2, 3, 4, 5, 6, 7, 0, 8] -> 8 is at pos 8, empty is at pos 7.
  // Sliding 8 left into 7 yields [1, 2, 3, 4, 5, 6, 7, 8, 0] -> SOLVED!
  const puzzle = new SlidingPuzzleSystem({
    size: 3,
    initialTiles: [1, 2, 3, 4, 5, 6, 7, 0, 8],
  });

  assert.equal(puzzle.getState().isSolved, false);
  assert.equal(puzzle.canSlide(1), false, 'Tile 1 is not adjacent to empty tile');
  assert.equal(puzzle.canSlide(8), true, 'Tile 8 is adjacent to empty tile');

  puzzle.slide(8);
  assert.equal(puzzle.getState().isSolved, true, 'Board should now be solved');
  assert.equal(puzzle.getState().moves, 1);

  puzzle.dispose();
});
