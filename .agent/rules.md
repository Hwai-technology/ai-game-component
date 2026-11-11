# GameKit AI Agent Master Rules

This file defines the strict architectural and design rules for AI coding assistants working in the **GameKit Ecosystem** (`https://github.com/Hwai-technology/ai-game-component`).

---

## 1. Core Engineering Principles

1. **Strict Engine / UI Separation:**
   - Game engines in `components/` are **pure TypeScript** state machines.
   - Core engines must never import `react`, `react-native`, `expo`, or UI widgets.
   - Engines must run identically in headless Node.js tests, iOS, Android, and web.

2. **Clean 4-File Component Architecture in `ui-kit/`:**
   Every component directory inside `ui-kit/` must follow the clean separation structure:
   - `types.ts`: Public TypeScript interfaces, props, and enum contracts.
   - `styles.ts`: React Native `StyleSheet` definitions referencing `@/constants/theme/tokens`.
   - `helper.ts`: Helper formatting utilities, color mappers, and validation logic.
   - `index.tsx`: Presentational React component composing styles and helpers.

3. **Design Tokens & Visual Aesthetics:**
   - Always consume tokens from `@/constants/theme/tokens` (or `@core/theme-adapter`).
   - Use 3D chunky borders: `borderBottomWidth: chunky.edge.md`, rounded corners (`radius.md`, `radius.pill`), and cartoon palette colors.
   - No hardcoded ad-hoc hex values.

4. **Zero `any` Policy:**
   - Strict TypeScript is mandatory (`noImplicitAny`, `strictNullChecks`).
   - All method inputs and return types must be explicitly typed.

5. **Hermes JS Optimization:**
   - High-frequency simulation updates must run outside React render cycles.
   - Use `32-spawn-pool-manager` to eliminate garbage collector pauses during high entity creation.
   - Use `27-collision-2d` spatial grid for collision indexing instead of $O(n^2)$ comparisons.

6. **Automated Verification:**
   - Never consider a change complete without running:
     ```bash
     npm run typecheck
     npm test
     ```

