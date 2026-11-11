import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  CombatAction,
  Combatant,
  CombatState,
  CombatTeam,
  CombatTurnResult,
} from '../types/index.js';

export class TurnBasedCombatEngine implements Disposable {
  private readonly combatants = new Map<string, Combatant>();
  private turnOrder: string[] = [];
  private activeTurnIndex = 0;
  private isBattleOver = false;
  private winner?: CombatTeam;
  private _isDisposed = false;

  constructor(initialCombatants: Combatant[]) {
    for (const c of initialCombatants) {
      this.combatants.set(c.id, { ...c, isDefending: false });
    }
    this.recalculateTurnOrder();
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getActiveCombatant(): Combatant | null {
    if (this._isDisposed || this.isBattleOver || this.turnOrder.length === 0) return null;
    const activeId = this.turnOrder[this.activeTurnIndex];
    if (!activeId) return null;
    return this.combatants.get(activeId) ?? null;
  }

  public executeAction(action: CombatAction): CombatTurnResult {
    if (this._isDisposed || this.isBattleOver) {
      throw new ValidationError('Battle is already over or disposed');
    }

    const actor = this.getActiveCombatant();
    if (!actor || actor.id !== action.actorId) {
      throw new ValidationError(`It is not actor '${action.actorId}' turn`);
    }

    let damageInflicted = 0;
    let target: Combatant | undefined;
    let targetDefeated = false;

    // Reset defending status on turn start
    actor.isDefending = false;

    switch (action.type) {
      case 'defend':
        actor.isDefending = true;
        break;

      case 'attack':
        if (!action.targetId) throw new ValidationError('Attack requires targetId');
        target = this.combatants.get(action.targetId);
        if (!target || target.hp <= 0) {
          throw new ValidationError(`Target '${action.targetId}' is invalid or defeated`);
        }

        const effectiveDef = target.isDefending ? target.defense * 2 : target.defense;
        damageInflicted = Math.max(1, actor.attack - Math.floor(effectiveDef / 2));
        target.hp = Math.max(0, target.hp - damageInflicted);

        if (target.hp <= 0) {
          targetDefeated = true;
        }
        break;

      case 'pass':
      default:
        break;
    }

    // Check battle victory / defeat conditions
    this.checkBattleStatus();

    const result: CombatTurnResult = {
      actor: { ...actor },
      action,
      damageInflicted,
      target: target ? { ...target } : undefined,
      targetDefeated,
      battleOver: this.isBattleOver,
      winner: this.winner,
    };

    if (!this.isBattleOver) {
      this.advanceTurn();
    }

    return result;
  }

  public getState(): CombatState {
    return {
      combatants: Array.from(this.combatants.values()).map((c) => ({ ...c })),
      turnOrder: [...this.turnOrder],
      activeTurnIndex: this.activeTurnIndex,
      isBattleOver: this.isBattleOver,
      winner: this.winner,
    };
  }

  public dispose(): void {
    this._isDisposed = true;
    this.combatants.clear();
    this.turnOrder.length = 0;
  }

  private recalculateTurnOrder(): void {
    // Sort alive combatants descending by speed
    const alive = Array.from(this.combatants.values()).filter((c) => c.hp > 0);
    alive.sort((a, b) => b.speed - a.speed);
    this.turnOrder = alive.map((c) => c.id);
    this.activeTurnIndex = 0;
  }

  private advanceTurn(): void {
    let attempts = 0;
    do {
      this.activeTurnIndex = (this.activeTurnIndex + 1) % this.turnOrder.length;
      const current = this.getActiveCombatant();
      if (current && current.hp > 0) break; // Found next living actor
      attempts++;
    } while (attempts < this.turnOrder.length);
  }

  private checkBattleStatus(): void {
    const playersAlive = Array.from(this.combatants.values()).some((c) => c.team === 'player' && c.hp > 0);
    const enemiesAlive = Array.from(this.combatants.values()).some((c) => c.team === 'enemy' && c.hp > 0);

    if (!enemiesAlive) {
      this.isBattleOver = true;
      this.winner = 'player';
    } else if (!playersAlive) {
      this.isBattleOver = true;
      this.winner = 'enemy';
    }
  }
}

