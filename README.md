# react-native-element-inspector

On-device element inspector for React Native. The "Inspect Element" experience for mobile.

Tap any element in your app to see its styles, edit them live, toggle properties on and off, and add new ones - all from a draggable floating panel. Zero external dependencies, pure React Native.

## Features

- **Tap to select** - tap any element to inspect it. Overlapping elements are sorted smallest-first so you always get the one you meant
- **Floating bubble** - a draggable radar-sweep bubble that snaps to screen edges, built with PanResponder + Animated
- **Inspector panel** - expands into a scrollable list of every style property on the selected element
- **Live editing** - tap any value (or key) to edit it inline. Changes apply instantly via React's reconciler
- **Property toggling** - checkbox next to each property to disable/enable it without deleting
- **Add properties** - "+ add property" button at the bottom for adding new style properties on the fly
- **Color swatches** - visual color preview next to color properties
- **Element cycling** - cycle through overlapping elements at the same tap point
- **Box model highlight** - Chrome DevTools-style overlay showing margin, padding, and content areas
- **Source mapping** - displays component name and source file location
- **React 18 & 19** - version-aware fiber adapters for both React versions
- **Old Architecture & Fabric** - works on both via `overrideProps()`

## Installation

```bash
npm install react-native-element-inspector
# or
yarn add react-native-element-inspector
# or
bun add react-native-element-inspector
```

### Peer dependencies

- `react >= 18.0.0`
- `react-native >= 0.72.0`

No native modules, no linking, no pod install. It's pure TypeScript.

## Quick start

Wrap your root component with `<ElementInspector>`:

```tsx
import { ElementInspector } from 'react-native-element-inspector';

const App = () => (
  <ElementInspector enabled={__DEV__}>
    <NavigationContainer>
      {/* your app */}
    </NavigationContainer>
  </ElementInspector>
);

export default App;
```

That's it. A floating bubble appears in dev mode. Tap it to enter inspect mode, then tap any element.

## Usage with Expo

Works out of the box with Expo - no config plugins or native code needed:

```tsx
import { ElementInspector } from 'react-native-element-inspector';

const App = () => (
  <ElementInspector enabled={__DEV__}>
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  </ElementInspector>
);

export default App;
```

## Usage with React Navigation

Wrap your entire navigation tree so every screen is inspectable:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { ElementInspector } from 'react-native-element-inspector';

const App = () => (
  <ElementInspector enabled={__DEV__}>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  </ElementInspector>
);
```

## API

### `<ElementInspector>`

The only component you need. Wrap your app with it.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable the inspector. Pass `__DEV__` to only enable in development |
| `children` | `ReactNode` | -| Your app content |

When `enabled` is `false`, the component renders only its children with zero overhead.

## How it works

1. **Fiber access** - uses `__REACT_DEVTOOLS_GLOBAL_HOOK__` to walk the React fiber tree and discover every host element
2. **Layout snapshots** - measures all elements and caches their positions for fast hit-testing (debounced rebuild on layout changes)
3. **Hit testing** - on tap, finds all elements at that point and sorts by area (smallest first)
4. **Style reading** - reads `fiber.memoizedProps.style` and resolves `StyleSheet` IDs to plain objects via `StyleSheet.flatten()`
5. **Live mutations** - applies style changes through `overrideProps()` on the fiber, which triggers React's reconciler to update the element

## Requirements

- React Native 0.72+
- React 18 or 19
- Development mode (`__DEV__`) recommended - the inspector reads from React internals that are available in dev builds

## License

MIT
