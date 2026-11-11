import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  CharacterStatsConfig,
  CharacterStatsState,
  DerivedStatistics,
  PrimaryAttributes,
} from '../types/index.js';

export class CharacterStatsEngine implements Disposable {
  private level: number;
  private xp: number;
  private readonly primary: PrimaryAttributes;
  private readonly temporaryModifiers = new Map<string, Partial<PrimaryAttributes>>();
  private _isDisposed = false;

  constructor(config: CharacterStatsConfig = {}) {
    this.level = config.level ?? 1;
    this.xp = config.xp ?? 0;
    this.primary = {
      strength: config.initialAttributes?.strength ?? 10,
      agility: config.initialAttributes?.agility ?? 10,
      intelligence: config.initialAttributes?.intelligence ?? 10,
      vitality: config.initialAttributes?.vitality ?? 10,
    };
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getXpToNextLevel(): number {
    return Math.floor(100 * Math.pow(this.level, 1.5));
  }

  public addXp(amount: number): { levelsGained: number; currentLevel: number } {
    if (this._isDisposed || amount <= 0) return { levelsGained: 0, currentLevel: this.level };

    this.xp += amount;
    let levelsGained = 0;

    while (this.xp >= this.getXpToNextLevel()) {
      this.xp -= this.getXpToNextLevel();
      this.level++;
      levelsGained++;
      // Auto stat growth per level
      this.primary.strength += 2;
      this.primary.agility += 2;
      this.primary.intelligence += 2;
      this.primary.vitality += 2;
    }

    return { levelsGained, currentLevel: this.level };
  }

  public getEffectivePrimary(): PrimaryAttributes {
    const effective: PrimaryAttributes = { ...this.primary };

    for (const mod of this.temporaryModifiers.values()) {
      if (mod.strength) effective.strength += mod.strength;
      if (mod.agility) effective.agility += mod.agility;
      if (mod.intelligence) effective.intelligence += mod.intelligence;
      if (mod.vitality) effective.vitality += mod.vitality;
    }

    return effective;
  }

  public getDerived(): DerivedStatistics {
    const p = this.getEffectivePrimary();

    return {
      maxHealth: p.vitality * 10 + this.level * 20,
      maxMana: p.intelligence * 10 + this.level * 10,
      attackPower: p.strength * 2 + p.agility,
      defense: Math.floor(p.vitality * 1.5 + p.agility * 0.5),
      critChance: Math.min(0.75, 0.05 + p.agility * 0.005),
    };
  }

  public setModifier(id: string, modifier: Partial<PrimaryAttributes>): void {
    this.temporaryModifiers.set(id, { ...modifier });
  }

  public removeModifier(id: string): void {
    this.temporaryModifiers.delete(id);
  }

  public getState(): CharacterStatsState {
    return {
      level: this.level,
      xp: this.xp,
      xpToNextLevel: this.getXpToNextLevel(),
      primary: this.getEffectivePrimary(),
      derived: this.getDerived(),
    };
  }

  public dispose(): void {
    this._isDisposed = true;
    this.temporaryModifiers.clear();
  }
}

