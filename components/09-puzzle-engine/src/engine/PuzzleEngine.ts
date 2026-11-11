import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { IPuzzleRule, PuzzleEngineConfig, PuzzleResult } from '../types/index.js';

export class PuzzleEngine<TState, TMove> implements Disposable {
  private currentState: TState;
  private readonly initialState: TState;
  private readonly rule: IPuzzleRule<TState, TMove>;
  private readonly maxMoves?: number;

  private movesCount = 0;
  private startTime = 0;
  private endTime = 0;
  private isCompleted = false;
  private isWon = false;
  private _isDisposed = false;

  constructor(config: PuzzleEngineConfig<TState, TMove>) {
    this.initialState = this.clone(config.initialState);
    this.currentState = this.clone(config.initialState);
    this.rule = config.rule;
    this.maxMoves = config.maxMoves;
    this.startTime = Date.now();
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): Readonly<TState> {
    return this.currentState;
  }

  public getMovesCount(): number {
    return this.movesCount;
  }

  public canMove(move: TMove): boolean {
    if (this._isDisposed || this.isCompleted) return false;
    return this.rule.isValidMove(this.currentState, move);
  }

  public makeMove(move: TMove): boolean {
    if (this._isDisposed || this.isCompleted) return false;

    if (!this.canMove(move)) {
      throw new ValidationError('Invalid puzzle move');
    }

    this.currentState = this.rule.applyMove(this.currentState, move);
    this.movesCount++;

    // Check win condition
    if (this.rule.checkWin(this.currentState)) {
      this.finish(true);
      return true;
    }

    // Check loss condition
    if (
      (this.maxMoves !== undefined && this.movesCount >= this.maxMoves) ||
      (this.rule.checkLoss && this.rule.checkLoss(this.currentState, this.movesCount))
    ) {
      this.finish(false);
      return true;
    }

    return true;
  }

  public reset(): void {
    this.currentState = this.clone(this.initialState);
    this.movesCount = 0;
    this.startTime = Date.now();
    this.endTime = 0;
    this.isCompleted = false;
    this.isWon = false;
  }

  public getResult(): PuzzleResult {
    const duration = this.endTime > 0 ? this.endTime - this.startTime : Date.now() - this.startTime;
    const score = this.rule.calculateScore
      ? this.rule.calculateScore(this.currentState, this.movesCount, duration)
      : this.isWon
      ? Math.max(10, 1000 - this.movesCount * 10)
      : 0;

    return {
      completed: this.isCompleted,
      success: this.isWon,
      moves: this.movesCount,
      durationMs: duration,
      score,
    };
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private finish(won: boolean): void {
    this.isCompleted = true;
    this.isWon = won;
    this.endTime = Date.now();
  }

  private clone<U>(val: U): U {
    return JSON.parse(JSON.stringify(val));
  }
}
