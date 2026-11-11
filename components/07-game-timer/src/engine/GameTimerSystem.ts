import { Disposable } from '../../../../core/shared-types/src/index.js';
import { TimerConfig, TimerExpireListener, TimerMode, TimerState, TimerTickListener } from '../types/index.js';

export class GameTimerInstance implements Disposable {
  public readonly id: string;
  public readonly mode: TimerMode;
  private durationSeconds: number;
  private timeScale: number;
  private elapsedSeconds = 0;
  private isRunning = false;
  private isPaused = false;
  private isExpired = false;
  private _isDisposed = false;

  private readonly tickListeners = new Set<TimerTickListener>();
  private readonly expireListeners = new Set<TimerExpireListener>();

  constructor(config: TimerConfig = {}) {
    this.id = config.id ?? `timer_${Math.random().toString(36).substring(2, 9)}`;
    this.mode = config.mode ?? 'countdown';
    this.durationSeconds = Math.max(0, config.durationSeconds ?? 60);
    this.timeScale = Math.max(0, config.timeScale ?? 1.0);

    if (config.autoStart) {
      this.start();
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public start(): void {
    if (this._isDisposed) return;
    this.isRunning = true;
    this.isPaused = false;
    this.isExpired = false;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public reset(newDuration?: number): void {
    if (newDuration !== undefined) {
      this.durationSeconds = Math.max(0, newDuration);
    }
    this.elapsedSeconds = 0;
    this.isExpired = false;
  }

  public setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  public addTime(seconds: number): void {
    if (this.mode === 'countdown') {
      this.durationSeconds = Math.max(0, this.durationSeconds + seconds);
      if (this.isExpired && this.remaining() > 0) {
        this.isExpired = false;
      }
    }
  }

  /**
   * Deterministic time step, typically called by the Game Loop or a tick scheduler.
   */
  public step(deltaSeconds: number): void {
    if (this._isDisposed || !this.isRunning || this.isPaused || this.isExpired) return;

    const scaledDelta = deltaSeconds * this.timeScale;
    this.elapsedSeconds += scaledDelta;

    if (this.mode === 'countdown' && this.elapsedSeconds >= this.durationSeconds) {
      this.elapsedSeconds = this.durationSeconds;
      this.isExpired = true;

      const state = this.getState();
      for (const listener of this.expireListeners) listener(state);
    }

    const state = this.getState();
    for (const listener of this.tickListeners) listener(state);
  }

  public remaining(): number {
    return this.mode === 'countdown' ? Math.max(0, this.durationSeconds - this.elapsedSeconds) : this.elapsedSeconds;
  }

  public getState(): TimerState {
    const remaining = this.remaining();
    const progress =
      this.mode === 'countdown'
        ? this.durationSeconds === 0
          ? 1
          : Math.min(1, this.elapsedSeconds / this.durationSeconds)
        : 1;

    return {
      id: this.id,
      mode: this.mode,
      elapsedSeconds: this.elapsedSeconds,
      remainingSeconds: remaining,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      isExpired: this.isExpired,
      progress,
    };
  }

  public onTick(listener: TimerTickListener): () => void {
    this.tickListeners.add(listener);
    return () => this.tickListeners.delete(listener);
  }

  public onExpire(listener: TimerExpireListener): () => void {
    this.expireListeners.add(listener);
    return () => this.expireListeners.delete(listener);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.isRunning = false;
    this.tickListeners.clear();
    this.expireListeners.clear();
  }
}

export class GameTimerSystem implements Disposable {
  private readonly timers = new Map<string, GameTimerInstance>();
  private _isDisposed = false;

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public createTimer(config: TimerConfig): GameTimerInstance {
    const timer = new GameTimerInstance(config);
    this.timers.set(timer.id, timer);
    return timer;
  }

  public getTimer(id: string): GameTimerInstance | undefined {
    return this.timers.get(id);
  }

  public removeTimer(id: string): boolean {
    const timer = this.timers.get(id);
    if (!timer) return false;
    timer.dispose();
    return this.timers.delete(id);
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed) return;
    for (const timer of this.timers.values()) {
      timer.step(deltaSeconds);
    }
  }

  public dispose(): void {
    this._isDisposed = true;
    for (const timer of this.timers.values()) {
      timer.dispose();
    }
    this.timers.clear();
  }
}
