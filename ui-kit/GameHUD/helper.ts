/**
 * Formats time remaining in seconds to MM:SS string or returns string representation.
 */
export function formatTimerValue(time: string | number): string {
  if (typeof time === 'string') return time;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats large scores with standard grouping delimiters.
 */
export function formatScoreValue(score?: number): string {
  if (score == null) return '0';
  return score.toLocaleString();
}

