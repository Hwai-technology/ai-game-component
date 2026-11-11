import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  GridPosition,
  MatchGroup,
  MatchResolutionStep,
  MatchThreeConfig,
  MatchThreeState,
  MatchThreeSwap,
} from '../types/index.js';

export class MatchThreeEngine implements Disposable {
  public readonly rows: number;
  public readonly columns: number;
  public readonly tileTypesCount: number;

  private grid: number[][];
  private score = 0;
  private movesRemaining: number;
  private isGameOver = false;
  private _isDisposed = false;

  constructor(config: MatchThreeConfig = {}) {
    this.rows = Math.max(3, config.rows ?? 8);
    this.columns = Math.max(3, config.columns ?? 8);
    this.tileTypesCount = Math.max(2, config.tileTypesCount ?? 5);
    this.movesRemaining = config.maxMoves ?? 30;

    if (config.initialGrid && config.initialGrid.length === this.rows) {
      this.grid = config.initialGrid.map((row) => [...row]);
    } else {
      this.grid = this.generateInitialGrid();
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): MatchThreeState {
    return {
      rows: this.rows,
      columns: this.columns,
      grid: this.grid.map((r) => [...r]),
      score: this.score,
      movesRemaining: this.movesRemaining,
      isGameOver: this.isGameOver,
    };
  }

  public isValidPosition(pos: GridPosition): boolean {
    return pos.row >= 0 && pos.row < this.rows && pos.col >= 0 && pos.col < this.columns;
  }

  public isAdjacent(pos1: GridPosition, pos2: GridPosition): boolean {
    const dRow = Math.abs(pos1.row - pos2.row);
    const dCol = Math.abs(pos1.col - pos2.col);
    return (dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1);
  }

  public canSwap(swap: MatchThreeSwap): boolean {
    if (this._isDisposed || this.isGameOver) return false;
    if (!this.isValidPosition(swap.from) || !this.isValidPosition(swap.to)) return false;
    if (!this.isAdjacent(swap.from, swap.to)) return false;

    // Tentatively swap and check if it yields matches
    this.performDirectSwap(swap.from, swap.to);
    const matches = this.findMatches();
    this.performDirectSwap(swap.from, swap.to); // revert

    return matches.length > 0;
  }

  public swap(swap: MatchThreeSwap): MatchResolutionStep[] {
    if (this._isDisposed || this.isGameOver) return [];

    if (!this.canSwap(swap)) {
      throw new ValidationError('Invalid swap: must be adjacent and create at least one match of 3');
    }

    this.performDirectSwap(swap.from, swap.to);
    this.movesRemaining--;

    // Resolve cascades
    const resolutionSteps = this.resolveCascades();

    if (this.movesRemaining <= 0) {
      this.isGameOver = true;
    }

    return resolutionSteps;
  }

  public findMatches(): MatchGroup[] {
    const matched = new Set<string>();
    const groups: MatchGroup[] = [];

    // Horizontal check
    for (let r = 0; r < this.rows; r++) {
      let matchLen = 1;
      for (let c = 0; c < this.columns; c++) {
        const currentTile = this.grid[r]![c]!;
        const nextTile = c + 1 < this.columns ? this.grid[r]![c + 1]! : -1;

        if (currentTile !== -1 && currentTile === nextTile) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            const positions: GridPosition[] = [];
            for (let i = 0; i < matchLen; i++) {
              positions.push({ row: r, col: c - i });
              matched.add(`${r},${c - i}`);
            }
            groups.push({ positions, tileType: currentTile, length: matchLen });
          }
          matchLen = 1;
        }
      }
    }

    // Vertical check
    for (let c = 0; c < this.columns; c++) {
      let matchLen = 1;
      for (let r = 0; r < this.rows; r++) {
        const currentTile = this.grid[r]![c]!;
        const nextTile = r + 1 < this.rows ? this.grid[r + 1]![c]! : -1;

        if (currentTile !== -1 && currentTile === nextTile) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            const positions: GridPosition[] = [];
            for (let i = 0; i < matchLen; i++) {
              positions.push({ row: r - i, col: c });
              matched.add(`${r - i},${c}`);
            }
            groups.push({ positions, tileType: currentTile, length: matchLen });
          }
          matchLen = 1;
        }
      }
    }

    return groups;
  }

  public resolveCascades(): MatchResolutionStep[] {
    const steps: MatchResolutionStep[] = [];
    let comboMultiplier = 1;

    while (true) {
      const matches = this.findMatches();
      if (matches.length === 0) break;

      // Clear matched positions
      let totalTilesInStep = 0;
      for (const m of matches) {
        for (const pos of m.positions) {
          if (this.grid[pos.row]![pos.col] !== -1) {
            this.grid[pos.row]![pos.col] = -1;
            totalTilesInStep++;
          }
        }
      }

      const scoreGained = totalTilesInStep * 10 * comboMultiplier;
      this.score += scoreGained;

      steps.push({
        matches,
        comboMultiplier,
        scoreGained,
      });

      // Gravity: tiles fall down
      this.applyGravity();

      // Refill top
      this.refillEmptyTiles();

      comboMultiplier++;
    }

    return steps;
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private performDirectSwap(from: GridPosition, to: GridPosition): void {
    const temp = this.grid[from.row]![from.col]!;
    this.grid[from.row]![from.col] = this.grid[to.row]![to.col]!;
    this.grid[to.row]![to.col] = temp;
  }

  private applyGravity(): void {
    for (let c = 0; c < this.columns; c++) {
      let emptyRow = this.rows - 1;
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.grid[r]![c] !== -1) {
          if (r !== emptyRow) {
            this.grid[emptyRow]![c] = this.grid[r]![c]!;
            this.grid[r]![c] = -1;
          }
          emptyRow--;
        }
      }
    }
  }

  private refillEmptyTiles(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.grid[r]![c] === -1) {
          this.grid[r]![c] = Math.floor(Math.random() * this.tileTypesCount);
        }
      }
    }
  }

  private generateInitialGrid(): number[][] {
    const grid: number[][] = [];
    for (let r = 0; r < this.rows; r++) {
      grid.push([]);
      for (let c = 0; c < this.columns; c++) {
        let val: number;
        do {
          val = Math.floor(Math.random() * this.tileTypesCount);
        } while (
          (c >= 2 && grid[r]![c - 1] === val && grid[r]![c - 2] === val) ||
          (r >= 2 && grid[r - 1]![c] === val && grid[r - 2]![c] === val)
        );
        grid[r]!.push(val);
      }
    }
    return grid;
  }
}
