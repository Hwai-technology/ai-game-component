/**
 * Computes difference from high score.
 */
export function getScoreComparison(score: number, highScore?: number): string | null {
  if (highScore == null) return null;
  const diff = highScore - score;
  if (diff <= 0) return 'NEW PERSONAL RECORD!';
  return `${diff.toLocaleString()} points to new record`;
}

