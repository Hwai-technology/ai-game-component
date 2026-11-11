import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { MemoryCard, MemoryFlipResult, MemoryMatchingConfig, MemoryMatchingState } from '../types/index.js';

export class MemoryMatchingEngine<T = string | number> implements Disposable {
  private readonly cards: MemoryCard<T>[] = [];
  private activeFlipped: MemoryCard<T>[] = [];
  private moves = 0;
  private matchesCount = 0;
  private readonly totalPairs: number;
  private isComplete = false;
  private _isDisposed = false;

  constructor(config: MemoryMatchingConfig<T>) {
    this.totalPairs = config.pairs.length;

    // Create two copies of each pair key
    let idCounter = 0;
    for (const key of config.pairs) {
      this.cards.push({ id: `card_${idCounter++}`, pairKey: key, state: 'hidden' });
      this.cards.push({ id: `card_${idCounter++}`, pairKey: key, state: 'hidden' });
    }

    if (config.shuffle !== false) {
      this.shuffle();
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): MemoryMatchingState<T> {
    return {
      cards: this.cards.map((c) => ({ ...c })),
      moves: this.moves,
      matchesCount: this.matchesCount,
      isComplete: this.isComplete,
    };
  }

  public canFlip(cardId: string): boolean {
    if (this._isDisposed || this.isComplete || this.activeFlipped.length >= 2) return false;
    const card = this.cards.find((c) => c.id === cardId);
    return !!card && card.state === 'hidden';
  }

  public flip(cardId: string): MemoryFlipResult<T> {
    if (this._isDisposed || this.isComplete) {
      throw new ValidationError('Game is already complete or disposed');
    }

    if (!this.canFlip(cardId)) {
      throw new ValidationError(`Cannot flip card ${cardId}`);
    }

    const card = this.cards.find((c) => c.id === cardId)!;
    card.state = 'revealed';
    this.activeFlipped.push(card);

    if (this.activeFlipped.length === 2) {
      this.moves++;
      const [first, second] = this.activeFlipped as [MemoryCard<T>, MemoryCard<T>];
      const isMatch = first.pairKey === second.pairKey;

      if (isMatch) {
        first.state = 'matched';
        second.state = 'matched';
        this.matchesCount++;
        this.activeFlipped = [];

        if (this.matchesCount >= this.totalPairs) {
          this.isComplete = true;
        }

        return {
          card,
          isMatch: true,
          flippedPair: [first, second],
          allMatched: this.isComplete,
        };
      } else {
        return {
          card,
          isMatch: false,
          flippedPair: [first, second],
          allMatched: false,
        };
      }
    }

    return {
      card,
      allMatched: false,
    };
  }

  /**
   * Called to turn back cards that didn't match after UI presentation delay.
   */
  public unflipMismatch(): void {
    if (this._isDisposed) return;
    for (const card of this.activeFlipped) {
      if (card.state === 'revealed') {
        card.state = 'hidden';
      }
    }
    this.activeFlipped = [];
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.cards[i]!;
      this.cards[i] = this.cards[j]!;
      this.cards[j] = temp;
    }
  }
}

