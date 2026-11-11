# Contributing to GameKit

Thank you for your interest in contributing to the GameKit ecosystem! This document outlines the engineering standards, commit conventions, branch workflows, and release processes.

---

## 1. Development Principles

- **Pure TypeScript Engines:** Game engines inside `components/` must remain pure TypeScript state machines with zero imports of `react`, `react-native`, or DOM APIs.
- **Strict Typing:** No `any`. Strict null checks and explicit interfaces are mandatory.
- **AI-Friendly Documentation:** Whenever modifying or adding a component, update its `ai/AGENTS.md` file to reflect accurate input/output types and invariants.
- **UI Kit Preservation:** The `ui-kit/` directory is strictly preserved. Styling tokens must be imported from `@core/theme-adapter`.

---

## 2. Commit Conventions (Conventional Commits)

We enforce the Conventional Commits specification. Every commit message must follow this format:

```text
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Allowed Types
- `feat`: Introduces a new feature or game component.
- `fix`: Fixes a bug or handles an edge-case invariant.
- `docs`: Documentation updates, AI context files, or README changes.
- `perf`: Performance enhancement (e.g., zero-allocation pooling, spatial partitioning).
- `refactor`: Refactoring without functional changes.
- `test`: Adding or updating test suites.
- `chore`: Build tooling, dependency bumps, or CI updates.

### Examples
```text
feat(12-match-three): implement diagonal combo detection
fix(01-game-loop): resolve negative delta time accumulator on resume
docs(AGENTS): document turn order calculation in turn-based combat
test(27-collision): add circle-to-circle intersection test cases
```

---

## 3. Step-by-Step Contribution Workflow

1. **Fork & Branch:**
   ```bash
   git checkout -b feat/my-new-system
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Verify Locally:**
   Before pushing, ensure that your code satisfies all quality gates:
   ```bash
   npm run typecheck
   npm test
   npm run gamekit doctor
   ```

4. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat(component-name): concise description of changes"
   git push origin feat/my-new-system
   ```

5. **Open a Pull Request:**
   Submit a PR against the `main` branch. GitHub Actions will automatically run the CI matrix on Node 20, 22, and 24 to verify compilation and tests.

---

## 4. Release & Publishing Protocol

Project maintainers follow semantic versioning (`vMAJOR.MINOR.PATCH`):

1. Ensure the `main` branch is green and all PRs are merged.
2. Tag the release:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Stable release with 50 components"
   git push origin v1.0.0
   ```
3. GitHub Actions (`.github/workflows/release.yml`) will automatically:
   - Validate tests and type checking.
   - Generate GitHub Release notes.
   - Publish packages to the npm registry.
