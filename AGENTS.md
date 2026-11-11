# AGENTS.md — AI Agent Master Operational Guide

This document is the authoritative instruction file for AI coding agents (Claude Code, GitHub Copilot, Codex, Gemini, Antigravity) operating in the **GameKit AI-Native Game Components Ecosystem**.

---

## 1. ECOSYSTEM IDENTITY & CORE CONSTRAINTS

- **Ecosystem Name:** `GameKit`
- **Target Runtime:** React Native `0.88.1`, Expo SDK `58.0.23`, React `19.3.0`, Hermes JavaScript Engine.
- **Language Mode:** TypeScript `5.8+` Strict (`noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`).
- **Core Principle:** **Strict Engine / UI Separation**.
  - All game engines in `components/` are **pure TypeScript** domain state machines.
  - Zero imports of `react`, `react-native`, `expo`, or UI libraries in core engines.
  - Platform adapters, storage, sound, and gesture bridges live strictly in adapters or application hooks.
- **UI Kit Preservation:**
  - `ui-kit/` contains existing application widgets and is **strictly preserved**. Do NOT add game mechanics or mutate files in `ui-kit/`.
  - To apply UI design tokens (palette, chunky 3D borders, radii, motion), import from `core/theme-adapter`.

---

## 2. COMPONENT DISCOVERY PROTOCOL

All 50 components are indexed and queryable via the `@gamekit/component-registry` or the CLI:

```bash
# List all 50 components
npm run gamekit list

# Filter by category (core | puzzle | arcade | physics | rpg | progression | services)
npm run gamekit list puzzle

# Search components by capability or keywords
npm run gamekit search runner
npm run gamekit search match-three

# Inspect full API specifications & Expo compatibility
npm run gamekit inspect 12-match-three-engine

# Retrieve component-specific AI prompt & instructions
npm run gamekit ai-context 01-game-loop
```

Every component directory contains an `ai/AGENTS.md` file detailing its public API, invariant rules, and assembly instructions.

---

## 3. THE 50 COMPONENTS CATALOG

### Category A: Core Game Architecture (`core`)
1. `01-game-loop` — Deterministic fixed/variable timestep accumulator game loop.
2. `02-game-state` — Strict state machine with guarded state transitions (`menu`, `playing`, `paused`, `game_over`).
3. `03-game-event` — Typed event broker with middleware pipelines and telemetry hooks.
4. `04-game-config` — Strongly typed configuration engine with deep-freeze immutability.
5. `05-game-session` — Session lifecycle coordinator, duration, and session metrics tracking.
6. `06-game-input` — Platform-agnostic touch, swipe, long-press gesture dispatcher.
7. `07-game-timer` — High-precision countdown, stopwatch, and timer system.
8. `08-game-lifecycle` — OS foreground/background supervisor with auto-pause policies.

### Category B: Puzzle and Board Games (`puzzle`)
9. `09-puzzle-engine` — Rule-based puzzle validation and victory condition evaluator.
10. `10-puzzle-board-generator` — Seeded, reproducible 2D grid layout generator.
11. `11-sliding-puzzle-system` — Inversion-parity solvable sliding tile puzzle engine.
12. `12-match-three-engine` — Match-3 grid swapper, cascading gravity, and multi-tier combo detector.
13. `13-word-puzzle-engine` — Contiguous letter matrix word finder (Boggle / Wordament).
14. `14-sudoku-engine` — 9x9 Sudoku solver, validator, and real-time conflict detector.
15. `15-chess-board-rules` — Turn-based board game rules foundation with capture logging.
16. `16-memory-matching-engine` — Card pair memory matching engine with flip states.
17. `17-trivia-quiz-engine` — Timed quiz engine with speed multipliers and category support.
18. `18-logic-puzzle-engine` — Constraint satisfaction number puzzle engine.

### Category C: Arcade and Casual Games (`arcade`)
19. `19-endless-runner` — Lane-switching, jumping, sliding, and distance acceleration runner.
20. `20-coin-collectible-system` — Proximity pickup, magnetic attraction, and haptic integration.
21. `21-obstacle-generator` — Procedural obstacle placement with speed-based intervals.
22. `22-power-up-system` — Timed power-ups, stacking policies, and buff expiration timers.
23. `23-bomb-hazard-system` — Detonation fuses, radial damage falloff, and chain reactions.
24. `24-reaction-time-engine` — Millisecond tap latency measurement and false-start penalty.
25. `25-clicker-idle-engine` — Idle incremental simulation with exponential costs and offline gains.
26. `26-rhythm-timing-engine` — Beat timeline with Perfect / Great / Good / Miss hit windows.

