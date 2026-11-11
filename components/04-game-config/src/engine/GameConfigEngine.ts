import { ConfigurationError } from '../../../../core/error-system/src/index.js';
import { DeepPartial, Disposable } from '../../../../core/shared-types/src/index.js';
import { ConfigChangeListener, ConfigValidator, GameConfigOptions } from '../types/index.js';

export class GameConfigEngine<T extends object> implements Disposable {
  private currentConfig: T;
  private readonly initialDefaults: T;
  private readonly validator?: ConfigValidator<T>;
  private readonly listeners = new Set<ConfigChangeListener<T>>();
  private _isDisposed = false;

  constructor(options: GameConfigOptions<T>, currentEnv?: string) {
    this.initialDefaults = this.deepClone(options.defaults);
    this.validator = options.validator;

    let merged = this.deepClone(options.defaults);

    if (currentEnv && options.environmentOverrides && options.environmentOverrides[currentEnv]) {
      merged = this.deepMerge(merged, options.environmentOverrides[currentEnv]!);
    }

    const validationErr = this.validator ? this.validator(merged) : null;
    if (validationErr) {
      throw new ConfigurationError(`Configuration validation failed: ${validationErr}`);
    }

    this.currentConfig = merged;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public get(): Readonly<T> {
    return this.currentConfig;
  }

  public getProperty<K extends keyof T>(key: K): T[K] {
    return this.currentConfig[key];
  }

  public update(partial: DeepPartial<T>): void {
    if (this._isDisposed) return;

    const previous = this.currentConfig;
    const candidate = this.deepMerge(this.deepClone(previous), partial);

    if (this.validator) {
      const err = this.validator(candidate);
      if (err) {
        throw new ConfigurationError(`Runtime configuration update rejected: ${err}`);
      }
    }

    this.currentConfig = candidate;

    for (const listener of this.listeners) {
      listener(this.currentConfig, previous);
    }
  }

  public reset(): void {
    this.update(this.initialDefaults as DeepPartial<T>);
  }

  public subscribe(listener: ConfigChangeListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.listeners.clear();
  }

  private deepClone<U>(obj: U): U {
    return JSON.parse(JSON.stringify(obj));
  }

  private deepMerge<U extends object>(target: U, source: DeepPartial<U>): U {
    const output = { ...target };
    const srcAny = source as Record<string, unknown>;
    for (const key of Object.keys(source) as (keyof U)[]) {
      const sourceVal = srcAny[key as string];
      const targetVal = target[key];

      if (
        sourceVal !== undefined &&
        sourceVal !== null &&
        typeof sourceVal === 'object' &&
        !Array.isArray(sourceVal) &&
        typeof targetVal === 'object' &&
        targetVal !== null &&
        !Array.isArray(targetVal)
      ) {
        output[key] = this.deepMerge(targetVal, sourceVal as any);
      } else if (sourceVal !== undefined) {
        output[key] = sourceVal as any;
      }
    }
    return output;
  }
}
