import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchThreeEngine } from '../src/engine/MatchThreeEngine.ts';

test('MatchThreeEngine: swaps adjacent tiles, eliminates matches, and awards score', () => {
  // Setup 3x3 deterministic grid where swapping (0,0) and (0,1) creates a horizontal match of type 1:
  // Initial:
  // [2, 1, 1]
  // [1, 3, 4]
  // [4, 2, 0]
  // After swap (0,0) with (1,0): Row 0 has 1, 1, 1!
  const initialGrid = [
    [2, 1, 1],
    [1, 3, 4],
    [4, 2, 0],
  ];

  const engine = new MatchThreeEngine({
    rows: 3,
    columns: 3,
    initialGrid,
    maxMoves: 10,
  });

  assert.equal(engine.canSwap({ from: { row: 0, col: 0 }, to: { row: 1, col: 0 } }), true);

  const steps = engine.swap({ from: { row: 0, col: 0 }, to: { row: 1, col: 0 } });
  assert.ok(steps.length >= 1, 'Should resolve at least 1 match step');
  assert.ok(engine.getState().score > 0, 'Should gain score');
  assert.equal(engine.getState().movesRemaining, 9);

  engine.dispose();
});

