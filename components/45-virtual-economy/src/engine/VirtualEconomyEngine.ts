import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable, Serializable } from '../../../../core/shared-types/src/index.js';
import { CurrencyId, EconomyConfig, EconomyState, EconomyTransaction } from '../types/index.js';

export class VirtualEconomyEngine implements Disposable, Serializable<EconomyState> {
  private readonly balances = new Map<CurrencyId, number>();
  private readonly transactions: EconomyTransaction[] = [];
  private readonly maxHistory: number;
  private txCounter = 0;
  private _isDisposed = false;

  constructor(config: EconomyConfig = {}) {
    this.maxHistory = config.maxTransactionHistory ?? 100;

    const initial = config.initialBalances ?? { coins: 0, gems: 0, stars: 0 };
    for (const [curr, amount] of Object.entries(initial)) {
      this.balances.set(curr, Math.max(0, amount));
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getBalance(currency: CurrencyId): number {
    return this.balances.get(currency) ?? 0;
  }

  public earn(currency: CurrencyId, amount: number, reason = 'gameplay'): EconomyTransaction {
    if (this._isDisposed) {
      throw new ValidationError('Economy engine is disposed');
    }
    if (amount <= 0) {
      throw new ValidationError('Earn amount must be strictly positive');
    }

    const current = this.getBalance(currency);
    const balanceAfter = current + amount;
    this.balances.set(currency, balanceAfter);

    return this.recordTransaction(currency, 'earn', amount, balanceAfter, reason);
  }

  public canAfford(currency: CurrencyId, amount: number): boolean {
    if (this._isDisposed || amount <= 0) return false;
    return this.getBalance(currency) >= amount;
  }

  public spend(currency: CurrencyId, amount: number, reason = 'purchase'): EconomyTransaction {
    if (this._isDisposed) {
      throw new ValidationError('Economy engine is disposed');
    }
    if (amount <= 0) {
      throw new ValidationError('Spend amount must be strictly positive');
    }

    const current = this.getBalance(currency);
    if (current < amount) {
      throw new ValidationError(
        `Insufficient ${currency} balance: requires ${amount}, currently have ${current}`
      );
    }

    const balanceAfter = current - amount;
    this.balances.set(currency, balanceAfter);

    return this.recordTransaction(currency, 'spend', amount, balanceAfter, reason);
  }

  public getState(): EconomyState {
    const b: Record<CurrencyId, number> = {};
    for (const [k, v] of this.balances.entries()) b[k] = v;

    return {
      balances: b,
      transactions: [...this.transactions],
    };
  }

  public serialize(): EconomyState {
    return this.getState();
  }

  public deserialize(data: EconomyState): void {
    this.balances.clear();
    for (const [k, v] of Object.entries(data.balances)) {
      this.balances.set(k, v);
    }
    this.transactions.length = 0;
    this.transactions.push(...data.transactions);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.balances.clear();
    this.transactions.length = 0;
  }

  private recordTransaction(
    currencyId: CurrencyId,
    type: 'earn' | 'spend' | 'reward' | 'refund',
    amount: number,
    balanceAfter: number,
    reason: string
  ): EconomyTransaction {
    this.txCounter++;
    const tx: EconomyTransaction = {
      id: `tx_${Date.now()}_${this.txCounter}`,
      currencyId,
      type,
      amount,
      balanceAfter,
      reason,
      timestamp: Date.now(),
    };

    this.transactions.push(tx);
    if (this.transactions.length > this.maxHistory) {
      this.transactions.shift();
    }

    return tx;
  }
}
