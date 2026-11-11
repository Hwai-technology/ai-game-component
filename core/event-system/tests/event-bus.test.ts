import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEventBus } from '../src/index.js';

test('GameEventBus emits events and invokes listeners', () => {
  type TestEvents = {
    scoreChanged: { newScore: number };
    gameOver: { reason: string };
  };

  const bus = new GameEventBus<TestEvents>();
  let receivedScore = 0;

  const unsubscribe = bus.on('scoreChanged', (payload) => {
    receivedScore = payload.newScore;
  });

  bus.emit('scoreChanged', { newScore: 100 });
  assert.equal(receivedScore, 100);

  unsubscribe();
  bus.emit('scoreChanged', { newScore: 200 });
  assert.equal(receivedScore, 100, 'Listener should have unsubscribed');
});

test('GameEventBus handles once listeners', () => {
  const bus = new GameEventBus<{ ping: number }>();
  let count = 0;

  bus.once('ping', () => {
    count++;
  });

  bus.emit('ping', 1);
  bus.emit('ping', 2);
  assert.equal(count, 1, 'once listener should only fire once');
});

