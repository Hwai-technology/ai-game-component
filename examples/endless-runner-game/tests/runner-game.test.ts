import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EndlessRunnerGame } from '../src/index.js';

describe('EndlessRunnerGame Composition Example', () => {
  it('initializes composed engines and starts game', () => {
    const game = new EndlessRunnerGame({ initialSpeed: 200 });
    assert.equal(game.isGameOver, false);
    assert.equal(game.currentLane, 1); // Middle lane (0, 1, 2)
    assert.equal(game.coinsCollected, 0);

    game.start();
    assert.equal(game.loop.getState().isRunning, true);
    game.stop();
    assert.equal(game.loop.getState().isRunning, false);
  });

  it('handles lane switching, jumps, and slides', () => {
    const game = new EndlessRunnerGame();
    game.start();

    game.moveLeft();
    assert.equal(game.currentLane, 0);

    game.moveRight();
    assert.equal(game.currentLane, 1);

    game.jump();
    assert.equal(game.runner.getState().isJumping, true);

    game.stop();
  });

  it('updates distance, collects spawned coins, and accumulates score', () => {
    const game = new EndlessRunnerGame();

    // Spawn a coin directly at player position in lane 1
    game.spawnCoin(1, 0, 5);

    // Simulate 1 tick of 0.1s
    game.tick(0.1);

    assert.ok(game.runner.getState().distance > 0, 'Distance must advance');
    assert.ok(game.scoring.getState().currentScore > 0, 'Score must increase');
    assert.equal(game.coinsCollected, 1, 'Player should collect coin at current lane');
  });

  it('provides cartoon UI theme tokens for rendering without RN dependencies', () => {
    const game = new EndlessRunnerGame();
    const theme = game.getRenderTheme();
    assert.ok(theme.tokens.palette.purple);
    assert.equal(theme.tokens.chunky.pressTravel, 3);
    assert.ok(theme.playerStyle.backgroundColor);
  });
});
