import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable, Serializable } from '../../../../core/shared-types/src/index.js';
import { IdleEngineConfig, IdleGenerator, IdleState } from '../types/index.js';

export class ClickerIdleEngine implements Disposable, Serializable<IdleState> {
  private currency = 0;
  private clickPower = 1;
  private readonly maxOfflineSeconds: number;
  private readonly offlineEfficiency: number;
  private readonly generators = new Map<string, IdleGenerator>();
  private lastSavedTimestamp = Date.now();
  private _isDisposed = false;

  constructor(config: IdleEngineConfig = {}) {
    this.currency = config.initialCurrency ?? 0;
    this.clickPower = config.clickPower ?? 1;
    this.maxOfflineSeconds = config.maxOfflineSeconds ?? 86400;
    this.offlineEfficiency = config.offlineEfficiency ?? 1.0;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public registerGenerator(generator: Omit<IdleGenerator, 'count' | 'multiplier'>): void {
    this.generators.set(generator.id, {
      ...generator,
      count: 0,
      multiplier: 1,
    });
  }

  public click(): number {
    if (this._isDisposed) return 0;
    this.currency += this.clickPower;
    return this.currency;
  }

  public getCost(generatorId: string): number {
    const gen = this.generators.get(generatorId);
    if (!gen) return 0;
    return Math.floor(gen.baseCost * Math.pow(gen.costMultiplier, gen.count));
  }

  public buyGenerator(generatorId: string, quantity = 1): boolean {
    if (this._isDisposed) return false;

    const gen = this.generators.get(generatorId);
    if (!gen) {
      throw new ValidationError(`Unknown generator '${generatorId}'`);
    }

    for (let i = 0; i < quantity; i++) {
      const cost = this.getCost(generatorId);
      if (this.currency < cost) return false;

      this.currency -= cost;
      gen.count++;
    }

    return true;
  }

  public getPassiveIncomePerSecond(): number {
    let sum = 0;
    for (const gen of this.generators.values()) {
      sum += gen.count * gen.baseProductionPerSecond * gen.multiplier;
    }
    return sum;
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed) return;
    const passiveRate = this.getPassiveIncomePerSecond();
    this.currency += passiveRate * deltaSeconds;
    this.lastSavedTimestamp = Date.now();
  }

  /**
   * Calculates offline gains accumulated while the app was closed.
   */
  public processOfflineProgress(currentTimestamp = Date.now()): number {
    if (this._isDisposed || this.lastSavedTimestamp <= 0) return 0;

    const elapsedSeconds = Math.max(0, (currentTimestamp - this.lastSavedTimestamp) / 1000);
    const clampedSeconds = Math.min(elapsedSeconds, this.maxOfflineSeconds);
    const rate = this.getPassiveIncomePerSecond();
    const earnings = clampedSeconds * rate * this.offlineEfficiency;

    this.currency += earnings;
    this.lastSavedTimestamp = currentTimestamp;
    return earnings;
  }

  public getState(): IdleState {
    return {
      currency: Math.floor(this.currency),
      clickPower: this.clickPower,
      passivePerSecond: this.getPassiveIncomePerSecond(),
      generators: Array.from(this.generators.values()).map((g) => ({ ...g })),
      lastSavedTimestamp: this.lastSavedTimestamp,
    };
  }

  public serialize(): IdleState {
    return this.getState();
  }

  public deserialize(data: IdleState): void {
    this.currency = data.currency;
    this.clickPower = data.clickPower;
    this.lastSavedTimestamp = data.lastSavedTimestamp;
    for (const gen of data.generators) {
      this.generators.set(gen.id, { ...gen });
    }
  }

  public dispose(): void {
    this._isDisposed = true;
  }
}

