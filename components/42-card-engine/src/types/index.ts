export interface CardItem {
  id: string;
  name: string;
  cost?: number;
  type?: string;
  metadata?: Record<string, unknown>;
}

export interface CardEngineConfig {
  maxHandSize?: number; // default 7
  initialDeck?: CardItem[];
}

export interface CardEngineState {
  drawPileCount: number;
  discardPileCount: number;
  hand: CardItem[];
}

