import test from 'node:test';
import assert from 'node:assert/strict';
import { LeaderboardAdapter } from '../src/engine/LeaderboardAdapter.ts';

test('LeaderboardAdapter: submits scores and sorts ranks in descending order', async () => {
  const leaderboard = new LeaderboardAdapter();

  await leaderboard.submitScore('p1', 'Alice', 100);
  await leaderboard.submitScore('p2', 'Bob', 350);
  await leaderboard.submitScore('p3', 'Charlie', 200);

  const top = await leaderboard.getTopScores(3);
  assert.equal(top.length, 3);
  assert.equal(top[0]?.playerName, 'Bob');
  assert.equal(top[0]?.rank, 1);
  assert.equal(top[1]?.playerName, 'Charlie');
  assert.equal(top[1]?.rank, 2);
  assert.equal(top[2]?.playerName, 'Alice');
  assert.equal(top[2]?.rank, 3);

  // Bob updates score to 500
  await leaderboard.submitScore('p2', 'Bob', 500);
  const bobRank = await leaderboard.getPlayerRank('p2');
  assert.equal(bobRank?.score, 500);
  assert.equal(bobRank?.rank, 1);

  leaderboard.dispose();
});
