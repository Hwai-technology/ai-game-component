# 01. Game Loop Engine — AI Agent Context

## Purpose & Scope
The Game Loop Engine provides a high-performance, deterministic simulation ticker for mobile games built with React Native and Expo SDK 58.
It completely isolates simulation calculations from the React render pipeline, avoiding sluggish UI recalculations.

## Integration Rules
1. **DO NOT** bind `onUpdate` to `setState` directly on every tick.
2. Use `onUpdate` to mutate internal game entities or Reanimated SharedValues.
3. For HUD updates (e.g. score, timer), throttle state updates or sample every N frames.
4. Always invoke `loop.dispose()` in component unmount lifecycles (`useEffect` cleanup).

## Public API Contract
```typescript
const loop = new GameLoopEngine({
  fps: 60,
  fixedTimestep: true,
  maxDeltaTime: 0.1
});

const unsubscribe = loop.onUpdate(({ deltaTime, totalTime, currentFps }) => {
  // Update physics, movements, collision
});

loop.start();
loop.pause();
loop.resume();
loop.stop();
loop.dispose();
```

## Expo Compatibility
- **Expo SDK 58:** 100% Compatible with zero native build dependencies.
- **Expo Go:** Fully functional.
- **Headless Mode:** Supports deterministic `.step(delta)` for offline and unit testing.
