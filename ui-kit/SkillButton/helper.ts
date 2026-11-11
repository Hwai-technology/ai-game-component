/**
 * Formats fractional cooldown seconds for overlay display.
 */
export function formatCooldownDisplay(seconds: number): string {
  if (seconds <= 0) return '';
  if (seconds >= 10) return `${Math.ceil(seconds)}s`;
  return `${seconds.toFixed(1)}s`;
}

