# react-native-element-inspector

On-device element inspector for React Native — the "Inspect Element" experience for mobile.

## Related Projects

- **V5-APP**: `~/Desktop/V5-APP` — Reference RN project for conventions
- **Aftahan**: `~/Documents/aftahan` — Reference RN project for conventions

## Tech Stack

- React Native (pure TypeScript library — zero native modules)
- Expo 54 (example app only)
- TypeScript (strict)
- Biome (linting/formatting)
- bun (package manager)

## Architecture

### Library Structure

```
src/
  fiber/           # React fiber tree access (version-aware adapters)
  hooks/           # React hooks for inspector functionality
  utils/           # Pure utility functions (hit-testing, layout, etc.)
  *.tsx            # Top-level UI components
```

### Example App

```
example/
  screens/         # Test screens for each inspector capability
  App.tsx          # Tab navigator wrapped with <ElementInspector>
  metro.config.js  # Resolves library from ../src
```

Metro is configured to resolve the library from `../src` — edits to library code trigger Fast Refresh in the example app.

### Key APIs

- `__REACT_DEVTOOLS_GLOBAL_HOOK__` — fiber tree discovery and traversal
- `fiber.memoizedProps.style` — read styles from fiber nodes
- `StyleSheet.flatten()` — resolve StyleSheet IDs to plain objects
- `overrideProps()` — live style mutations via React's reconciler (works on both old arch and Fabric)

### Technical Decisions

See `react-native-element-inspector-spec.md` for full technical decisions on:

- New Architecture (Fabric) support via `overrideProps()`
- Hit-testing performance via layout snapshots
- Overlapping element cycling (smallest-area-first)
- Fiber compatibility layer (version-aware adapters)

## Commands

```bash
# Library
bun install               # Install library deps
bun run typecheck         # TypeScript check
bun run lint              # Biome lint
bun run test              # Jest tests

# Example app
cd example
bun run ios               # Run iOS simulator
bun run android           # Run Android emulator
```

## Conventions

1. **Arrow functions only:** Use `const` arrow functions, not `function` declarations

    ```typescript
    // CORRECT
    export const MyComponent = ({ style }: Props) => { ... };
    const handlePress = () => { ... };

    // WRONG
    export function MyComponent({ style }: Props) { ... }
    function handlePress() { ... }
    ```

2. **No single-letter variables:** Always use descriptive names

    ```typescript
    // CORRECT
    elements.map((element, index) => ...)
    const fiberDepth = getFiberDepth(fiber);

    // WRONG
    elements.map((e, i) => ...)
    const d = getFiberDepth(fiber);
    ```

3. **Zero external dependencies** in the library — all UI components are plain RN
4. **Biome** for linting and formatting (not ESLint/Prettier)
5. **Early returns** over nested conditionals
6. **TypeScript strict mode** — no `any` types, explicit return types on exports
7. **Path aliases:** `@/*` maps to `src/*` in the library
8. **Barrel exports** (`index.ts`) in subdirectories only
9. **Consolidate imports:** Merge multiple imports from the same module into one line. Use barrel exports for cross-directory imports. Only use direct file imports to break require cycles.

    ```typescript
    // CORRECT
    import { BOX_MODEL_COLORS, Z_INDEX } from './constants';
    import { FiberAdapter, type MeasuredElement } from './fiber';

    // WRONG — fragmented imports from same source
    import { BOX_MODEL_COLORS } from './constants/colors';
    import { Z_INDEX } from './constants/ui';
    import { FiberAdapter } from './fiber/FiberAdapter';
    import type { MeasuredElement } from './fiber/types';
    ```

10. **camelCase** for file names (except React components which use PascalCase)
11. **Keep components small** — one component per file

## React 19 Notes

- **No `forwardRef` needed:** React 19 supports `ref` as a regular prop
- **No `setNativeProps`:** Use `overrideProps()` via the devtools hook (works on Fabric)

## Testing Strategy

- **Unit tests** (Jest): `hitTest.ts`, `flattenStyles.ts`, `layoutSnapshot.ts` sorting logic
- **Manual testing**: Run the example app, test screens cover all edge cases
- **Example screens**: Basic, Nested, Overlap, Scroll, Stress (500+ elements)

## Preferences

- Prefer early returns over nested conditionals
- Keep components small and focused
- No over-engineering — minimum complexity for the current task
- No unnecessary comments — code should be self-explanatory
- Colocate related code (types near usage, not in a global types/ folder)
