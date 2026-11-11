import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { IStorageAdapter, SaveDataMigration, SaveEnvelope, SaveSystemConfig } from '../types/index.js';

export class MemoryStorageAdapter implements IStorageAdapter {
  private readonly storage = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.storage.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  public removeItem(key: string): void {
    this.storage.delete(key);
  }
}

export class SaveLoadSystem<T = unknown> implements Disposable {
  private readonly storageKey: string;
  private readonly currentVersion: number;
  private readonly storage: IStorageAdapter;
  private readonly migrations: Record<number, SaveDataMigration>;
  private _isDisposed = false;

  constructor(config: SaveSystemConfig) {
    this.storageKey = config.key;
    this.currentVersion = config.currentVersion;
    this.storage = config.storage ?? new MemoryStorageAdapter();
    this.migrations = config.migrations ?? {};
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public async save(data: T): Promise<SaveEnvelope<T>> {
    if (this._isDisposed) {
      throw new ValidationError('Save system is disposed');
    }

    const json = JSON.stringify(data);
    const checksum = this.calculateChecksum(json);

    const envelope: SaveEnvelope<T> = {
      version: this.currentVersion,
      timestamp: Date.now(),
      checksum,
      data,
    };

    await this.storage.setItem(this.storageKey, JSON.stringify(envelope));
    return envelope;
  }

  public async load(defaultFallback: T): Promise<T> {
    if (this._isDisposed) return defaultFallback;

    const raw = await this.storage.getItem(this.storageKey);
    if (!raw) return defaultFallback;

    let envelope: SaveEnvelope<any>;
    try {
      envelope = JSON.parse(raw);
    } catch {
      // Corrupt JSON string
      return defaultFallback;
    }

    // Verify envelope fields
    if (!envelope || typeof envelope.version !== 'number' || !envelope.checksum) {
      return defaultFallback;
    }

    // Verify checksum
    const json = JSON.stringify(envelope.data);
    if (this.calculateChecksum(json) !== envelope.checksum) {
      // Data corrupted or tampered!
      return defaultFallback;
    }

    // Execute migrations sequentially if save version < currentVersion
    let migratedData = envelope.data;
    let v = envelope.version;

    while (v < this.currentVersion) {
      const migrator = this.migrations[v];
      if (migrator) {
        migratedData = migrator(migratedData, v);
      }
      v++;
    }

    return migratedData as T;
  }

  public async clear(): Promise<void> {
    await this.storage.removeItem(this.storageKey);
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private calculateChecksum(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `chk_${Math.abs(hash).toString(16)}`;
  }
}

