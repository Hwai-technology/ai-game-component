# @gamekit/02-game-state

Strict Finite State Machine with validated transitions, state guards, and history tracking.

## Usage
```ts
import { GameStateManager } from '@gamekit/02-game-state';

const fsm = new GameStateManager({
  initialState: 'ready',
  transitions: [
    { from: 'ready', to: 'playing' },
    { from: 'playing', to: 'game_over' },
  ],
});
```
