export interface PrimaryAttributes {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
}

export interface DerivedStatistics {
  maxHealth: number;
  maxMana: number;
  attackPower: number;
  defense: number;
  critChance: number;
}

export interface CharacterStatsConfig {
  initialAttributes?: Partial<PrimaryAttributes>;
  level?: number;
  xp?: number;
}

export interface CharacterStatsState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  primary: PrimaryAttributes;
  derived: DerivedStatistics;
}
