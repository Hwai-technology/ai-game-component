export interface HealthConfig {
  maxHealth: number;
  initialHealth?: number;
  invulnerabilityDurationSeconds?: number; // i-frames window (default 0.5s)
}

export interface DamageEvent {
  rawDamage: number;
  mitigatedDamage: number;
  absorbedByShield: number;
  actualHealthLost: number;
  currentHealth: number;
  isDead: boolean;
}

export interface HealthState {
  currentHealth: number;
  maxHealth: number;
  shield: number;
  isInvulnerable: boolean;
  isDead: boolean;
}

