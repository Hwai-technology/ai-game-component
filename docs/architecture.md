# GameKit Architecture Specification
### Clean Engine & UI Separation · Monorepo Design · Performance Patterns

---

## 1. Architectural Philosophy

GameKit separates games into two distinct layers:
1. **Simulation Domain (The Brain):** Pure TypeScript state machines, deterministic integrators, collision math, inventory slots, and turn order solvers.
2. **Presentation Domain (The Senses):** React Native components, Reanimated animations, Skia canvas shaders, audio players, and haptic motors.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  React 19 · React Native 0.88.1 · Reanimated / Skia        │
│  UI Tokens from @core/theme-adapter (GleeBoo Design)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Reads State & Dispatches Actions
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     GameKit Core Engines                    │
│  Pure TypeScript 5.8 (Strict) · 100% Platform Agnostic      │
│  Zero DOM · Zero React / RN Dependencies · Headless Ready   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Emits Events
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  @core/event-system · @core/shared-types · Virtual Clock    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout & Monorepo Structure

```text
ai-game-component/
├── core/                         # Core contracts, types, and event brokers
│   ├── shared-types/             # Vector2D, Rectangle, Circle, Disposable
│   ├── error-system/             # GameError, ValidationError, StateTransitionError
│   ├── event-system/             # Typed GameEventBus with once, emit, telemetry
│   ├── theme-adapter/            # GleeBoo cartoon UI tokens (palette, chunky, motion)
│   ├── testing-utils/            # VirtualClock, MockEventSink
│   └── component-registry/       # Metadata catalog for all 50 components
│
├── components/                   # 50 production-quality game systems
│   ├── 01-game-loop/             # Fixed/variable timestep accumulator
│   ├── ...
│   └── 50-game-analytics/        # Telemetry batch flusher
│
├── cli/                          # CLI tooling (`gamekit`)
│   ├── bin/gamekit.ts            # Executable CLI
│   └── tests/cli.test.ts         # CLI unit tests
│
├── examples/                     # Composed playable games
│   ├── endless-runner-game/      # Loops + Runner + Collectibles + Obstacles + Scoring
│   ├── match-three-game/         # Match-3 + Cascades + Economy + Achievements
│   └── rpg-combat-game/          # Turn-Based Battle + Inventory + Stats + Skills
│
├── docs/                         # Architecture & compatibility documentation
│   ├── architecture.md
│   └── expo-compatibility.md
│
├── ui-kit/                       # Preserved cartoon UI widgets (untouched)
├── AGENTS.md                     # Master AI instruction file
└── package.json                  # Workspaces, test runner, strict TS scripts
```

---

## 3. High-Frequency Simulation Outside React

React rendering cycles must **never** be used as the internal game simulation clock:
- React state updates trigger expensive reconciliation and garbage collection.
- GameKit's `01-game-loop` manages simulation timesteps using high-resolution delta accumulators.
- The presentation layer subscribes only to meaningful state transitions or updates at screen refresh rates.

---

## 4. UI Kit Preservation & Theme Token Adapter

The root `ui-kit/` directory contains cartoon UI widgets with distinctive aesthetics:
- 3D Chunky buttons with offset bottom borders.
- Playful rounded radii (`pill: 999`, `lg: 22`).
- Rich color palettes (deep purple, vibrant teal, warm gold, punchy orange).

Rather than coupling the game engines to these UI components, `@core/theme-adapter` provides a pure TypeScript contract (`gamePalette`, `gameSurface`, `gameChunky`, `gameMotion`) that both the game compositions and frontend renderers consume cleanly.

