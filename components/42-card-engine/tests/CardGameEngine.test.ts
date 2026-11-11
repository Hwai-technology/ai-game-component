import test from 'node:test';
import assert from 'node:assert/strict';
import { CardGameEngine } from '../src/engine/CardGameEngine.ts';

test('CardGameEngine: draws cards, honors hand limits, and reshuffles discards', () => {
  const engine = new CardGameEngine({
    maxHandSize: 3,
    initialDeck: [
      { id: 'c1', name: 'Strike' },
      { id: 'c2', name: 'Defend' },
      { id: 'c3', name: 'Slash' },
    ],
  });

  // Draw 2 cards
  const drawn = engine.draw(2);
  assert.equal(drawn.length, 2);
  assert.equal(engine.getState().hand.length, 2);
  assert.equal(engine.getState().drawPileCount, 1);

  // Play c1 -> moves to discard
  const played = engine.playCard(drawn[0]!.id);
  assert.equal(played.id, drawn[0]!.id);
  assert.equal(engine.getState().hand.length, 1);
  assert.equal(engine.getState().discardPileCount, 1);

  // Draw 2 cards -> 1 from draw pile, then discard pile reshuffled to give 2nd card!
  const drawn2 = engine.draw(2);
  assert.equal(drawn2.length, 2);
  assert.equal(engine.getState().hand.length, 3); // Hand full at 3!

  engine.dispose();
});

