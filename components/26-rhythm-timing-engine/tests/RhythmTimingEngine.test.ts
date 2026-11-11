import test from 'node:test';
import assert from 'node:assert/strict';
import { RhythmTimingEngine } from '../src/engine/RhythmTimingEngine.ts';

test('RhythmTimingEngine: classifies hits into perfect, great, good, and miss windows', () => {
  const engine = new RhythmTimingEngine({
    perfectWindowMs: 40,
    greatWindowMs: 80,
    goodWindowMs: 140,
  });

  // Track has note 1 at 1000ms on track 0, and note 2 at 2000ms on track 1
  engine.loadTrack([
    { id: 'n1', targetTimeMs: 1000, trackIndex: 0 },
    { id: 'n2', targetTimeMs: 2000, trackIndex: 1 },
  ]);

  // Step to 980ms (20ms before note 1)
  engine.step(0.98);

  // User taps track 0 at 980ms -> 20ms delta <= 40ms -> Perfect!
  const hit1 = engine.triggerTap(0);
  assert.equal(hit1.rating, 'perfect');
  assert.equal(hit1.combo, 1);
  assert.ok(hit1.scoreAwarded >= 300);

  // Step past note 2 without tapping (step to 2200ms -> 200ms past note 2 > 140ms good window -> Auto Miss!)
  const misses = engine.step(1.22);
  assert.equal(misses.length, 1);
  assert.equal(misses[0]?.rating, 'miss');
  assert.equal(engine.getState().combo, 0, 'Combo reset on miss');
  assert.equal(engine.getState().notesMissed, 1);

  engine.dispose();
});
