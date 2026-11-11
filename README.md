# GameKit — AI-Native Game Components Ecosystem
### 50 Production-Quality Reusable Game Components for React Native & Expo SDK 58

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.8%20Strict-blue.svg)](https://www.typescriptlang.org/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-58.0.23-black.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.88.1-61DAFB.svg)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB.svg)](https://react.dev/)
[![Tests Passing](https://img.shields.io/badge/Tests-74%20Passing-brightgreen.svg)]()
[![Expo Go Ready](https://img.shields.io/badge/Expo%20Go-100%25%20Compatible-success.svg)]()

---

## 📖 Overview

**GameKit** is a comprehensive, production-ready ecosystem of **50 game systems and mechanics** designed specifically for mobile game development on React Native and Expo SDK 58.

Designed for both **human developers** and **autonomous AI coding agents**, GameKit eliminates the need to reinvent game loops, spatial collision, pathfinding, inventory slots, state machines, or match-three algorithms.

---

## 🏛 Core Architectural Principles

1. **Strict Engine & UI Separation:**
   All 50 game engines are implemented in **pure TypeScript**. They contain zero platform-native dependencies, zero DOM assumptions, and zero coupling to React Native rendering internals. They run identically on iOS, Android, web, and headless test runners.
2. **Preserved UI Kit:**
   Existing application UI widgets in `ui-kit/` are strictly preserved without contamination. Cartoon styling tokens (vibrant palettes, 3D chunky borders, rounded radii, and bounce animations) are consumed via `@core/theme-adapter`.
3. **Expo SDK 58 & Expo Go Ready:**
   100% of the core game components run natively in Expo Go without requiring custom development builds or native compilation.
4. **Hermes JS Engine Optimized:**
   Engines avoid uncontrolled memory allocations, using object pools (`32-spawn-pool-manager`) and spatial partitioning (`27-collision-2d`) to guarantee a stable 60 FPS.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-game-component

# Install dependencies
npm install

# Run TypeScript typecheck
npm run typecheck

# Run test suite across all 50 components & examples
npm test
```

### Using the GameKit CLI

GameKit includes an interactive CLI for human developers and AI agents:

```bash
# List all 50 registered components
npm run gamekit list

# Filter components by domain category
npm run gamekit list puzzle

# Search components by keyword or capability
npm run gamekit search runner

# Inspect full component specification and Expo SDK 58 compatibility
npm run gamekit inspect 12-match-three-engine

# Output AI agent instructions for a component
npm run gamekit ai-context 01-game-loop

# View the Expo SDK 58 & React Native 0.88.1 compatibility matrix
npm run gamekit compatibility

# Run ecosystem environment health check
npm run gamekit doctor
```

---

## 📦 The 50 Game Components Catalog

| ID | Name | Category | Status | Expo Go | Description |
|---|---|---|---|:---:|---|
| `01-game-loop` | Game Loop Engine | Core | Stable | ✅ | Deterministic fixed/variable timestep accumulator loop |
| `02-game-state` | Game State Manager | Core | Stable | ✅ | Strict Finite State Machine with transition validation |
| `03-game-event` | Game Event System | Core | Stable | ✅ | Typed event broker with middleware and telemetry |
| `04-game-config` | Game Config Engine | Core | Stable | ✅ | Deep-frozen configuration engine with runtime validation |
| `05-game-session` | Game Session Manager | Core | Stable | ✅ | Session duration, telemetry, and analytics tracking |
| `06-game-input` | Game Input Controller | Core | Stable | ✅ | Cross-platform touch, swipe, and gesture dispatcher |
| `07-game-timer` | Game Timer System | Core | Stable | ✅ | High-precision countdown, stopwatch, and timer system |
| `08-game-lifecycle` | Game Lifecycle Manager | Core | Stable | ✅ | OS foreground/background supervisor with auto-pause |
| `09-puzzle-engine` | Puzzle Engine | Puzzle | Stable | ✅ | Rule-based puzzle validation and victory evaluator |
| `10-puzzle-board-generator` | Board Generator | Puzzle | Stable | ✅ | Seeded, reproducible 2D puzzle board generator |
| `11-sliding-puzzle-system` | Sliding Puzzle | Puzzle | Stable | ✅ | Solvable sliding tile puzzle engine with parity checks |
| `12-match-three-engine` | Match-3 Engine | Puzzle | Stable | ✅ | Match-3 grid swapping, cascading gravity & combos |
| `13-word-puzzle-engine` | Word Puzzle Engine | Puzzle | Stable | ✅ | Contiguous letter matrix word finder |
| `14-sudoku-engine` | Sudoku Engine | Puzzle | Stable | ✅ | 9x9 Sudoku solver with conflict validation |
| `15-chess-board-rules` | Board Game Rules | Puzzle | Stable | ✅ | Turn-based board game rules foundation |
| `16-memory-matching-engine` | Memory Matching | Puzzle | Stable | ✅ | Card pair memory matching engine with flip states |
| `17-trivia-quiz-engine` | Trivia Quiz Engine | Puzzle | Stable | ✅ | Timed trivia engine with speed multipliers |
| `18-logic-puzzle-engine` | Logic Puzzle Engine | Puzzle | Stable | ✅ | Constraint satisfaction number puzzle engine |
| `19-endless-runner` | Endless Runner Engine | Arcade | Stable | ✅ | Lane-switching, jumping, sliding, and acceleration |
| `20-coin-collectible-system` | Collectible System | Arcade | Stable | ✅ | Proximity pickup, magnetic attraction & haptics |
| `21-obstacle-generator` | Obstacle Generator | Arcade | Stable | ✅ | Procedural runner obstacle spawner with intervals |
| `22-power-up-system` | Power-Up System | Arcade | Stable | ✅ | Timed buffs, stacking policies, and expiration timers |
| `23-bomb-hazard-system` | Bomb Hazard System | Arcade | Stable | ✅ | Area-of-effect explosion and radial damage falloff |
| `24-reaction-time-engine` | Reaction Time Engine | Arcade | Stable | ✅ | Millisecond tap latency measurement & false-starts |
| `25-clicker-idle-engine` | Clicker Idle Engine | Arcade | Stable | ✅ | Incremental idle engine with offline math calculations |
| `26-rhythm-timing-engine` | Rhythm Timing Engine | Arcade | Stable | ✅ | Beat timeline with Perfect / Great / Good / Miss |
| `27-collision-2d` | Collision 2D Engine | Physics | Stable | ✅ | High-performance 2D AABB and Circle intersections |
| `28-physics-2d-adapter` | Physics 2D Adapter | Physics | Stable | ✅ | Kinematic 2D Euler integrator (gravity, impulses) |
| `29-character-movement` | Character Movement | Physics | Stable | ✅ | 8-directional acceleration, deceleration, and friction |
| `30-platformer-movement` | Platformer Movement | Physics | Stable | ✅ | Coyote time, jump buffering, and gravity scales |
| `31-camera-viewport` | Camera Viewport | Physics | Stable | ✅ | Smooth 2D camera tracking with bounding box clamps |
| `32-spawn-pool-manager` | Spawn Pool Manager | Physics | Stable | ✅ | Zero-allocation entity reuse pooling system |
| `33-pathfinding-astar` | Pathfinding A* | Physics | Stable | ✅ | Grid-based A* shortest path search algorithm |
| `34-tilemap-world` | Tilemap World System | Physics | Stable | ✅ | Multi-layer 2D tilemap coordinator and solid hits |
| `35-inventory-system` | Inventory System | RPG | Stable | ✅ | Grid and slot-based RPG inventory management |
| `36-equipment-system` | Equipment System | RPG | Stable | ✅ | Equipment slot assignment and stat modifier aggregation |
| `37-character-stats` | Character Stats Engine | RPG | Stable | ✅ | Primary attributes, derived stats, and level formulas |
| `38-health-damage` | Health Damage System | RPG | Stable | ✅ | Health pool with armor mitigation, shields, and i-frames |
| `39-skill-ability` | Skill Ability System | RPG | Stable | ✅ | Skill cooldown manager with mana costs |
| `40-quest-mission` | Quest Mission System | RPG | Stable | ✅ | Multi-objective quest tracker with prerequisites |
| `41-dialogue-tree` | Dialogue Tree Engine | RPG | Stable | ✅ | Branching dialogue engine with conditional choices |
| `42-card-engine` | Card Game Engine | RPG | Stable | ✅ | Deck shuffling, card drawing, and hand limits |
| `43-turn-based-combat` | Turn-Based Combat | RPG | Stable | ✅ | Speed-initiative turn-based combat battle system |
| `44-scoring-engine` | Scoring Engine | Progression | Stable | ✅ | Score accumulator with combo timers & multipliers |
| `45-virtual-economy` | Virtual Economy | Progression | Stable | ✅ | Multi-currency wallet with audit transaction logs |
| `46-achievement-system` | Achievement System | Progression | Stable | ✅ | Incremental achievement progression with rewards |
| `47-level-progression` | Level Progression | Progression | Stable | ✅ | Level unlock progression with 3-star rating evaluation |
| `48-save-load-system` | Save / Load System | Services | Stable | ✅ | Checksum-verified JSON serialization and migrations |
| `49-leaderboard-adapter` | Leaderboard Adapter | Services | Stable | ✅ | High score rankings with percentile calculations |
| `50-game-analytics` | Game Analytics Engine | Services | Stable | ✅ | Telemetry event buffering and batch flushing |

---

## 🎮 Playable Composition Examples

Three complete, verified game examples demonstrate how to compose GameKit systems:

1. **Endless Runner Game (`examples/endless-runner-game`):**
   Composes `01-game-loop`, `19-endless-runner`, `20-coin-collectible-system`, `21-obstacle-generator`, `27-collision-2d`, and `44-scoring-engine`.
2. **Match-Three Casual Game (`examples/match-three-game`):**
   Composes `12-match-three-engine`, `44-scoring-engine`, `45-virtual-economy`, and `46-achievement-system`.
3. **Turn-Based RPG Combat Game (`examples/rpg-combat-game`):**
   Composes `35-inventory-system`, `36-equipment-system`, `37-character-stats`, `38-health-damage`, `39-skill-ability`, and `43-turn-based-combat`.

---

## 🧪 Verification & Tests

To execute the entire monorepo test suite (74 tests):

```bash
npm test
```

Expected output:
```text
ℹ tests 74
ℹ suites 5
ℹ pass 74
ℹ fail 0
ℹ duration_ms ~320ms
```

To run TypeScript strict type-checking:

```bash
npm run typecheck
# Output: clean 0 errors
```

---

## 📜 License

MIT License. Designed with excellence for human engineers and AI developer tools.

