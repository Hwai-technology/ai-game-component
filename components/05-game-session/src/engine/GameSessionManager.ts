import { Disposable, Serializable } from '../../../../core/shared-types/src/index.js';
import { GameSessionData, SessionConfig } from '../types/index.js';

export class GameSessionManager implements Disposable, Serializable<GameSessionData> {
  private data: GameSessionData;
  private lastPauseTimestamp: number | null = null;
  private _isDisposed = false;

  constructor(config: SessionConfig = {}) {
    this.data = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: config.userId,
      status: 'idle',
      startTime: 0,
      durationMs: 0,
      pauseTimeAccumulatorMs: 0,
      metrics: {},
      tags: config.tags ?? [],
    };

    if (config.autoStart) {
      this.start();
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public start(): void {
    if (this._isDisposed || this.data.status === 'active') return;
    this.data.status = 'active';
    this.data.startTime = Date.now();
  }

  public pause(): void {
    if (this._isDisposed || this.data.status !== 'active') return;
    this.data.status = 'paused';
    this.lastPauseTimestamp = Date.now();
  }

  public resume(): void {
    if (this._isDisposed || this.data.status !== 'paused') return;
    if (this.lastPauseTimestamp) {
      this.data.pauseTimeAccumulatorMs += Date.now() - this.lastPauseTimestamp;
      this.lastPauseTimestamp = null;
    }
    this.data.status = 'active';
  }

  public end(): GameSessionData {
    if (this._isDisposed || this.data.status === 'ended') return this.getData();

    if (this.data.status === 'paused' && this.lastPauseTimestamp) {
      this.data.pauseTimeAccumulatorMs += Date.now() - this.lastPauseTimestamp;
      this.lastPauseTimestamp = null;
    }

    this.data.status = 'ended';
    this.data.endTime = Date.now();
    this.data.durationMs = Math.max(0, this.data.endTime - this.data.startTime - this.data.pauseTimeAccumulatorMs);

    return this.getData();
  }

  public setMetric(key: string, value: number | string | boolean): void {
    if (this._isDisposed) return;
    this.data.metrics[key] = value;
  }

  public incrementMetric(key: string, delta = 1): number {
    if (this._isDisposed) return 0;
    const current = typeof this.data.metrics[key] === 'number' ? (this.data.metrics[key] as number) : 0;
    const updated = current + delta;
    this.data.metrics[key] = updated;
    return updated;
  }

  public getDurationMs(): number {
    if (this.data.startTime === 0) return 0;
    if (this.data.status === 'ended') return this.data.durationMs;

    const currentTotal = Date.now() - this.data.startTime;
    let ongoingPause = 0;
    if (this.data.status === 'paused' && this.lastPauseTimestamp) {
      ongoingPause = Date.now() - this.lastPauseTimestamp;
    }
    return Math.max(0, currentTotal - this.data.pauseTimeAccumulatorMs - ongoingPause);
  }

  public getData(): GameSessionData {
    return {
      ...this.data,
      durationMs: this.getDurationMs(),
      metrics: { ...this.data.metrics },
      tags: [...this.data.tags],
    };
  }

  public serialize(): GameSessionData {
    return this.getData();
  }

  public deserialize(data: GameSessionData): void {
    this.data = {
      ...data,
      metrics: { ...data.metrics },
      tags: [...data.tags],
    };
  }

  public dispose(): void {
    this._isDisposed = true;
    if (this.data.status === 'active' || this.data.status === 'paused') {
      this.end();
    }
  }
}
