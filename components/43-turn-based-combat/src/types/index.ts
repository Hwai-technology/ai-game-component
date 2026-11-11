export type CombatTeam = 'player' | 'enemy';

export interface Combatant {
  id: string;
  name: string;
  team: CombatTeam;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  isDefending?: boolean;
}

export type CombatActionType = 'attack' | 'defend' | 'pass';

export interface CombatAction {
  actorId: string;
  type: CombatActionType;
  targetId?: string;
}

export interface CombatTurnResult {
  actor: Combatant;
  action: CombatAction;
  damageInflicted: number;
  target?: Combatant;
  targetDefeated: boolean;
  battleOver: boolean;
  winner?: CombatTeam;
}

export interface CombatState {
  combatants: Combatant[];
  turnOrder: string[]; // Combatant IDs sorted by speed
  activeTurnIndex: number;
  isBattleOver: boolean;
  winner?: CombatTeam;
}
