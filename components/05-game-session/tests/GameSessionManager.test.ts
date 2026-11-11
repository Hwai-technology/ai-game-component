import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSessionManager } from '../src/engine/GameSessionManager.ts';

test('GameSessionManager: tracks session metrics and duration accurately', async () => {
  const session = new GameSessionManager({ autoStart: true });

  assert.equal(session.getData().status, 'active');
  assert.ok(session.getData().sessionId.startsWith('sess_'));

  session.incrementMetric('coins_collected', 5);
  session.incrementMetric('coins_collected', 3);
  session.setMetric('level_reached', 2);

  assert.equal(session.getData().metrics['coins_collected'], 8);
  assert.equal(session.getData().metrics['level_reached'], 2);

  const ended = session.end();
  assert.equal(ended.status, 'ended');
  assert.ok(ended.endTime! >= ended.startTime);

  session.dispose();
});
