export interface PuzzleMove<T = unknown> {
  from?: number | { row: number; col: number };
  to?: number | { row: number; col: number };
  data?: T;
}

export interface PuzzleResult {
  completed: boolean;
  success: boolean;
  moves: number;
  durationMs: number;
  score: number;
}

export interface IPuzzleRule<TState = unknown, TMove = unknown> {
  isValidMove(state: TState, move: TMove): boolean;
  applyMove(state: TState, move: TMove): TState;
  checkWin(state: TState): boolean;
  checkLoss?(state: TState, movesTaken: number): boolean;
  calculateScore?(state: TState, moves: number, durationMs: number): number;
}

export interface PuzzleEngineConfig<TState, TMove> {
  initialState: TState;
  rule: IPuzzleRule<TState, TMove>;
  maxMoves?: number;
}

