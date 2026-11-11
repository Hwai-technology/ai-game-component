# GameKit — AI-Native Mobile Game Components Ecosystem
### 50 Decoupled Production-Ready Systems for React Native & Expo SDK 58

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.8%20Strict-3178C6.svg)](https://www.typescriptlang.org/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-58.0.23-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.88.1-61DAFB.svg)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB.svg)](https://react.dev/)
[![CI Status](https://img.shields.io/badge/CI-Passing%20(74%2F74)-brightgreen.svg)]()
[![Expo Go Ready](https://img.shields.io/badge/Expo%20Go-100%25%20Compatible-success.svg)]()

---

## 1. Architectural Vision

GameKit is an open-source, AI-first game systems architecture engineered specifically for mobile cross-platform game development using **React Native**, **Expo SDK 58**, and **TypeScript Strict Mode**.

It provides an integrated collection of **50 decoupled, thoroughly tested game engines** that human engineers and autonomous AI coding agents can assemble into complete mobile titles.

### Pure Engine & UI Separation
- **Simulation Layer (Pure TypeScript):** Every game system in `components/` is a pure mathematical state machine with zero imports of `react`, `react-native`, or DOM elements.
- **Presentation Layer (React Native):** Visual rendering is handled through standard React Native components, Reanimated, or Skia. UI styling tokens (chunky borders, vibrant palettes, rounded radii) are bridged via `@core/theme-adapter`.
- **Hermes JS Optimization:** Designed to run at a consistent 60 FPS on both iOS and Android devices, utilizing zero-allocation object pools and spatial partitioning to eliminate garbage collection stutter.

---

## 2. Platform & Dependency Specifications

| Environment / Library | Target Version | Compatibility Notes |
|---|---|---|
| **Expo SDK** | `58.0.23` | Native support for iOS and Android |
| **React Native** | `0.88.1` | Core mobile runtime |
| **React** | `19.3.0` | React core framework |
| **TypeScript** | `5.8+` (Strict Mode) | `noImplicitAny`, `strictNullChecks` enforced |
| **JavaScript Engine** | Hermes Engine | Optimized bytecode execution |
| **Node.js Environment** | `>= 20.0.0` (Tested on `v24.18.0`) | Headless testing and CLI execution |

### Supported Expo Native Adapters
Core engines are 100% compatible with standard **Expo Go**. When device hardware integration is needed, components connect seamlessly to official Expo modules:
- `expo-haptics`: Tactile feedback for collisions and pickups (`20-coin-collectible-system`, `24-reaction-time-engine`).
- `expo-av` / `expo-audio`: Audio playback for music and rhythm windows (`26-rhythm-timing-engine`).
- `expo-sensors`: Accelerometer and gyroscope inputs (`06-game-input`, `29-character-movement`).
- `expo-file-system`: Local serialization and persistence (`48-save-load-system`).

---

## 3. High Performance on iOS & Android

Mobile games on Hermes require predictable memory and execution patterns:

1. **Independent Simulation Timestep:**
   GameKit uses `01-game-loop` with a deterministic accumulator clock. High-frequency physics updates never trigger React reconciliation cycles.
2. **Zero-Allocation Entity Pooling (`32-spawn-pool-manager`):**
   Continuous instantiation of projectiles, particles, and collectible coins causes severe GC pauses on mobile devices. GameKit pools reuse pre-allocated memory structures.
3. **Spatial Grid Collision Indexing (`27-collision-2d`):**
   Replaces naive $O(n^2)$ entity comparisons with uniform 2D grid hashing, reducing collision calculations to sub-millisecond execution times.
4. **Hermes Bytecode Friendly:**
   Zero reliance on `eval`, dynamic function construction, or unpredictable prototype mutations.

---

## 4. The 50 Reusable Game Components

### Category A: Core Game Architecture (`core`)
- **`01-game-loop`**: Controlled simulation loop with delta-time calculation, fixed timestep accumulator, and frame pause/resume.
- **`02-game-state`**: Deterministic state machine managing transitions (`menu`, `playing`, `paused`, `game_over`) with guard conditions.
- **`03-game-event`**: Strongly typed event bus supporting middleware interceptors, one-time listeners, and telemetry sinks.
- **`04-game-config`**: Immutability-enforced configuration system with deep freeze and dynamic runtime validation.
- **`05-game-session`**: Tracks session duration, metrics, and gameplay statistics across game attempts.
- **`06-game-input`**: Gesture recognizer dispatching taps, long-presses, drags, and directional swipes to abstract game actions.
- **`07-game-timer`**: High-precision stopwatch and countdown timers with pause, resume, and completion triggers.
- **`08-game-lifecycle`**: OS-level app state supervisor handling background sleep, auto-pausing, and safe resumption.

### Category B: Puzzle & Board Games (`puzzle`)
- **`09-puzzle-engine`**: Rule engine evaluating move legality, move counters, and victory/defeat criteria.
- **`10-puzzle-board-generator`**: Procedural 2D board generator with seeded deterministic repeatability.
- **`11-sliding-puzzle-system`**: Sliding tile grid validator ensuring mathematical inversion parity for guaranteed solvability.
- **`12-match-three-engine`**: Match-3 board manager handling swaps, recursive cascading gravity, combos, and tile refills.
- **`13-word-puzzle-engine`**: Matrix word search engine verifying contiguous letter path connectivity against dictionaries.
- **`14-sudoku-engine`**: 9x9 Sudoku board validator, rule conflict detector, and hint engine.
- **`15-chess-board-rules`**: Grid-based strategy rule foundation with turn tracking and piece capture logging.
- **`16-memory-matching-engine`**: Card pair matching game tracking hidden, revealed, and cleared pairs.
- **`17-trivia-quiz-engine`**: Timed quiz system with category filters, question progression, and speed bonuses.
- **`18-logic-puzzle-engine`**: Constraint satisfaction engine solving and validating numerical and deduction puzzles.

### Category C: Arcade & Casual Games (`arcade`)
- **`19-endless-runner`**: Multi-lane runner with jumping, sliding, lateral switching, and speed acceleration.
- **`20-coin-collectible-system`**: Proximity detection for item gathering, magnet attraction, and haptic triggers.
- **`21-obstacle-generator`**: Procedural obstacle placement with variable spawn intervals based on player speed.
- **`22-power-up-system`**: Temporary status buffs (shields, multipliers, speed) with stacking rules and expirations.
- **`23-bomb-hazard-system`**: Area-of-effect explosive hazards with timed fuses and radial damage mitigation.
- **`24-reaction-time-engine`**: Millisecond tap latency measurement with false-start detection and penalty logic.
- **`25-clicker-idle-engine`**: Incremental simulation computing active taps, passive generators, and offline progress.
- **`26-rhythm-timing-engine`**: Beat-sync evaluation matching player taps against note timelines (Perfect, Great, Good, Miss).

### Category D: Physics & Spatial Systems (`physics`)
- **`27-collision-2d`**: Spatial intersection engine testing 2D Axis-Aligned Bounding Boxes (AABB) and Circles.
- **`28-physics-2d-adapter`**: Kinematic Euler integrator applying gravitational acceleration, linear velocity, and impulses.
- **`29-character-movement`**: Top-down 8-directional acceleration, target velocity clamping, and surface friction.
- **`30-platformer-movement`**: Platform physics featuring coyote time, jump buffering, and gravity multipliers.
- **`31-camera-viewport`**: Smooth 2D target following with lerp smoothing and bounding box world clamping.
- **`32-spawn-pool-manager`**: Zero-allocation entity reuse pooling system for high-volume entities.
- **`33-pathfinding-astar`**: Grid-based A* shortest path search algorithm supporting 4-way and 8-way navigation.
- **`34-tilemap-world`**: Multi-layer 2D tilemap manager handling world coordinate projections and solid tile collisions.

### Category E: RPG & Narrative Systems (`rpg`)
- **`35-inventory-system`**: Slot-based inventory manager handling item capacities, stack limits, and item swapping.
- **`36-equipment-system`**: Equipment slots (`main_hand`, `head`, `chest`, etc.) with automatic stat bonus aggregation.
- **`37-character-stats`**: Primary character attributes (strength, agility) and formulaic derived combat stats.
- **`38-health-damage`**: Hitpoint pools with armor mitigation, temporary shield absorption, and invulnerability frames.
- **`39-skill-ability`**: Active skill management tracking resource costs (mana/energy), cooldowns, and readiness.
- **`40-quest-mission`**: Multi-objective quest manager with prerequisite task trees and completion tracking.
- **`41-dialogue-tree`**: Branching narrative dialogue walker evaluating conditional dialogue choices and flags.
- **`42-card-engine`**: Deck drawing, hand size limits, discard piles, and card shuffling.
- **`43-turn-based-combat`**: Initiative turn-order combat system resolving player and enemy actions.

### Category F: Progression, Economy & Services (`progression`, `services`)
- **`44-scoring-engine`**: Dynamic score accumulator with combo timers, multiplier streaks, and high score tracking.
- **`45-virtual-economy`**: Multi-currency wallet (`coins`, `gems`, `energy`) with audit transaction ledgers.
- **`46-achievement-system`**: Incremental achievement progress tracking with rewards and unlock notifications.
- **`47-level-progression`**: Level map progression with 3-star scoring evaluations and level gating.
- **`48-save-load-system`**: Checksum-verified JSON state serialization with schema version migration support.
- **`49-leaderboard-adapter`**: In-memory and cloud-ready score ranking with percentile calculations.
- **`50-game-analytics`**: Telemetry event buffer with automatic batch flushing.

---

## 5. Developer & AI Agent CLI

GameKit includes a command-line interface for querying system contracts, inspecting dependencies, and extracting AI prompts:

```bash
# Formatted table of all 50 registered systems
npm run gamekit list

# Filter systems by category (core, puzzle, arcade, physics, rpg, progression, services)
npm run gamekit list arcade

# Search systems by capability or keyword
npm run gamekit search match-three

# Inspect full specifications, Expo compatibility, and exports
npm run gamekit inspect 12-match-three-engine

# Extract specialized instructions for AI coding agents
npm run gamekit ai-context 01-game-loop

# View the full Expo SDK 58 & React Native 0.88.1 matrix
npm run gamekit compatibility

# Execute an environment and configuration health check
npm run gamekit doctor
```

---

## 6. Playable Composition Examples

Three complete, verified game examples demonstrate how to compose GameKit systems:

1. **Endless Runner Game (`examples/endless-runner-game`):**
   Composes `01-game-loop`, `19-endless-runner`, `20-coin-collectible-system`, `21-obstacle-generator`, `27-collision-2d`, and `44-scoring-engine`.
2. **Match-Three Casual Game (`examples/match-three-game`):**
   Composes `12-match-three-engine`, `44-scoring-engine`, `45-virtual-economy`, and `46-achievement-system`.
3. **Turn-Based RPG Combat Game (`examples/rpg-combat-game`):**
   Composes `35-inventory-system`, `36-equipment-system`, `37-character-stats`, `38-health-damage`, `39-skill-ability`, and `43-turn-based-combat`.

---

## 7. Git Workflow, Commits & Release Automation

### Conventional Commits Standard
All pull requests and commits must follow the **Conventional Commits** specification:

```text
<type>(<scope>): <short summary>

[optional body explaining context and architectural impact]

[optional footer(s) such as Closes #123]
```

#### Commit Types
- `feat`: A new game component, system, or feature.
- `fix`: A bug fix or invariant resolution.
- `docs`: Documentation updates, AI context revisions, or README improvements.
- `perf`: Performance optimizations (e.g. spatial grid acceleration, pooling).
- `refactor`: Code restructuring without modifying behavior.
- `test`: Adding or correcting unit and integration tests.
- `chore`: Routine dependency bumps or tooling updates.

### Pushing Code & Opening Pull Requests

```bash
# 1. Create a feature branch
git checkout -b feat/add-powerup-multiplier

# 2. Stage changes
git add .

# 3. Commit using Conventional Commits standard
git commit -m "feat(22-power-up): add support for decaying multiplier buffs"

# 4. Run quality gates before pushing
npm run typecheck
npm test

# 5. Push branch to remote
git push origin feat/add-powerup-multiplier
```

### Automated Release & Publishing Process
GameKit uses automated GitHub Actions workflows to cut releases:

1. **Version Tagging:**
   Create and push an annotated git tag following semantic versioning (`vMAJOR.MINOR.PATCH`):
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Initial release of all 50 components"
   git push origin v1.0.0
   ```
2. **Automated CI/CD Pipeline (`.github/workflows/release.yml`):**
   - Automatically checks out the repository and runs `npm ci`.
   - Runs `npm run typecheck` across all workspaces.
   - Executes all 74 unit and integration tests across Node 20, 22, and 24.
   - Generates release notes and publishes a new GitHub Release.
   - Publishes packages to the npm registry if `NPM_TOKEN` is configured.

---

## 8. Verification Commands

```bash
# Run strict TypeScript compiler check (0 errors)
npm run typecheck

# Run complete 74-test unit and integration suite
npm test
```

---

## 9. Community Sponsorship & Donations

GameKit is an open-source initiative designed to accelerate mobile game development for human engineers and AI developer tools.

If GameKit helps you build your games, consider supporting its maintenance and continued evolution:

- **GitHub Sponsors:** Support the project maintainers directly.
- **Community Backing:** Contributions directly fund documentation, new game mechanics, and upcoming Expo SDK upgrades.

---

## 10. Contributors

We celebrate and recognize all engineers and community members who contribute to GameKit!

<!-- CONTRIBUTORS-START -->

- **Eng.Ahmet Asaad Hammoud**

<!-- CONTRIBUTORS-END -->

---

## 11. Automated CI/CD & Repository Operations

The repository includes a modern GitHub Actions automation suite in `.github/workflows/`:

- **Continuous Integration (`ci.yml`):** Runs on every pull request and push to verify Node 20, 22, and 24, checking TypeScript types, running 74 tests, and executing `gamekit doctor`.
- **Automated Semantic Release (`auto-release.yml`):** Automatically evaluates Conventional Commits on `main`, bumps semantic version tags (`vMAJOR.MINOR.PATCH`), generates release notes, and publishes GitHub Releases.
- **Dependabot Auto-Merge (`dependabot-auto-merge.yml`):** Automatically merges patch and minor dependency updates once all verification checks pass.
- **Automated Contributors Sync (`contributors.yml`):** Automatically parses commit authors and updates the Contributors section in `README.md`.
- **PR Title Linter (`pr-lint.yml`):** Ensures pull requests adhere to Conventional Commits standards to keep changelogs clean.
- **Stale Issue & PR Management (`stale.yml`):** Keeps the repository clean by gently warning and closing inactive discussions.

---

## 12. License

MIT License. Designed with engineering precision for mobile game developers and AI tools.
