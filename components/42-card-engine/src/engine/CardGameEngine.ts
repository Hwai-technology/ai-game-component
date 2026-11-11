import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { CardEngineConfig, CardEngineState, CardItem } from '../types/index.js';

export class CardGameEngine implements Disposable {
  private drawPile: CardItem[] = [];
  private discardPile: CardItem[] = [];
  private readonly hand: CardItem[] = [];
  private readonly maxHandSize: number;
  private _isDisposed = false;

  constructor(config: CardEngineConfig = {}) {
    this.maxHandSize = config.maxHandSize ?? 7;
    if (config.initialDeck) {
      this.drawPile = config.initialDeck.map((c) => ({ ...c }));
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public shuffle(): void {
    if (this._isDisposed) return;
    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.drawPile[i]!;
      this.drawPile[i] = this.drawPile[j]!;
      this.drawPile[j] = temp;
    }
  }

  public draw(count = 1): CardItem[] {
    if (this._isDisposed) return [];

    const drawn: CardItem[] = [];

    for (let i = 0; i < count; i++) {
      if (this.hand.length >= this.maxHandSize) break; // Hand limit reached

      // If draw pile empty, reshuffle discard pile into draw pile
      if (this.drawPile.length === 0) {
        if (this.discardPile.length === 0) break; // No cards left anywhere
        this.drawPile = [...this.discardPile];
        this.discardPile = [];
        this.shuffle();
      }

      const card = this.drawPile.pop()!;
      this.hand.push(card);
      drawn.push(card);
    }

    return drawn;
  }

  public playCard(cardId: string): CardItem {
    if (this._isDisposed) {
      throw new ValidationError('Card engine is disposed');
    }

    const idx = this.hand.findIndex((c) => c.id === cardId);
    if (idx === -1) {
      throw new ValidationError(`Card '${cardId}' not found in hand`);
    }

    const card = this.hand.splice(idx, 1)[0]!;
    this.discardPile.push(card);
    return card;
  }

  public discardHand(): void {
    while (this.hand.length > 0) {
      const card = this.hand.pop()!;
      this.discardPile.push(card);
    }
  }

  public getState(): CardEngineState {
    return {
      drawPileCount: this.drawPile.length,
      discardPileCount: this.discardPile.length,
      hand: this.hand.map((c) => ({ ...c })),
    };
  }

  public dispose(): void {
    this._isDisposed = true;
    this.drawPile.length = 0;
    this.discardPile.length = 0;
    this.hand.length = 0;
  }
}

