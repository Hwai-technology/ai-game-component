export type CurrencyId = 'coins' | 'gems' | 'stars' | string;

export type TransactionType = 'earn' | 'spend' | 'reward' | 'refund';

export interface EconomyTransaction {
  id: string;
  currencyId: CurrencyId;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  reason: string;
  timestamp: number;
}

export interface EconomyConfig {
  initialBalances?: Record<CurrencyId, number>;
  maxTransactionHistory?: number;
}

export interface EconomyState {
  balances: Record<CurrencyId, number>;
  transactions: EconomyTransaction[];
}

