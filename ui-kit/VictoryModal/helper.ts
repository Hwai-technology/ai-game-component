/**
 * Validates and clamps stars rating to the 0..3 range.
 */
export function clampStars(stars: number = 3): number {
  return Math.max(0, Math.min(3, Math.floor(stars)));
}

/**
 * Returns celebration text based on star count.
 */
export function getVictoryMessage(stars: number): string {
  switch (stars) {
    case 3:
      return 'PERFECT CLEAR!';
    case 2:
      return 'GREAT JOB!';
    case 1:
      return 'STAGE CLEAR!';
    default:
      return 'COMPLETED!';
  }
}

