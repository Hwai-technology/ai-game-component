export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  maxProgress?: number; // default 1 (for single-step achievements)
  rewardCoins?: number;
}

export interface AchievementItem {
  definition: AchievementDefinition;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAtTimestamp?: number;
}

export interface AchievementUnlockEvent {
  achievement: AchievementItem;
  timestamp: number;
}

