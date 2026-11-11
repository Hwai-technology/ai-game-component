# Clean Architecture Specification for GameKit

---

## 1. UI Kit 4-File Component Pattern

Every component folder in `ui-kit/<ComponentName>/` must be structured into 4 isolated files:

```text
ui-kit/<ComponentName>/
├── types.ts      # Component props, state interfaces, and union types
├── styles.ts     # StyleSheet rules using design tokens
├── helper.ts     # Formatting helpers, color calculations, and validators
└── index.tsx     # The functional React component exporting the view
```

### File Responsibilities:
1. **`types.ts`:**
   - Defines `<ComponentName>Props` and domain models.
   - Exports all types needed by consumers.
   - Zero React or styling dependencies.
2. **`styles.ts`:**
   - Imports design tokens from `@/constants/theme/tokens`.
   - Creates the `StyleSheet.create({...})` object.
   - Exports `styles` as a named export.
3. **`helper.ts`:**
   - Pure functions for formatting numbers, determining rank colors, or mapping item states.
   - Fully unit-testable without mounting React Native components.
4. **`index.tsx`:**
   - Imports from `./types`, `./styles`, and `./helper`.
   - Implements animations using `react-native-reanimated` and feedback with `expo-haptics`.
   - Re-exports types for seamless importing via `ui-kit/index.ts`.

---

## 2. Game Engine Pattern in `components/`

Every game engine in `components/<id>-<engine-name>/` follows this structure:

```text
components/<id>-<name>/
├── src/
│   ├── types/index.ts      # Domain interfaces, event payloads, config options
│   ├── engine/<Name>.ts    # Pure TypeScript state machine implementing Disposable
│   └── index.ts            # Barrel export
├── tests/<Name>.test.ts    # Independent unit tests
├── ai/AGENTS.md            # AI prompt & integration instructions
├── README.md               # Developer documentation
└── package.json            # Workspace manifest declaring dependencies
```

