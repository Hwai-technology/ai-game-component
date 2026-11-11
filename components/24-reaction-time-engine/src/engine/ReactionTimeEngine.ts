import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  ReactionConfig,
  ReactionEngineState,
  ReactionRoundResult,
  ReactionState,
} from '../types/index.js';

export class ReactionTimeEngine implements Disposable {
  private readonly minDelayMs: number;
  private readonly maxDelayMs: number;
  private state: ReactionState = 'idle';
  private currentRound = 0;
  private promptTimestamp = 0;
  private scheduledTimer?: any;
  private readonly history: ReactionRoundResult[] = [];
  private readonly stateListeners = new Set<(state: ReactionEngineState) => void>();
  private _isDisposed = false;

  constructor(config: ReactionConfig = {}) {
    this.minDelayMs = config.minDelayMs ?? 1500;
    this.maxDelayMs = config.maxDelayMs ?? 4000;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public startRound(): void {
    if (this._isDisposed) return;
    if (this.scheduledTimer) clearTimeout(this.scheduledTimer);

    this.state = 'waiting';
    this.currentRound++;

    const delay = this.minDelayMs + Math.random() * (this.maxDelayMs - this.minDelayMs);
    this.scheduledTimer = setTimeout(() => {
      if (!this._isDisposed && this.state === 'waiting') {
        this.triggerPrompt();
      }
    }, delay);

    this.notifyState();
  }

  public triggerPrompt(timestamp = Date.now()): void {
    this.state = 'ready';
    this.promptTimestamp = timestamp;
    this.notifyState();
  }

  public press(now = Date.now()): ReactionRoundResult {
    if (this._isDisposed) {
      return { round: this.currentRound, reactionTimeMs: 0, isFalseStart: false, rating: 'disposed' };
    }

    if (this.state === 'waiting') {
      // False start! Tapped before signal!
      if (this.scheduledTimer) clearTimeout(this.scheduledTimer);
      this.state = 'false_start';

      const res: ReactionRoundResult = {
        round: this.currentRound,
        reactionTimeMs: 0,
        isFalseStart: true,
        rating: 'False Start',
      };
      this.history.push(res);
      this.notifyState();
      return res;
    }

    if (this.state === 'ready') {
      this.state = 'result';
      const reactionTimeMs = Math.max(0, now - this.promptTimestamp);
      const rating = this.evaluateRating(reactionTimeMs);

      const res: ReactionRoundResult = {
        round: this.currentRound,
        reactionTimeMs,
        isFalseStart: false,
        rating,
      };

      this.history.push(res);
      this.notifyState();
      return res;
    }

    return { round: this.currentRound, reactionTimeMs: 0, isFalseStart: false, rating: 'Invalid' };
  }

  public getState(): ReactionEngineState {
    const validTimes = this.history.filter((h) => !h.isFalseStart).map((h) => h.reactionTimeMs);
    const best = validTimes.length > 0 ? Math.min(...validTimes) : 0;
    const avg = validTimes.length > 0 ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : 0;

    return {
      state: this.state,
      currentRound: this.currentRound,
      lastReactionTimeMs: this.history[this.history.length - 1]?.reactionTimeMs ?? 0,
      bestReactionTimeMs: best,
      averageReactionTimeMs: avg,
      history: [...this.history],
    };
  }

  public onStateChange(listener: (state: ReactionEngineState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  public reset(): void {
    if (this.scheduledTimer) clearTimeout(this.scheduledTimer);
    this.state = 'idle';
    this.currentRound = 0;
    this.history.length = 0;
    this.notifyState();
  }

  public dispose(): void {
    this._isDisposed = true;
    if (this.scheduledTimer) clearTimeout(this.scheduledTimer);
    this.stateListeners.clear();
  }

  private evaluateRating(ms: number): string {
    if (ms < 180) return 'Godlike';
    if (ms < 250) return 'Lightning Fast';
    if (ms < 350) return 'Good';
    if (ms < 500) return 'Average';
    return 'Slow';
  }

  private notifyState(): void {
    const s = this.getState();
    for (const l of this.stateListeners) l(s);
  }
}