### Category D: Physics and Spatial Systems (`physics`)
27. `27-collision-2d` — High-performance AABB and Circle spatial collision tests.
28. `28-physics-2d-adapter` — Kinematic 2D Euler integrator (gravity, velocity, impulses).
29. `29-character-movement` — Top-down 8-directional acceleration and friction controller.
30. `30-platformer-movement` — Platformer physics with coyote time, jump buffering, and gravity scale.
31. `31-camera-viewport` — Smooth 2D camera tracking with bounding box clamps.
32. `32-spawn-pool-manager` — Zero-allocation entity reuse pooling system.
33. `33-pathfinding-astar` — Grid-based A* shortest path calculation with 4/8-way movement.
34. `34-tilemap-world` — Multi-layer tilemap coordinator with coordinate projection and collision querying.

### Category E: RPG and Narrative Systems (`rpg`)
35. `35-inventory-system` — Grid and slot-based RPG inventory with stacking.
36. `36-equipment-system` — Equipment slots (`main_hand`, `head`, `chest`) and stat modifier aggregation.
37. `37-character-stats` — Primary attributes and derived combat stats with level-up formulas.
38. `38-health-damage` — Health pool with armor mitigation, temporary shield absorption, and i-frames.
39. `39-skill-ability` — Skill cooldown manager with mana costs and target validation.
40. `40-quest-mission` — Multi-objective quest tracker with prerequisite dependency chains.
41. `41-dialogue-tree` — Branching dialogue engine with conditional choices.
42. `42-card-engine` — Deck shuffling, drawing, hand limit management, and graveyard discard.
43. `43-turn-based-combat` — Speed-initiative turn-based combat battle system.

### Category F: Progression, Economy and Services (`progression`, `services`)
44. `44-scoring-engine` — Score accumulator with combo timers and exponential multipliers.
45. `45-virtual-economy` — Multi-currency wallet (`coins`, `gems`, `energy`) with audit transaction logs.
46. `46-achievement-system` — Incremental achievement progression with coin rewards.
47. `47-level-progression` — Level unlock progression with 3-star rating evaluation.
48. `48-save-load-system` — Checksum-verified JSON serialization with schema version migration.
49. `49-leaderboard-adapter` — In-memory and remote-ready score ranking with percentile calculations.
50. `50-game-analytics` — Event buffering, batch flushing, and telemetry adapter.

---

## 4. COMPOSITION RECIPES

When building complete mobile games, combine components following these proven recipes:

### Recipe 1: Endless Runner Game
```typescript
import { GameLoopEngine } from '@gamekit/01-game-loop';
import { EndlessRunnerEngine } from '@gamekit/19-endless-runner';
import { CoinCollectibleSystem } from '@gamekit/20-coin-collectible-system';
import { ObstacleGenerator } from '@gamekit/21-obstacle-generator';
import { Collision2DEngine } from '@gamekit/27-collision-2d';
import { ScoringEngine } from '@gamekit/44-scoring-engine';
import { gleebooThemeTokens } from '@core/theme-adapter';
// See examples/endless-runner-game for full reference implementation
```

### Recipe 2: Match-3 Casual Game
```typescript
import { MatchThreeEngine } from '@gamekit/12-match-three-engine';
import { ScoringEngine } from '@gamekit/44-scoring-engine';
import { VirtualEconomyEngine } from '@gamekit/45-virtual-economy';
import { AchievementSystem } from '@gamekit/46-achievement-system';
// See examples/match-three-game for full reference implementation
```

### Recipe 3: Turn-Based RPG Battle
```typescript
import { InventorySystem } from '@gamekit/35-inventory-system';
import { EquipmentSystem } from '@gamekit/36-equipment-system';
import { CharacterStatsEngine } from '@gamekit/37-character-stats';
import { HealthDamageSystem } from '@gamekit/38-health-damage';
import { SkillAbilitySystem } from '@gamekit/39-skill-ability';
import { TurnBasedCombatEngine } from '@gamekit/43-turn-based-combat';
// See examples/rpg-combat-game for full reference implementation
```

---

## 5. QUALITY GATES & VERIFICATION

Before declaring any game implementation or component change complete, agents MUST run and verify:

1. **TypeScript Verification:**
   ```bash
   npm run typecheck
   # Output must report 0 errors across the entire codebase
   ```
2. **Automated Unit & Integration Test Suite:**
   ```bash
   npm test
   # Runs 74 unit and integration tests across core, all 50 components, CLI, and examples
   ```
3. **Environment Doctor Check:**
   ```bash
   npm run gamekit doctor
   ```

