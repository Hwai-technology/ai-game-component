export type SkillTargetType = 'self' | 'single_target' | 'aoe';

export interface SkillDefinition {
  id: string;
  name: string;
  manaCost: number;
  cooldownSeconds: number;
  targetType: SkillTargetType;
  basePower: number;
  rank?: number;
}

export interface SkillInstance {
  definition: SkillDefinition;
  cooldownRemainingSeconds: number;
  isReady: boolean;
}

export interface CastResult {
  success: boolean;
  skillId: string;
  manaConsumed: number;
  reason?: 'INSUFFICIENT_MANA' | 'ON_COOLDOWN' | 'UNKNOWN_SKILL';
}
