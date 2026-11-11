export interface EventEnvelope<T = unknown> {
  id: string;
  name: string;
  timestamp: number;
  payload: T;
}

export interface GameEventConfig {
  maxHistory?: number;
  enableTelemetry?: boolean;
}

export type EventMiddleware<T = unknown> = (envelope: EventEnvelope<T>) => boolean | void;
