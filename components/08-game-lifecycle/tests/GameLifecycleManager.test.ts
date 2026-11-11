import test from 'node:test';
import assert from 'node:assert/strict';
import { GameLifecycleManager, MockLifecycleAdapter } from '../src/engine/GameLifecycleManager.ts';

test('GameLifecycleManager: triggers pause on background and respects resumePolicy', () => {
  const adapter = new MockLifecycleAdapter();
  const manager = new GameLifecycleManager({ resumePolicy: 'auto_resume' }, adapter);

  let pauseCount = 0;
  let resumeCount = 0;

  manager.onPauseRequired(() => pauseCount++);
  manager.onResumeAllowed(() => resumeCount++);
  manager.notifyGameRunning(true);

  // Background the app
  adapter.simulateStateChange('background');
  assert.equal(manager.getState(), 'background');
  assert.equal(pauseCount, 1);

  // Bring back to foreground
  adapter.simulateStateChange('active');
  assert.equal(manager.getState(), 'active');
  assert.equal(resumeCount, 1);

  manager.dispose();
});
