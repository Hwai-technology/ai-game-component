export interface ScoreEvent {
  pointsAdded: number;
  reason: string;
  multiplier: number;
  totalScore: number;
  currentCombo: number;
}

export interface ScoringConfig {
  initialScore?: number;
  comboTimeoutSeconds?: number; // default 3.0s
  maxMultiplier?: number; // default 10x
}

export interface ScoringState {
  currentScore: number;
  highScore: number;
  currentCombo: number;
  multiplier: number;
  comboTimerRemaining: number;
}
