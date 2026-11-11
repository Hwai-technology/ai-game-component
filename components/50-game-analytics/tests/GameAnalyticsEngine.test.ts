import test from 'node:test';
import assert from 'node:assert/strict';
import { GameAnalyticsEngine, MemoryAnalyticsProvider } from '../src/engine/GameAnalyticsEngine.ts';

test('GameAnalyticsEngine: buffers events and flushes at batch threshold', () => {
  const provider = new MemoryAnalyticsProvider();
  const analytics = new GameAnalyticsEngine({ batchSize: 3, provider });

  analytics.track('game_start', { level: 1 });
  analytics.track('coin_pickup', { count: 5 });
  assert.equal(analytics.getBufferedCount(), 2);
  assert.equal(provider.recordedEvents.length, 0);

  // 3rd event reaches batch threshold -> auto flushes
  analytics.track('player_death', { reason: 'spike' });
  assert.equal(analytics.getBufferedCount(), 0);
  assert.equal(provider.recordedEvents.length, 3);
  assert.equal(provider.recordedEvents[0]?.eventName, 'game_start');

  analytics.dispose();
});

