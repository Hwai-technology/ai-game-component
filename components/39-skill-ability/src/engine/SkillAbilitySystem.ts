import { Disposable } from '../../../../core/shared-types/src/index.js';
import { CastResult, SkillDefinition, SkillInstance } from '../types/index.js';

export class SkillAbilitySystem implements Disposable {
  private readonly skills = new Map<string, SkillInstance>();
  private _isDisposed = false;

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public learnSkill(def: SkillDefinition): void {
    this.skills.set(def.id, {
      definition: { ...def, rank: def.rank ?? 1 },
      cooldownRemainingSeconds: 0,
      isReady: true,
    });
  }

  public canCast(skillId: string, currentMana: number): { canCast: boolean; reason?: 'INSUFFICIENT_MANA' | 'ON_COOLDOWN' | 'UNKNOWN_SKILL' } {
    if (this._isDisposed) return { canCast: false, reason: 'UNKNOWN_SKILL' };

    const skill = this.skills.get(skillId);
    if (!skill) return { canCast: false, reason: 'UNKNOWN_SKILL' };

    if (skill.cooldownRemainingSeconds > 0) {
      return { canCast: false, reason: 'ON_COOLDOWN' };
    }

    if (currentMana < skill.definition.manaCost) {
      return { canCast: false, reason: 'INSUFFICIENT_MANA' };
    }

    return { canCast: true };
  }

  public cast(skillId: string, currentMana: number): CastResult {
    const check = this.canCast(skillId, currentMana);
    if (!check.canCast) {
      return { success: false, skillId, manaConsumed: 0, reason: check.reason };
    }

    const skill = this.skills.get(skillId)!;
    skill.cooldownRemainingSeconds = skill.definition.cooldownSeconds;
    skill.isReady = false;

    return {
      success: true,
      skillId,
      manaConsumed: skill.definition.manaCost,
    };
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed || deltaSeconds <= 0) return;

    for (const skill of this.skills.values()) {
      if (skill.cooldownRemainingSeconds > 0) {
        skill.cooldownRemainingSeconds = Math.max(0, skill.cooldownRemainingSeconds - deltaSeconds);
        skill.isReady = skill.cooldownRemainingSeconds === 0;
      }
    }
  }

  public getSkill(skillId: string): SkillInstance | undefined {
    return this.skills.get(skillId);
  }

  public getAllSkills(): SkillInstance[] {
    return Array.from(this.skills.values()).map((s) => ({
      ...s,
      definition: { ...s.definition },
    }));
  }

  public resetCooldowns(): void {
    for (const s of this.skills.values()) {
      s.cooldownRemainingSeconds = 0;
      s.isReady = true;
    }
  }

  public dispose(): void {
    this._isDisposed = true;
    this.skills.clear();
  }
}
