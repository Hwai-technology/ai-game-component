import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEventManager } from '../src/engine/GameEventManager.ts';

test('GameEventManager: middleware can inspect or drop events', () => {
  type Events = { chat: { message: string } };
  const manager = new GameEventManager<Events>({ enableTelemetry: true });
  const received: string[] = [];

  // Filter profanity / dropped words
  manager.use((env) => {
    if (env.name === 'chat' && (env.payload as { message: string }).message.includes('spam')) {
      return false; // drop
    }
    return true;
  });

  manager.on('chat', (payload) => {
    received.push(payload.message);
  });

  manager.emit('chat', { message: 'hello world' });
  manager.emit('chat', { message: 'this is spam' });

  assert.equal(received.length, 1);
  assert.equal(received[0], 'hello world');
  assert.equal(manager.getHistory().length, 1);

  manager.dispose();
});
