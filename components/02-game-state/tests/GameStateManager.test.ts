import test from 'node:test';
import assert from 'node:assert/strict';
import { GameStateManager } from '../src/engine/GameStateManager.ts';
import { StandardGameState } from '../src/types/index.ts';

test('GameStateManager: enforces valid transitions', () => {
  const fsm = new GameStateManager<StandardGameState>({
    initialState: 'idle',
    transitions: [
      { from: 'idle', to: 'loading' },
      { from: 'loading', to: 'ready' },
      { from: 'ready', to: 'playing' },
      { from: 'playing', to: 'paused' },
      { from: 'paused', to: 'playing' },
      { from: ['playing', 'paused'], to: 'game_over' },
    ],
  });

  assert.equal(fsm.getState(), 'idle');
  assert.equal(fsm.canTransitionTo('playing'), false, 'Cannot jump directly from idle to playing');

  fsm.transitionTo('loading');
  assert.equal(fsm.getState(), 'loading');

  fsm.transitionTo('ready');
  fsm.transitionTo('playing');
  assert.equal(fsm.is('playing'), true);

  fsm.transitionTo('game_over');
  assert.equal(fsm.getState(), 'game_over');
  assert.equal(fsm.getHistory().length, 5);

  fsm.dispose();
});

test('GameStateManager: fires onEnter and onExit lifecycle hooks', () => {
  const fsm = new GameStateManager<StandardGameState>({ initialState: 'idle' });
  let enteredPlaying = false;
  let exitedIdle = false;

  fsm.onExit('idle', () => {
    exitedIdle = true;
  });

  fsm.onEnter('playing', () => {
    enteredPlaying = true;
  });

  fsm.transitionTo('playing');
  assert.equal(exitedIdle, true);
  assert.equal(enteredPlaying, true);

  fsm.dispose();
});
