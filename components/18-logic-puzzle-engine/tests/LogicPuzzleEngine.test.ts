import test from 'node:test';
import assert from 'node:assert/strict';
import { LogicPuzzleEngine } from '../src/engine/LogicPuzzleEngine.ts';

test('LogicPuzzleEngine: verifies constraint satisfaction and solves puzzle', () => {
  // 2x2 grid (indices 0, 1, 2, 3)
  // Constraint 1: row 0 (0,1) sum = 5
  // Constraint 2: row 1 (2,3) sum = 9
  // Constraint 3: col 0 (0,2) sum = 6
  // Constraint 4: col 1 (1,3) sum = 8
  // Solution: [2, 3, 4, 5] -> 2+3=5, 4+5=9, 2+4=6, 3+5=8
  const engine = new LogicPuzzleEngine({
    size: 2,
    constraints: [
      { id: 'r0', targetSum: 5, cellIndices: [0, 1] },
      { id: 'r1', targetSum: 9, cellIndices: [2, 3] },
      { id: 'c0', targetSum: 6, cellIndices: [0, 2] },
      { id: 'c1', targetSum: 8, cellIndices: [1, 3] },
    ],
  });

  engine.setCellValue(0, 2);
  engine.setCellValue(1, 3);
  assert.equal(engine.getState().isSolved, false);

  engine.setCellValue(2, 4);
  engine.setCellValue(3, 5);

  const state = engine.getState();
  assert.equal(state.isSolved, true);
  assert.equal(state.satisfiedConstraints.length, 4);

  engine.dispose();
});

