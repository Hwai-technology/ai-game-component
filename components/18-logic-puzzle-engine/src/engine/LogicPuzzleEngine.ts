import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { LogicPuzzleConfig, LogicPuzzleState, NumberConstraint } from '../types/index.js';

export class LogicPuzzleEngine implements Disposable {
  public readonly size: number;
  private readonly cells: (number | null)[];
  private readonly constraints: NumberConstraint[];
  private isSolved = false;
  private _isDisposed = false;

  constructor(config: LogicPuzzleConfig) {
    this.size = config.size;
    const totalCells = this.size * this.size;
    this.cells = config.initialValues
      ? [...config.initialValues]
      : Array.from({ length: totalCells }, () => null);
    this.constraints = config.constraints.map((c) => ({ ...c }));
    this.isSolved = this.checkSolved();
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public setCellValue(index: number, value: number | null): boolean {
    if (this._isDisposed || this.isSolved) return false;
    if (index < 0 || index >= this.cells.length) {
      throw new ValidationError(`Index ${index} out of bounds`);
    }

    this.cells[index] = value;
    this.isSolved = this.checkSolved();
    return true;
  }

  public getState(): LogicPuzzleState {
    const satisfied = this.constraints
      .filter((c) => this.isConstraintSatisfied(c))
      .map((c) => c.id);

    return {
      size: this.size,
      cells: [...this.cells],
      satisfiedConstraints: satisfied,
      totalConstraints: this.constraints.length,
      isSolved: this.isSolved,
    };
  }

  public checkSolved(): boolean {
    // All cells must be non-null and all constraints satisfied
    if (this.cells.some((c) => c === null)) return false;
    return this.constraints.every((c) => this.isConstraintSatisfied(c));
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private isConstraintSatisfied(c: NumberConstraint): boolean {
    let sum = 0;
    for (const idx of c.cellIndices) {
      const val = this.cells[idx];
      if (val === null || val === undefined) return false;
      sum += val;
    }
    return sum === c.targetSum;
  }
}

