import { createElement, type PropsWithChildren } from 'react';

const createMockComponent = (name: string) => {
  const Component = ({ children, ...props }: PropsWithChildren<Record<string, unknown>>) =>
    createElement(name, props, children);
  Component.displayName = name;
  return Component;
};

export const View = createMockComponent('View');
export const Text = createMockComponent('Text');
export const Pressable = createMockComponent('Pressable');
export const TouchableOpacity = createMockComponent('TouchableOpacity');

export const Animated = {
  Value: class {
    constructor(public _value: number) {}
  },
  View: createMockComponent('Animated.View'),
  event: jest.fn(),
  timing: jest.fn(() => ({ start: jest.fn() })),
};

export const Platform = {
  OS: 'ios',
  select: <T>(options: { ios?: T; android?: T; default?: T }) => options.ios ?? options.default,
};

export const Dimensions = {
  get: () => ({ width: 375, height: 812 }),
};

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown) => {
    if (!style) return undefined;
    if (Array.isArray(style)) return Object.assign({}, ...style);
    return style;
  },
  absoluteFillObject: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};
