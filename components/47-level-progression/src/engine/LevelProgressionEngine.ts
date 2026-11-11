import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable, Serializable } from '../../../../core/shared-types/src/index.js';
import {
  LevelCompleteResult,
  LevelData,
  LevelProgressionConfig,
  ProgressionSummary,
} from '../types/index.js';

export class LevelProgressionEngine implements Disposable, Serializable<LevelData[]> {
  public readonly totalLevels: number;
  private readonly levels = new Map<number, LevelData>();
  private _isDisposed = false;

  constructor(config: LevelProgressionConfig) {
    this.totalLevels = config.totalLevels;
    const initialUnlocked = config.initialUnlockedLevels ?? 1;

    for (let i = 1; i <= this.totalLevels; i++) {
      this.levels.set(i, {
        levelNumber: i,
        isUnlocked: i <= initialUnlocked,
        isCompleted: false,
        starsEarned: 0,
        highScore: 0,
      });
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getLevel(levelNumber: number): LevelData | undefined {
    return this.levels.get(levelNumber);
  }

  public completeLevel(levelNumber: number, score: number, stars = 1): LevelCompleteResult {
    if (this._isDisposed) {
      throw new ValidationError('Level progression engine is disposed');
    }

    const level = this.levels.get(levelNumber);
    if (!level) {
      throw new ValidationError(`Level ${levelNumber} does not exist`);
    }

    if (!level.isUnlocked) {
      throw new ValidationError(`Level ${levelNumber} is locked`);
    }

    const newHighScore = score > level.highScore;
    if (newHighScore) level.highScore = score;

    level.isCompleted = true;
    level.starsEarned = Math.max(level.starsEarned, Math.min(3, Math.max(1, stars)));

    // Unlock next level
    let nextUnlocked = false;
    const nextLevel = this.levels.get(levelNumber + 1);
    if (nextLevel && !nextLevel.isUnlocked) {
      nextLevel.isUnlocked = true;
      nextUnlocked = true;
    }

    return {
      levelNumber,
      score,
      starsEarned: level.starsEarned,
      newHighScore,
      nextLevelUnlocked: nextUnlocked,
    };
  }

  public getSummary(): ProgressionSummary {
    let stars = 0;
    let completed = 0;
    let highestUnlocked = 1;

    for (const l of this.levels.values()) {
      stars += l.starsEarned;
      if (l.isCompleted) completed++;
      if (l.isUnlocked && l.levelNumber > highestUnlocked) {
        highestUnlocked = l.levelNumber;
      }
    }

    return {
      highestLevelUnlocked: highestUnlocked,
      totalStarsEarned: stars,
      completedLevelsCount: completed,
      totalLevels: this.totalLevels,
    };
  }

  public serialize(): LevelData[] {
    return Array.from(this.levels.values()).map((l) => ({ ...l }));
  }

  public deserialize(data: LevelData[]): void {
    for (const l of data) {
      this.levels.set(l.levelNumber, { ...l });
    }
  }

  public dispose(): void {
    this._isDisposed = true;
    this.levels.clear();
  }
}
