# 04. Game Configuration Engine — AI Agent Context

## Purpose & Scope
Manages strongly typed game configurations, default settings, environment-specific overrides, and runtime updates with validation gates.

## Usage
```typescript
const config = new GameConfigEngine({
  defaults: { maxLives: 3, soundEnabled: true },
  validator: (cfg) => cfg.maxLives > 0 ? null : 'Lives must be positive'
});
```
