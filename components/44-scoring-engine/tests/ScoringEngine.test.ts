import test from 'node:test';
import assert from 'node:assert/strict';
import { ScoringEngine } from '../src/engine/ScoringEngine.ts';

test('ScoringEngine: applies streak multipliers and drops combo after inactivity', () => {
  const engine = new ScoringEngine({ comboTimeoutSeconds: 2.0 });

  // Add 100 points
  const e1 = engine.addPoints(100);
  assert.equal(e1.multiplier, 1.0);
  assert.equal(e1.totalScore, 100);

  // Add points 4 more times -> 5 combo -> 1.5x multiplier!
  engine.addPoints(100);
  engine.addPoints(100);
  engine.addPoints(100);
  const e5 = engine.addPoints(100);
  assert.equal(e5.multiplier, 1.5);
  assert.equal(e5.pointsAdded, 150);

  // Wait 2.1s without scoring -> combo drops to 0
  engine.step(2.1);
  assert.equal(engine.getState().currentCombo, 0);
  assert.equal(engine.getState().multiplier, 1.0);

  engine.dispose();
});

