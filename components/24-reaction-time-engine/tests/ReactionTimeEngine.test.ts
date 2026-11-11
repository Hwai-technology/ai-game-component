import test from 'node:test';
import assert from 'node:assert/strict';
import { ReactionTimeEngine } from '../src/engine/ReactionTimeEngine.ts';

test('ReactionTimeEngine: detects false start and measures valid tap latency', () => {
  const engine = new ReactionTimeEngine({ minDelayMs: 2000, maxDelayMs: 4000 });

  // 1. False start test
  engine.startRound();
  assert.equal(engine.getState().state, 'waiting');

  const falseStartRes = engine.press();
  assert.equal(falseStartRes.isFalseStart, true);
  assert.equal(engine.getState().state, 'false_start');

  // 2. Valid prompt test
  engine.startRound();
  engine.triggerPrompt(10000); // prompt fired at t=10000
  assert.equal(engine.getState().state, 'ready');

  const res = engine.press(10220); // user pressed at t=10220 -> 220ms!
  assert.equal(res.isFalseStart, false);
  assert.equal(res.reactionTimeMs, 220);
  assert.equal(res.rating, 'Lightning Fast');
  assert.equal(engine.getState().bestReactionTimeMs, 220);

  engine.dispose();
});
