import test from 'node:test';
import assert from 'node:assert/strict';
import { SetDictionaryAdapter, WordPuzzleEngine } from '../src/engine/WordPuzzleEngine.ts';

test('WordPuzzleEngine: validates contiguous letter paths against dictionary', () => {
  // Grid:
  // [ C, A, T ]
  // [ O, P, S ]
  const grid = [
    ['C', 'A', 'T'],
    ['O', 'P', 'S'],
  ];

  const dictionary = new SetDictionaryAdapter(['CAT', 'CATS', 'TOP', 'STOP']);
  const engine = new WordPuzzleEngine({
    grid,
    dictionary,
    minWordLength: 3,
  });

  // Submit "CAT" (0,0 -> 0,1 -> 0,2)
  const res1 = engine.submitPath([
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ]);

  assert.equal(res1.valid, true);
  assert.equal(res1.word, 'CAT');
  assert.ok(res1.score > 0);

  // Duplicate submission
  const res2 = engine.submitPath([
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ]);
  assert.equal(res2.valid, false);
  assert.equal(res2.reason, 'ALREADY_FOUND');

  engine.dispose();
});
