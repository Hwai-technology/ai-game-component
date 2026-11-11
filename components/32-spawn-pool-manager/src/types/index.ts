export interface IPoolable {
  id: string;
  isActive: boolean;
  onAcquire?(): void;
  onRelease?(): void;
}

export interface SpawnPoolConfig<T extends IPoolable> {
  factory: () => T;
  initialSize?: number;
  maxSize?: number;
}
