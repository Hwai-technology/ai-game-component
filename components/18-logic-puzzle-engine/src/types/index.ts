export interface NumberConstraint {
  id: string;
  targetSum: number;
  cellIndices: number[]; // 1D indices belonging to this group
}

export interface LogicPuzzleConfig {
  size: number; // e.g. 3 for 3x3 grid = 9 cells
  constraints: NumberConstraint[];
  initialValues?: (number | null)[];
}

export interface LogicPuzzleState {
  size: number;
  cells: (number | null)[];
  satisfiedConstraints: string[];
  totalConstraints: number;
  isSolved: boolean;
}
