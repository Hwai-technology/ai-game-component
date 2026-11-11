export type StackingPolicy = 'extend' | 'refresh' | 'reject';

export interface PowerUpDefinition {
  id: string;
  name: string;
  durationSeconds: number;
  stackingPolicy?: StackingPolicy;
  cooldownSeconds?: number;
  multiplier?: number;
}

export interface ActivePowerUp {
  definition: PowerUpDefinition;
  remainingSeconds: number;
  totalDurationSeconds: number;
  stacks: number;
}

export type PowerUpLifecycleEvent =
  | { type: 'activated'; powerUp: ActivePowerUp }
  | { type: 'refreshed'; powerUp: ActivePowerUp }
  | { type: 'expired'; id: string };

export type PowerUpEventListener = (event: PowerUpLifecycleEvent) => void;
