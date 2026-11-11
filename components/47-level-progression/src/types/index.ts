export interface LevelData {
  levelNumber: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  starsEarned: number; // 0 to 3
  highScore: number;
  starThresholds?: [number, number, number]; // Score needed for 1, 2, 3 stars
}

export interface LevelProgressionConfig {
  totalLevels: number;
  initialUnlockedLevels?: number; // default 1
}

export interface LevelCompleteResult {
  levelNumber: number;
  score: number;
  starsEarned: number;
  newHighScore: boolean;
  nextLevelUnlocked: boolean;
}

export interface ProgressionSummary {
  highestLevelUnlocked: number;
  totalStarsEarned: number;
  completedLevelsCount: number;
  totalLevels: number;
}
