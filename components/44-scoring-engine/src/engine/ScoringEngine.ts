import { Disposable } from '../../../../core/shared-types/src/index.js';
import { ScoreEvent, ScoringConfig, ScoringState } from '../types/index.js';

export class ScoringEngine implements Disposable {
  private currentScore = 0;
  private highScore = 0;
  private currentCombo = 0;
  private comboTimerRemaining = 0;
  private readonly comboTimeout: number;
  private readonly maxMultiplier: number;
  private readonly listeners = new Set<(event: ScoreEvent) => void>();
  private _isDisposed = false;

  constructor(config: ScoringConfig = {}) {
    this.currentScore = config.initialScore ?? 0;
    this.highScore = this.currentScore;
    this.comboTimeout = config.comboTimeoutSeconds ?? 3.0;
    this.maxMultiplier = config.maxMultiplier ?? 10;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getMultiplier(): number {
    return Math.min(this.maxMultiplier, 1 + Math.floor(this.currentCombo / 5) * 0.5);
  }

  public addPoints(basePoints: number, reason = 'action'): ScoreEvent {
    if (this._isDisposed || basePoints <= 0) {
      return {
        pointsAdded: 0,
        reason,
        multiplier: this.getMultiplier(),
        totalScore: this.currentScore,
        currentCombo: this.currentCombo,
      };
    }

    this.currentCombo++;
    this.comboTimerRemaining = this.comboTimeout;

    const mult = this.getMultiplier();
    const finalPoints = Math.round(basePoints * mult);

    this.currentScore += finalPoints;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }

    const event: ScoreEvent = {
      pointsAdded: finalPoints,
      reason,
      multiplier: mult,
      totalScore: this.currentScore,
      currentCombo: this.currentCombo,
    };

    for (const l of this.listeners) {
      l(event);
    }

    return event;
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed || deltaSeconds <= 0) return;

    if (this.comboTimerRemaining > 0) {
      this.comboTimerRemaining = Math.max(0, this.comboTimerRemaining - deltaSeconds);
      if (this.comboTimerRemaining === 0) {
        // Combo dropped!
        this.currentCombo = 0;
      }
    }
  }

  public onScore(listener: (event: ScoreEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): ScoringState {
    return {
      currentScore: this.currentScore,
      highScore: this.highScore,
      currentCombo: this.currentCombo,
      multiplier: this.getMultiplier(),
      comboTimerRemaining: this.comboTimerRemaining,
    };
  }

  public reset(preserveHighScore = true): void {
    this.currentScore = 0;
    this.currentCombo = 0;
    this.comboTimerRemaining = 0;
    if (!preserveHighScore) this.highScore = 0;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.listeners.clear();
  }
}
