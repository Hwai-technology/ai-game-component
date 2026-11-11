export interface IdleGenerator {
  id: string;
  name: string;
  count: number;
  baseCost: number;
  costMultiplier: number; // e.g. 1.15
  baseProductionPerSecond: number;
  multiplier: number;
}

export interface IdleEngineConfig {
  initialCurrency?: number;
  clickPower?: number;
  maxOfflineSeconds?: number; // e.g. 24 hours (86400s)
  offlineEfficiency?: number; // e.g. 0.8 (80% production when offline)
}

export interface IdleState {
  currency: number;
  clickPower: number;
  passivePerSecond: number;
  generators: IdleGenerator[];
  lastSavedTimestamp: number;
}
