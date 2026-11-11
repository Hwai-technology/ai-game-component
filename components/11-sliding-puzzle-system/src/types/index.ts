export interface SlidingPuzzleConfig {
  size?: number; // default 3 for 3x3 (8-puzzle) or 4 for 4x4 (15-puzzle)
  seed?: number;
  initialTiles?: number[];
}

export interface SlidingMove {
  tileNumber: number;
}

export interface SlidingPuzzleState {
  size: number;
  tiles: number[]; // 1D array of length size*size, 0 is blank
  moves: number;
  isSolved: boolean;
  emptyIndex: number;
}
