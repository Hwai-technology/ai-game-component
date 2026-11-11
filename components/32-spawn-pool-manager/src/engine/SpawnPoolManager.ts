import { Disposable } from '../../../../core/shared-types/src/index.js';
import { IPoolable, SpawnPoolConfig } from '../types/index.js';

export class SpawnPoolManager<T extends IPoolable> implements Disposable {
  private readonly factory: () => T;
  private readonly maxSize: number;
  private readonly pool: T[] = [];
  private readonly active = new Set<T>();
  private _isDisposed = false;

  constructor(config: SpawnPoolConfig<T>) {
    this.factory = config.factory;
    this.maxSize = config.maxSize ?? 100;
    const initial = config.initialSize ?? 10;

    for (let i = 0; i < initial; i++) {
      const obj = this.factory();
      obj.isActive = false;
      this.pool.push(obj);
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public acquire(): T | null {
    if (this._isDisposed) return null;

    let obj: T;
    if (this.pool.length > 0) {
      obj = this.pool.pop()!;
    } else if (this.active.size < this.maxSize) {
      obj = this.factory();
    } else {
      return null; // Cap reached
    }

    obj.isActive = true;
    if (obj.onAcquire) obj.onAcquire();

    this.active.add(obj);
    return obj;
  }

  public release(obj: T): void {
    if (this._isDisposed || !this.active.has(obj)) return;

    obj.isActive = false;
    if (obj.onRelease) obj.onRelease();

    this.active.delete(obj);
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
    }
  }

  public releaseAll(): void {
    for (const obj of Array.from(this.active)) {
      this.release(obj);
    }
  }

  public getActiveCount(): number {
    return this.active.size;
  }

  public getPoolCount(): number {
    return this.pool.length;
  }

  public getActiveObjects(): readonly T[] {
    return Array.from(this.active);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.releaseAll();
    this.pool.length = 0;
  }
}

