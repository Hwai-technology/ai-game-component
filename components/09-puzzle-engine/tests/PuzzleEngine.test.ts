import test from 'node:test';
import assert from 'node:assert/strict';
import { PuzzleEngine } from '../src/engine/PuzzleEngine.ts';
import { IPuzzleRule } from '../src/types/index.ts';

// Simple Light Switch Puzzle: State is array of boolean switches. All must be true to win.
const switchRule: IPuzzleRule<boolean[], number> = {
  isValidMove: (state, index) => index >= 0 && index < state.length,
  applyMove: (state, index) => {
    const next = [...state];
    next[index] = !next[index];
    return next;
  },
  checkWin: (state) => state.every((s) => s === true),
};

test('PuzzleEngine: validates moves and reaches win condition', () => {
  const puzzle = new PuzzleEngine<boolean[], number>({
    initialState: [false, true, false],
    rule: switchRule,
    maxMoves: 10,
  });

  assert.equal(puzzle.makeMove(0), true);
  assert.equal(puzzle.getResult().completed, false);

  assert.equal(puzzle.makeMove(2), true);
  const result = puzzle.getResult();
  assert.equal(result.completed, true);
  assert.equal(result.success, true);
  assert.equal(result.moves, 2);

  puzzle.dispose();
});

