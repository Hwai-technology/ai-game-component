export interface SudokuCell {
  value: number; // 0 for empty, 1-9 for filled
  isGiven: boolean; // Immutable starting clue
  hasConflict?: boolean;
}

export interface SudokuConflict {
  row: number;
  col: number;
  type: 'row' | 'col' | 'block';
}

export interface SudokuState {
  grid: SudokuCell[][];
  isComplete: boolean;
  isValid: boolean;
  emptyCellsRemaining: number;
}
