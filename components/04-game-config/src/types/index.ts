import { DeepPartial } from '../../../../core/shared-types/src/index.js';

export type ConfigValidator<T> = (config: T) => string | null;

export interface GameConfigOptions<T extends object> {
  defaults: T;
  environmentOverrides?: Record<string, DeepPartial<T>>;
  validator?: ConfigValidator<T>;
}

export type ConfigChangeListener<T> = (newConfig: Readonly<T>, oldConfig: Readonly<T>) => void;

