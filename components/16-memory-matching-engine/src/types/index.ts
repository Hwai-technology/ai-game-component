export type CardState = 'hidden' | 'revealed' | 'matched';

export interface MemoryCard<T = string | number> {
  id: string;
  pairKey: T;
  state: CardState;
}

export interface MemoryFlipResult<T = string | number> {
  card: MemoryCard<T>;
  isMatch?: boolean;
  flippedPair?: [MemoryCard<T>, MemoryCard<T>];
  allMatched: boolean;
}

export interface MemoryMatchingConfig<T = string | number> {
  pairs: T[]; // e.g. ['apple', 'banana', 'cherry']
  shuffle?: boolean;
}

export interface MemoryMatchingState<T = string | number> {
  cards: MemoryCard<T>[];
  moves: number;
  matchesCount: number;
  isComplete: boolean;
}
