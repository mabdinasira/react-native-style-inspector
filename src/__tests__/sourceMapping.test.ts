import type { FiberNode } from '@/fiber';
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

  it('returns null when no owner is found', () => {
    const fiber = makeFiber();
    expect(getOwnerName(fiber)).toBeNull();
  });
});
