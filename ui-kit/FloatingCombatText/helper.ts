import { palette } from '../theme';
import { CombatTextType } from './types';

export const COMBAT_TEXT_COLORS: Record<CombatTextType, string> = {
  damage: palette.red[500],
  heal: palette.teal[500],
  critical: palette.orange[500],
  combo: palette.gold[500],
  levelup: palette.purple[500],
};

export function getCombatTextColor(type: CombatTextType = 'damage'): string {
  return COMBAT_TEXT_COLORS[type] ?? palette.red[500];
}

