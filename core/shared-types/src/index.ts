/**
 * 2D coordinate vector.
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * 2D dimension representation.
 */
export interface Dimensions2D {
  width: number;
  height: number;
}

/**
 * 2D Axis-Aligned Bounding Box.
 */
export interface Rectangle extends Vector2D, Dimensions2D {}

/**
 * 2D circular boundary.
 */
export interface Circle extends Vector2D {
  radius: number;
}

/**
 * Universal interface for game systems with cleanup lifecycle.
 */
export interface Disposable {
  dispose(): void;
  isDisposed?(): boolean;
}

/**
 * Universal interface for serializable states.
 */
export interface Serializable<T = unknown> {
  serialize(): T;
  deserialize(data: T): void;
}

/**
 * Universal game outcome summary.
 */
export interface GameOutcome {
  completed: boolean;
  score: number;
  durationMs: number;
  metadata?: Record<string, unknown>;
}

/**
 * Deep partial utility type.
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
