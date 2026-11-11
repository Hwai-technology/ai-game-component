import { palette } from '../theme';

export function getRankBadgeColor(rank: number): string | null {
  if (rank === 1) return palette.gold[500];
  if (rank === 2) return palette.lavenderGrey[400];
  if (rank === 3) return palette.orange[500];
  return null;
}

