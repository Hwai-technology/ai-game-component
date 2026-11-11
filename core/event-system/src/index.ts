export type EventCallback<T = unknown> = (payload: T) => void;

export interface IGameEventBus<Events extends Record<string, unknown> = Record<string, unknown>> {
  on<K extends keyof Events>(event: K, listener: EventCallback<Events[K]>): () => void;
  once<K extends keyof Events>(event: K, listener: EventCallback<Events[K]>): () => void;
  emit<K extends keyof Events>(event: K, payload: Events[K]): void;
  off<K extends keyof Events>(event: K, listener: EventCallback<Events[K]>): void;
  clear(event?: keyof Events): void;
  listenerCount(event: keyof Events): number;
}

export class GameEventBus<Events extends Record<string, unknown> = Record<string, unknown>>
  implements IGameEventBus<Events>
{
  private readonly listeners = new Map<keyof Events, Set<EventCallback<any>>>();
  private debugMode = false;

  constructor(options?: { debug?: boolean }) {
    this.debugMode = options?.debug ?? false;
  }

  public setDebug(debug: boolean): void {
    this.debugMode = debug;
  }

  public on<K extends keyof Events>(event: K, listener: EventCallback<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => this.off(event, listener);
  }

  public once<K extends keyof Events>(event: K, listener: EventCallback<Events[K]>): () => void {
    const wrapped: EventCallback<Events[K]> = (payload: Events[K]) => {
      this.off(event, wrapped);
      listener(payload);
    };
    return this.on(event, wrapped);
  }

  public emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    if (this.debugMode) {
      // Diagnostic telemetry when enabled
      // eslint-disable-next-line no-console
      console.debug(`[GameEventBus] emit '${String(event)}':`, payload);
    }

    const set = this.listeners.get(event);
    if (!set || set.size === 0) return;

    // Clone set to prevent mutation issues if a listener unsubscribes during emit
    const snapshot = Array.from(set);
    for (const listener of snapshot) {
      try {
        listener(payload);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[GameEventBus] Error in listener for event '${String(event)}':`, err);
      }
    }
  }

  public off<K extends keyof Events>(event: K, listener: EventCallback<Events[K]>): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(listener);
    if (set.size === 0) {
      this.listeners.delete(event);
    }
  }

  public clear(event?: keyof Events): void {
    if (event !== undefined) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  public listenerCount(event: keyof Events): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}

