# 10. Puzzle Board Generator — AI Agent Context

## Purpose & Scope
Generates 2D puzzle grids using a deterministic pseudo-random number generator (PRNG) with custom tile placement factories.

## Usage
```typescript
const generator = new PuzzleBoardGenerator<string>();
const board = generator.generate({
  rows: 4,
  columns: 4,
  seed: 42,
  tileFactory: (r, c, prng) => prng() > 0.5 ? 'RED' : 'BLUE'
});
```
