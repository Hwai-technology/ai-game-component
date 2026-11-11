# @gamekit/01-game-loop

High-performance, deterministic game loop engine for React Native and Expo SDK 58.

## Features
- **Deterministic Fixed Timestep:** Decouples game speed from device refresh rates.
- **Delta-Time Accumulator:** Eliminates frame stutter and protects against spiral-of-death.
- **Headless Testing Support:** Step through frames synchronously with `loop.step(dt)`.
- **Zero React Overhead:** Pure in-memory tick loop; does not trigger React Fiber reconciliations.

## Usage
```ts
import { GameLoopEngine } from '@gamekit/01-game-loop';

const loop = new GameLoopEngine({ fps: 60 });
loop.onUpdate(({ deltaTime }) => {
  // Update game simulation
});
loop.start();
```

