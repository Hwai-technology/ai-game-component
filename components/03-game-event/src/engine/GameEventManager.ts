import { GameEventBus } from '../../../../core/event-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { EventEnvelope, EventMiddleware, GameEventConfig } from '../types/index.js';

export class GameEventManager<Events extends Record<string, unknown> = Record<string, unknown>>
  implements Disposable
{
  private readonly bus = new GameEventBus<Events>();
  private readonly history: EventEnvelope[] = [];
  private readonly middlewares: EventMiddleware[] = [];
  private readonly maxHistory: number;
  private readonly enableTelemetry: boolean;
  private _isDisposed = false;
  private eventCounter = 0;

  constructor(config: GameEventConfig = {}) {
    this.maxHistory = config.maxHistory ?? 100;
    this.enableTelemetry = config.enableTelemetry ?? false;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public use(middleware: EventMiddleware): () => void {
    this.middlewares.push(middleware);
    return () => {
      const idx = this.middlewares.indexOf(middleware);
      if (idx !== -1) this.middlewares.splice(idx, 1);
    };
  }

  public on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): () => void {
    if (this._isDisposed) return () => {};
    return this.bus.on(event, listener);
  }

  public emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    if (this._isDisposed) return;

    this.eventCounter++;
    const envelope: EventEnvelope<Events[K]> = {
      id: `evt_${Date.now()}_${this.eventCounter}`,
      name: String(event),
      timestamp: Date.now(),
      payload,
    };

    // Run middlewares
    for (const mw of this.middlewares) {
      const pass = mw(envelope as EventEnvelope);
      if (pass === false) return; // Dropped by middleware
    }

    if (this.enableTelemetry) {
      this.history.push(envelope as EventEnvelope);
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
    }

    this.bus.emit(event, payload);
  }

  public getHistory(): readonly EventEnvelope[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history.length = 0;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.bus.clear();
    this.history.length = 0;
    this.middlewares.length = 0;
  }
}

