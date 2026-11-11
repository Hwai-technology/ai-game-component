export interface IStorageAdapter {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

export interface SaveEnvelope<T = unknown> {
  version: number;
  timestamp: number;
  checksum: string;
  data: T;
}

export type SaveDataMigration = (oldData: unknown, oldVersion: number) => unknown;

export interface SaveSystemConfig {
  key: string;
  currentVersion: number;
  storage?: IStorageAdapter;
  migrations?: Record<number, SaveDataMigration>;
}
