export type StandardGameState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'game_over'
  | 'victory';

export interface StateTransition<S extends string = StandardGameState> {
  from: S | S[];
  to: S;
  guard?: (context?: unknown) => boolean;
}

export interface StateChangeEvent<S extends string = StandardGameState> {
  previousState: S;
  currentState: S;
  timestamp: number;
  payload?: unknown;
}

export type StateListener<S extends string = StandardGameState> = (event: StateChangeEvent<S>) => void;

export interface GameStateConfig<S extends string = StandardGameState> {
  initialState: S;
  transitions?: StateTransition<S>[];
  maxHistoryLength?: number;
}

