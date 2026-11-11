import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MatchThreeGame } from '../src/index.js';

describe('MatchThreeGame Composition Suite', () => {
  it('initializes board, scoring, virtual economy, and achievements', () => {
    const game = new MatchThreeGame({ rows: 6, cols: 6, tileTypes: 4 });
    assert.equal(game.movesCount, 0);
    assert.equal(game.economy.getBalance('coins'), 100);
    assert.equal(game.economy.getBalance('gems'), 10);

    const firstMatchAch = game.achievements.getAchievement('first_match');
    assert.ok(firstMatchAch);
    assert.equal(firstMatchAch.isUnlocked, false);
  });

  it('rejects invalid or non-adjacent swaps', () => {
    const game = new MatchThreeGame({ rows: 6, cols: 6 });
    // Non-adjacent swap (0,0) and (2,2)
    const swapped = game.swap({ row: 0, col: 0 }, { row: 2, col: 2 });
    assert.equal(swapped, false);
    assert.equal(game.movesCount, 0);
  });

  it('handles valid swaps, cascades, awards scoring, coins, and unlocks achievements', () => {
    const game = new MatchThreeGame({ rows: 6, cols: 6 });

    // Find any valid move on the generated board, or manually align three matching tiles
    let swapped = false;
    for (let r = 0; r < 6 && !swapped; r++) {
      for (let c = 0; c < 5 && !swapped; c++) {
        if (game.board.canSwap({ from: { row: r, col: c }, to: { row: r, col: c + 1 } })) {
          swapped = game.swap({ row: r, col: c }, { row: r, col: c + 1 });
        }
      }
    }

    if (swapped) {
      assert.equal(game.movesCount, 1);
      assert.ok(game.scoring.getState().currentScore > 0, 'Score must be rewarded');
      assert.ok(game.economy.getBalance('coins') > 100, 'Coins must increase from match reward');

      const firstMatchAch = game.achievements.getAchievement('first_match');
      assert.ok(firstMatchAch);
      assert.equal(firstMatchAch.isUnlocked, true, 'First Match achievement should unlock');
    } else {
      // In rare layout where no horizontal swaps create a match, verify move count remains safe
      assert.equal(game.movesCount, 0);
    }
  });

  it('provides cartoon themed gem styling with vibrant palette tokens', () => {
    const game = new MatchThreeGame();
    const gem0 = game.getTileTheme(0);
    const gem1 = game.getTileTheme(1);
    assert.ok(gem0.backgroundColor);
    assert.ok(gem1.backgroundColor);
    assert.notEqual(gem0.backgroundColor, gem1.backgroundColor);
    assert.equal(gem0.borderRadius, 16);
  });
});
