import { palette } from '../theme';
import { ItemRarity } from './types';

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: palette.lavenderGrey[400],
  rare: palette.teal[500],
  epic: palette.purple[500],
  legendary: palette.gold[500],
};

/**
 * Resolves border and accent color based on item rarity.
 */
export function getRarityColor(rarity?: ItemRarity): string {
  if (!rarity) return palette.lavenderGrey[200];
  return RARITY_COLORS[rarity] ?? palette.lavenderGrey[400];
}

