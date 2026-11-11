import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryMatchingEngine } from '../src/engine/MemoryMatchingEngine.ts';

test('MemoryMatchingEngine: matches identical pairs and tracks victory', () => {
  // 2 pairs = 4 cards without shuffle
  const engine = new MemoryMatchingEngine({
    pairs: ['A', 'B'],
    shuffle: false,
  });

  // Cards layout: [A(0), A(1), B(2), B(3)]
  const state = engine.getState();
  assert.equal(state.cards.length, 4);

  // Flip A(0)
  const f1 = engine.flip(state.cards[0]!.id);
  assert.equal(f1.allMatched, false);

  // Flip A(1) -> Match!
  const f2 = engine.flip(state.cards[1]!.id);
  assert.equal(f2.isMatch, true);
  assert.equal(engine.getState().matchesCount, 1);

  // Flip B(2) and B(3) -> Second match -> All matched!
  engine.flip(state.cards[2]!.id);
  const f4 = engine.flip(state.cards[3]!.id);
  assert.equal(f4.allMatched, true);
  assert.equal(engine.getState().isComplete, true);
  assert.equal(engine.getState().moves, 2);

  engine.dispose();
});

