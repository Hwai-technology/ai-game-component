import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { SudokuCell, SudokuState } from '../types/index.js';

export class SudokuEngine implements Disposable {
  private grid: SudokuCell[][];
  private _isDisposed = false;

  constructor(initialGrid?: number[][]) {
    this.grid = this.initGrid(initialGrid);
    this.recalculateConflicts();
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): SudokuState {
    let emptyCount = 0;
    let anyConflict = false;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.grid[r]![c]!.value === 0) emptyCount++;
        if (this.grid[r]![c]!.hasConflict) anyConflict = true;
      }
    }

    return {
      grid: this.grid.map((r) => r.map((c) => ({ ...c }))),
      emptyCellsRemaining: emptyCount,
      isValid: !anyConflict,
      isComplete: emptyCount === 0 && !anyConflict,
    };
  }

  public setCellValue(row: number, col: number, value: number): boolean {
    if (this._isDisposed) return false;
    if (row < 0 || row >= 9 || col < 0 || col >= 9) return false;

    const cell = this.grid[row]![col]!;
    if (cell.isGiven) {
      throw new ValidationError(`Cannot alter starting clue at row ${row}, col ${col}`);
    }

    if (value < 0 || value > 9) {
      throw new ValidationError(`Value must be between 0 (clear) and 9`);
    }

    cell.value = value;
    this.recalculateConflicts();
    return true;
  }

  public getHint(): { row: number; col: number; value: number } | null {
    if (this._isDisposed) return null;

    // Clone values to a raw 9x9 matrix and run backtracking solver
    const raw: number[][] = this.grid.map((r) => r.map((c) => c.value));
    if (!this.solveGrid(raw)) return null;

    // Find the first empty cell in the current puzzle and provide the solved value
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.grid[r]![c]!.value === 0) {
          return { row: r, col: c, value: raw[r]![c]! };
        }
      }
    }

    return null;
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private recalculateConflicts(): void {
    // Reset all conflicts
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        this.grid[r]![c]!.hasConflict = false;
      }
    }

    // Check rows
    for (let r = 0; r < 9; r++) {
      const seen = new Map<number, number[]>();
      for (let c = 0; c < 9; c++) {
        const val = this.grid[r]![c]!.value;
        if (val !== 0) {
          if (!seen.has(val)) seen.set(val, []);
          seen.get(val)!.push(c);
        }
      }
      for (const cols of seen.values()) {
        if (cols.length > 1) {
          for (const col of cols) this.grid[r]![col]!.hasConflict = true;
        }
      }
    }

    // Check columns
    for (let c = 0; c < 9; c++) {
      const seen = new Map<number, number[]>();
      for (let r = 0; r < 9; r++) {
        const val = this.grid[r]![c]!.value;
        if (val !== 0) {
          if (!seen.has(val)) seen.set(val, []);
          seen.get(val)!.push(r);
        }
      }
      for (const rows of seen.values()) {
        if (rows.length > 1) {
          for (const row of rows) this.grid[row]![c]!.hasConflict = true;
        }
      }
    }

    // Check 3x3 blocks
    for (let blockR = 0; blockR < 3; blockR++) {
      for (let blockC = 0; blockC < 3; blockC++) {
        const seen = new Map<number, { r: number; c: number }[]>();
        for (let r = blockR * 3; r < blockR * 3 + 3; r++) {
          for (let c = blockC * 3; c < blockC * 3 + 3; c++) {
            const val = this.grid[r]![c]!.value;
            if (val !== 0) {
              if (!seen.has(val)) seen.set(val, []);
              seen.get(val)!.push({ r, c });
            }
          }
        }
        for (const positions of seen.values()) {
          if (positions.length > 1) {
            for (const pos of positions) this.grid[pos.r]![pos.c]!.hasConflict = true;
          }
        }
      }
    }
  }

  private initGrid(initialGrid?: number[][]): SudokuCell[][] {
    const grid: SudokuCell[][] = [];
    for (let r = 0; r < 9; r++) {
      grid.push([]);
      for (let c = 0; c < 9; c++) {
        const val = initialGrid?.[r]?.[c] ?? 0;
        grid[r]!.push({
          value: val,
          isGiven: val !== 0,
          hasConflict: false,
        });
      }
    }
    return grid;
  }

  private isValidPlacement(board: number[][], r: number, c: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[r]![i] === num && i !== c) return false;
      if (board[i]![c] === num && i !== r) return false;
    }
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currR = startRow + i;
        const currC = startCol + j;
        if (board[currR]![currC] === num && (currR !== r || currC !== c)) return false;
      }
    }
    return true;
  }

  private solveGrid(board: number[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r]![c] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValidPlacement(board, r, c, num)) {
              board[r]![c] = num;
              if (this.solveGrid(board)) return true;
              board[r]![c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}
