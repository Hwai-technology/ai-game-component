import { Disposable, Serializable } from '../../../../core/shared-types/src/index.js';
import {
  AchievementDefinition,
  AchievementItem,
  AchievementUnlockEvent,
} from '../types/index.js';

export class AchievementSystem
  implements Disposable, Serializable<Record<string, { progress: number; unlocked: boolean; at?: number }>>
{
  private readonly achievements = new Map<string, AchievementItem>();
  private readonly unlockListeners = new Set<(event: AchievementUnlockEvent) => void>();
  private _isDisposed = false;

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public register(def: AchievementDefinition): void {
    this.achievements.set(def.id, {
      definition: { ...def, maxProgress: def.maxProgress ?? 1 },
      currentProgress: 0,
      isUnlocked: false,
    });
  }

  public addProgress(achievementId: string, amount = 1): AchievementUnlockEvent | null {
    if (this._isDisposed || amount <= 0) return null;

    const ach = this.achievements.get(achievementId);
    if (!ach || ach.isUnlocked) return null;

    ach.currentProgress = Math.min(ach.definition.maxProgress!, ach.currentProgress + amount);

    if (ach.currentProgress >= ach.definition.maxProgress!) {
      ach.isUnlocked = true;
      ach.unlockedAtTimestamp = Date.now();

      const event: AchievementUnlockEvent = {
        achievement: { ...ach, definition: { ...ach.definition } },
        timestamp: ach.unlockedAtTimestamp,
      };

      for (const listener of this.unlockListeners) {
        listener(event);
      }

      return event;
    }

    return null;
  }

  public unlock(achievementId: string): AchievementUnlockEvent | null {
    const ach = this.achievements.get(achievementId);
    if (!ach) return null;
    return this.addProgress(achievementId, ach.definition.maxProgress!);
  }

  public getAchievement(id: string): AchievementItem | undefined {
    return this.achievements.get(id);
  }

  public getAll(): AchievementItem[] {
    return Array.from(this.achievements.values()).map((a) => ({
      ...a,
      definition: { ...a.definition },
    }));
  }

  public onUnlock(listener: (event: AchievementUnlockEvent) => void): () => void {
    this.unlockListeners.add(listener);
    return () => this.unlockListeners.delete(listener);
  }

  public serialize(): Record<string, { progress: number; unlocked: boolean; at?: number }> {
    const data: Record<string, { progress: number; unlocked: boolean; at?: number }> = {};
    for (const [id, ach] of this.achievements.entries()) {
      data[id] = {
        progress: ach.currentProgress,
        unlocked: ach.isUnlocked,
        at: ach.unlockedAtTimestamp,
      };
    }
    return data;
  }

  public deserialize(data: Record<string, { progress: number; unlocked: boolean; at?: number }>): void {
    for (const [id, entry] of Object.entries(data)) {
      const ach = this.achievements.get(id);
      if (ach) {
        ach.currentProgress = entry.progress;
        ach.isUnlocked = entry.unlocked;
        ach.unlockedAtTimestamp = entry.at;
      }
    }
  }

  public dispose(): void {
    this._isDisposed = true;
    this.achievements.clear();
    this.unlockListeners.clear();
  }
}

