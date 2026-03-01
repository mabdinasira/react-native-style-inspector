import { FiberAdapter, type FiberNode } from '@/fiber';
import { formatSourceLocation, getOwnerName, getSourceLocation } from '@/utils/sourceMapping';

const makeFiber = (overrides: Partial<FiberNode> = {}): FiberNode => ({
  tag: 5,
  type: 'View',
  memoizedProps: {},
  stateNode: null,
  child: null,
  sibling: null,
  return: null,
  ...overrides,
});

describe('getSourceLocation', () => {
  it('returns _debugSource from the fiber itself', () => {
    const fiber = makeFiber({
      _debugSource: { fileName: '/app/MyComponent.tsx', lineNumber: 42 },
    });
    expect(getSourceLocation(fiber)).toEqual({ fileName: '/app/MyComponent.tsx', lineNumber: 42 });
  });

  it('falls back to _debugOwner._debugSource', () => {
    const owner = makeFiber({
      _debugSource: { fileName: '/app/Owner.tsx', lineNumber: 10 },
    });
    const fiber = makeFiber({ _debugOwner: owner });
    expect(getSourceLocation(fiber)).toEqual({ fileName: '/app/Owner.tsx', lineNumber: 10 });
  });

  it('walks up the return chain as a fallback', () => {
    const grandparent = makeFiber({
      _debugSource: { fileName: '/app/Root.tsx', lineNumber: 5 },
    });
    const parent = makeFiber({ return: grandparent });
    const fiber = makeFiber({ return: parent });
    expect(getSourceLocation(fiber)).toEqual({ fileName: '/app/Root.tsx', lineNumber: 5 });
  });

  it('returns null when no source is found', () => {
    const fiber = makeFiber();
    expect(getSourceLocation(fiber)).toBeNull();
  });
});

describe('formatSourceLocation', () => {
  it('strips the path and shows filename:lineNumber', () => {
    expect(formatSourceLocation({ fileName: '/app/src/MyComponent.tsx', lineNumber: 42 })).toBe(
      'MyComponent.tsx:42',
    );
  });

  it('handles filenames without path separators', () => {
    expect(formatSourceLocation({ fileName: 'App.tsx', lineNumber: 1 })).toBe('App.tsx:1');
  });
});

describe('getOwnerName', () => {
  it('returns owner component name', () => {
    const ownerType = () => null;
    ownerType.displayName = 'MyScreen';
    const owner = makeFiber({ type: ownerType });
    const fiber = makeFiber({ _debugOwner: owner });
    expect(getOwnerName(fiber)).toBe('in MyScreen');
  });

  it('skips generic RN wrapper names', () => {
    const viewType = () => null;
    viewType.displayName = 'View';
    const realType = () => null;
    realType.displayName = 'CardComponent';

    const realOwner = makeFiber({ type: realType });
    const viewOwner = makeFiber({ type: viewType, _debugOwner: realOwner });
    const fiber = makeFiber({ _debugOwner: viewOwner });
    expect(getOwnerName(fiber)).toBe('in CardComponent');
  });

  it('skips CssInterop wrapper names', () => {
    const interopType = () => null;
    interopType.displayName = 'CssInterop.View';
    const screenType = () => null;
    screenType.displayName = 'SearchScreen';

    const screenOwner = makeFiber({ type: screenType });
    const interopOwner = makeFiber({ type: interopType, _debugOwner: screenOwner });
    const fiber = makeFiber({ _debugOwner: interopOwner });
    expect(getOwnerName(fiber)).toBe('in SearchScreen');
  });

  it('skips NativeWind wrapper names', () => {
    const nativeWindType = () => null;
    nativeWindType.displayName = 'NativeWind.StyledView';
    const appType = () => null;
    appType.displayName = 'ProfileScreen';

    const appOwner = makeFiber({ type: appType });
    const nwOwner = makeFiber({ type: nativeWindType, _debugOwner: appOwner });
    const fiber = makeFiber({ _debugOwner: nwOwner });
    expect(getOwnerName(fiber)).toBe('in ProfileScreen');
  });

  it('skips RCT-prefixed names', () => {
    const rctType = () => null;
    rctType.displayName = 'RCTView';
    const userType = () => null;
    userType.displayName = 'HomeScreen';

    const userOwner = makeFiber({ type: userType });
    const rctOwner = makeFiber({ type: rctType, _debugOwner: userOwner });
    const fiber = makeFiber({ _debugOwner: rctOwner });
    expect(getOwnerName(fiber)).toBe('in HomeScreen');
  });

  it('skips multiple wrapper layers to find user component', () => {
    const textType = () => null;
    textType.displayName = 'Text';
    const interopType = () => null;
    interopType.displayName = 'CssInterop.Text';
    const scrollType = () => null;
    scrollType.displayName = 'ScrollView';
    const screenType = () => null;
    screenType.displayName = 'SettingsScreen';

    const screenOwner = makeFiber({ type: screenType });
    const scrollOwner = makeFiber({ type: scrollType, _debugOwner: screenOwner });
    const interopOwner = makeFiber({ type: interopType, _debugOwner: scrollOwner });
    const textOwner = makeFiber({ type: textType, _debugOwner: interopOwner });
    const fiber = makeFiber({ _debugOwner: textOwner });
    expect(getOwnerName(fiber)).toBe('in SettingsScreen');
  });

  it('returns null when no owner is found', () => {
    const fiber = makeFiber();
    expect(getOwnerName(fiber)).toBeNull();
  });

  it('returns null when only wrapper owners exist', () => {
    const viewType = () => null;
    viewType.displayName = 'View';
    const interopType = () => null;
    interopType.displayName = 'CssInterop.View';

    const interopOwner = makeFiber({ type: interopType });
    const viewOwner = makeFiber({ type: viewType, _debugOwner: interopOwner });
    const fiber = makeFiber({ _debugOwner: viewOwner });
    expect(getOwnerName(fiber)).toBeNull();
  });
});

describe('getComponentName', () => {
  it('strips RCT prefix from native host types', () => {
    expect(FiberAdapter.getComponentName(makeFiber({ type: 'RCTView' }))).toBe('View');
    expect(FiberAdapter.getComponentName(makeFiber({ type: 'RCTText' }))).toBe('Text');
    expect(FiberAdapter.getComponentName(makeFiber({ type: 'RCTScrollView' }))).toBe('ScrollView');
  });

  it('returns non-RCT string types as-is', () => {
    expect(FiberAdapter.getComponentName(makeFiber({ type: 'View' }))).toBe('View');
    expect(FiberAdapter.getComponentName(makeFiber({ type: 'TextInput' }))).toBe('TextInput');
  });

  it('returns displayName for function components', () => {
    const componentType = () => null;
    componentType.displayName = 'MyButton';
    expect(FiberAdapter.getComponentName(makeFiber({ type: componentType }))).toBe('MyButton');
  });

  it('falls back to function name when no displayName', () => {
    const namedComponent = () => null;
    Object.defineProperty(namedComponent, 'name', { value: 'ProfileCard' });
    expect(FiberAdapter.getComponentName(makeFiber({ type: namedComponent }))).toBe('ProfileCard');
  });

  it('returns Unknown for anonymous functions', () => {
    const anonymous = () => null;
    Object.defineProperty(anonymous, 'name', { value: '' });
    expect(FiberAdapter.getComponentName(makeFiber({ type: anonymous }))).toBe('Unknown');
  });
});
