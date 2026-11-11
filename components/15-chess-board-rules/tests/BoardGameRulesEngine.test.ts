import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardGameRulesEngine } from '../src/engine/BoardGameRulesEngine.ts';

test('BoardGameRulesEngine: manages turns, validates moves, and records captures', () => {
  const engine = new BoardGameRulesEngine(8, 8);

  // Place a white orthogonal piece at (0,0) and black piece at (0,3)
  engine.placePiece({ row: 0, col: 0 }, { id: 'w1', type: 'orthogonal', color: 'white' });
  engine.placePiece({ row: 0, col: 3 }, { id: 'b1', type: 'orthogonal', color: 'black' });

  assert.equal(engine.getState().currentTurn, 'white');
  assert.equal(engine.canMove({ row: 0, col: 0 }, { row: 0, col: 3 }), true);

  // Execute capture
  const moveRes = engine.move({ row: 0, col: 0 }, { row: 0, col: 3 });
  assert.equal(moveRes.captured?.id, 'b1');
  assert.equal(engine.getState().currentTurn, 'black', 'Turn rotates to black');
  assert.equal(engine.getPiece({ row: 0, col: 0 }), null);
  assert.equal(engine.getPiece({ row: 0, col: 3 })?.id, 'w1');

  engine.dispose();
});

