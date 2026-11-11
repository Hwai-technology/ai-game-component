export type ReactionState = 'idle' | 'waiting' | 'ready' | 'result' | 'false_start';

export interface ReactionConfig {
  minDelayMs?: number;
  maxDelayMs?: number;
}

export interface ReactionRoundResult {
  round: number;
  reactionTimeMs: number;
  isFalseStart: boolean;
  rating: string;
}

export interface ReactionEngineState {
  state: ReactionState;
  currentRound: number;
  lastReactionTimeMs: number;
  bestReactionTimeMs: number;
  averageReactionTimeMs: number;
  history: ReactionRoundResult[];
}

