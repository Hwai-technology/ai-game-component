import { Disposable } from '../../../../core/shared-types/src/index.js';
import { AnalyticsConfig, AnalyticsEvent, IAnalyticsProvider } from '../types/index.js';

export class MemoryAnalyticsProvider implements IAnalyticsProvider {
  public readonly recordedEvents: AnalyticsEvent[] = [];

  public trackEvent(event: AnalyticsEvent): void {
    this.recordedEvents.push(event);
  }
}

export class GameAnalyticsEngine implements Disposable {
  private readonly provider: IAnalyticsProvider;
  private readonly batchSize: number;
  private readonly buffer: AnalyticsEvent[] = [];
  private _isDisposed = false;

  constructor(config: AnalyticsConfig = {}) {
    this.batchSize = config.batchSize ?? 20;
    this.provider = config.provider ?? new MemoryAnalyticsProvider();
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public track(eventName: string, properties?: Record<string, string | number | boolean>): void {
    if (this._isDisposed) return;

    const event: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      properties: properties ? { ...properties } : undefined,
    };

    this.buffer.push(event);

    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  public flush(): void {
    if (this._isDisposed || this.buffer.length === 0) return;

    const batch = this.buffer.splice(0, this.buffer.length);

    if (this.provider.flush) {
      this.provider.flush(batch);
    } else {
      for (const evt of batch) {
        this.provider.trackEvent(evt);
      }
    }
  }

  public getBufferedCount(): number {
    return this.buffer.length;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.flush();
    this.buffer.length = 0;
  }
}
