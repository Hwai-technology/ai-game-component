import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { SlidingPuzzleConfig, SlidingPuzzleState } from '../types/index.js';

export class SlidingPuzzleSystem implements Disposable {
  public readonly size: number;
  private tiles: number[];
  private moves = 0;
  private isSolved = false;
  private _isDisposed = false;

  constructor(config: SlidingPuzzleConfig = {}) {
    this.size = Math.max(2, config.size ?? 3);

    if (config.initialTiles && config.initialTiles.length === this.size * this.size) {
      this.tiles = [...config.initialTiles];
    } else {
      this.tiles = this.generateSolvableBoard();
    }

    this.isSolved = this.checkWin();
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): SlidingPuzzleState {
    return {
      size: this.size,
      tiles: [...this.tiles],
      moves: this.moves,
      isSolved: this.isSolved,
      emptyIndex: this.tiles.indexOf(0),
    };
  }

  public canSlide(tileNumber: number): boolean {
    if (this._isDisposed || this.isSolved || tileNumber <= 0) return false;

    const tileIdx = this.tiles.indexOf(tileNumber);
    const emptyIdx = this.tiles.indexOf(0);
    if (tileIdx === -1 || emptyIdx === -1) return false;

    const tileRow = Math.floor(tileIdx / this.size);
    const tileCol = tileIdx % this.size;
    const emptyRow = Math.floor(emptyIdx / this.size);
    const emptyCol = emptyIdx % this.size;

    const dRow = Math.abs(tileRow - emptyRow);
    const dCol = Math.abs(tileCol - emptyCol);

    return (dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1);
  }

  public slide(tileNumber: number): boolean {
    if (this._isDisposed || this.isSolved) return false;

    if (!this.canSlide(tileNumber)) {
      throw new ValidationError(`Tile ${tileNumber} cannot slide into the empty spot`);
    }

    const tileIdx = this.tiles.indexOf(tileNumber);
    const emptyIdx = this.tiles.indexOf(0);

    // Swap tile with empty
    this.tiles[emptyIdx] = tileNumber;
    this.tiles[tileIdx] = 0;
    this.moves++;

    this.isSolved = this.checkWin();
    return true;
  }

  public reset(): void {
    this.tiles = this.generateSolvableBoard();
    this.moves = 0;
    this.isSolved = false;
  }

  public checkWin(): boolean {
    const total = this.size * this.size;
    for (let i = 0; i < total - 1; i++) {
      if (this.tiles[i] !== i + 1) return false;
    }
    return this.tiles[total - 1] === 0;
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  /**
   * Generates a randomized, guaranteed-solvable sliding puzzle board.
   * Mathematical solvability rule:
   * - If width is odd: inversions must be even.
   * - If width is even: inversions + row_from_bottom of blank must be odd (or even depending on convention).
   */
  public generateSolvableBoard(): number[] {
    const total = this.size * this.size;
    let candidate: number[];

    do {
      candidate = Array.from({ length: total }, (_, i) => (i + 1) % total);
      // Fisher-Yates shuffle
      for (let i = candidate.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = candidate[i]!;
        candidate[i] = candidate[j]!;
        candidate[j] = temp;
      }
    } while (!this.isBoardSolvable(candidate) || this.isAlreadySolved(candidate));

    return candidate;
  }

  private isAlreadySolved(board: number[]): boolean {
    const total = this.size * this.size;
    for (let i = 0; i < total - 1; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[total - 1] === 0;
  }

  private isBoardSolvable(board: number[]): boolean {
    let inversions = 0;
    const len = board.length;

    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        if (board[i]! > 0 && board[j]! > 0 && board[i]! > board[j]!) {
          inversions++;
        }
      }
    }

    if (this.size % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      const blankIdx = board.indexOf(0);
      const blankRowFromBottom = this.size - Math.floor(blankIdx / this.size);
      if (blankRowFromBottom % 2 === 0) {
        return inversions % 2 === 1;
      } else {
        return inversions % 2 === 0;
      }
    }
  }
}
