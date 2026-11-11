export interface GridPosition {
  row: number;
  col: number;
}

export interface MatchGroup {
  positions: GridPosition[];
  tileType: number;
  length: number;
}

export interface MatchThreeSwap {
  from: GridPosition;
  to: GridPosition;
}

export interface MatchResolutionStep {
  matches: MatchGroup[];
  comboMultiplier: number;
  scoreGained: number;
}

export interface MatchThreeConfig {
  rows?: number; // default 8
  columns?: number; // default 8
  tileTypesCount?: number; // default 5 (0 to 4)
  maxMoves?: number;
  initialGrid?: number[][];
}

export interface MatchThreeState {
  rows: number;
  columns: number;
  grid: number[][];
  score: number;
  movesRemaining: number;
  isGameOver: boolean;
}

