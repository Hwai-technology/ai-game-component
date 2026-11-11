import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  ActivePowerUp,
  PowerUpDefinition,
  PowerUpEventListener,
  PowerUpLifecycleEvent,
} from '../types/index.js';

export class PowerUpSystem implements Disposable {
  private readonly definitions = new Map<string, PowerUpDefinition>();
  private readonly activeBuffs = new Map<string, ActivePowerUp>();
  private readonly cooldowns = new Map<string, number>();
  private readonly listeners = new Set<PowerUpEventListener>();
  private _isDisposed = false;

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public register(def: PowerUpDefinition): void {
    this.definitions.set(def.id, {
      ...def,
      stackingPolicy: def.stackingPolicy ?? 'extend',
    });
  }

  public isActive(id: string): boolean {
    return this.activeBuffs.has(id);
  }

  public getActiveBuff(id: string): ActivePowerUp | undefined {
    return this.activeBuffs.get(id);
  }

  public getAllActive(): ActivePowerUp[] {
    return Array.from(this.activeBuffs.values());
  }

  public activate(id: string): boolean {
    if (this._isDisposed) return false;

    const def = this.definitions.get(id);
    if (!def) {
      throw new ValidationError(`Unknown power-up definition '${id}'`);
    }

    // Check cooldown
    if (this.cooldowns.has(id)) {
      return false; // On cooldown
    }

    const existing = this.activeBuffs.get(id);
    if (existing) {
      switch (def.stackingPolicy) {
        case 'reject':
          return false;
        case 'refresh':
          existing.remainingSeconds = def.durationSeconds;
          existing.totalDurationSeconds = def.durationSeconds;
          this.emit({ type: 'refreshed', powerUp: { ...existing } });
          return true;
        case 'extend':
        default:
          existing.remainingSeconds += def.durationSeconds;
          existing.totalDurationSeconds += def.durationSeconds;
          existing.stacks++;
          this.emit({ type: 'refreshed', powerUp: { ...existing } });
          return true;
      }
    }

    const buff: ActivePowerUp = {
      definition: { ...def },
      remainingSeconds: def.durationSeconds,
      totalDurationSeconds: def.durationSeconds,
      stacks: 1,
    };

    this.activeBuffs.set(id, buff);
    this.emit({ type: 'activated', powerUp: { ...buff } });
    return true;
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed) return;

    // Advance active buffs
    for (const [id, buff] of Array.from(this.activeBuffs.entries())) {
      buff.remainingSeconds -= deltaSeconds;
      if (buff.remainingSeconds <= 0) {
        this.activeBuffs.delete(id);
        this.emit({ type: 'expired', id });

        // Apply cooldown if defined
        if (buff.definition.cooldownSeconds && buff.definition.cooldownSeconds > 0) {
          this.cooldowns.set(id, buff.definition.cooldownSeconds);
        }
      }
    }

    // Advance cooldowns
    for (const [id, cd] of Array.from(this.cooldowns.entries())) {
      const nextCd = cd - deltaSeconds;
      if (nextCd <= 0) {
        this.cooldowns.delete(id);
      } else {
        this.cooldowns.set(id, nextCd);
      }
    }
  }

  public onLifecycle(listener: PowerUpEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public clear(): void {
    this.activeBuffs.clear();
    this.cooldowns.clear();
  }

  public dispose(): void {
    this._isDisposed = true;
    this.activeBuffs.clear();
    this.cooldowns.clear();
    this.listeners.clear();
  }

  private emit(event: PowerUpLifecycleEvent): void {
    for (const l of this.listeners) {
      l(event);
    }
  }
}

