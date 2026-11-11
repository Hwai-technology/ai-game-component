import test from 'node:test';
import assert from 'node:assert/strict';
import { SudokuEngine } from '../src/engine/SudokuEngine.ts';

test('SudokuEngine: detects duplicate conflicts and provides valid hints', () => {
  const engine = new SudokuEngine();

  // Enter number 5 at (0,0) and (0,3) in the same row -> Conflict!
  engine.setCellValue(0, 0, 5);
  engine.setCellValue(0, 3, 5);

  const state = engine.getState();
  assert.equal(state.grid[0]![0]!.hasConflict, true);
  assert.equal(state.grid[0]![3]!.hasConflict, true);
  assert.equal(state.isValid, false);

  // Clear conflict
  engine.setCellValue(0, 3, 0);
  assert.equal(engine.getState().isValid, true);

  // Hint test
  const hint = engine.getHint();
  assert.ok(hint !== null);
  assert.ok(hint.value >= 1 && hint.value <= 9);

  engine.dispose();
});

