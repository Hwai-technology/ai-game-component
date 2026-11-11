# 02. Game State Manager — AI Agent Context

## Purpose & Scope
The Game State Manager coordinates discrete state transitions (idle, loading, playing, paused, game_over, victory) with runtime validation, guards, and transition history.

## Integration Rules
1. Define explicit transition tables to prevent illegal states (e.g. entering 'victory' before 'playing').
2. Use `onEnter` and `onExit` hooks for clean resource initialization and teardown.
3. Keep game entity calculations separate from state progression.
4. Catch `StateTransitionError` if user or network actions trigger invalid state changes.

## Usage
```typescript
const fsm = new GameStateManager({
  initialState: 'idle',
  transitions: [
    { from: 'idle', to: 'playing' },
    { from: 'playing', to: 'paused' },
    { from: 'paused', to: 'playing' },
    { from: 'playing', to: 'game_over' },
  ]
});

fsm.transitionTo('playing');
```

