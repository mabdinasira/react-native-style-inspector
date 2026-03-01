import { act, create } from 'react-test-renderer';
import { ElementInspector } from '@/ElementInspector';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@/hooks', () => ({
  useDebouncedCallback: (callback: (...args: unknown[]) => void) => callback,
  useLayoutSnapshot: () => ({
    snapshot: [],
    buildSnapshot: jest.fn().mockResolvedValue(0),
  }),
  useTapToSelect: () => ({
    selected: null,
    matches: [],
    selectedIndex: 0,
    handleTap: jest.fn(),
    cycleNext: jest.fn(),
    cyclePrevious: jest.fn(),
    clearSelection: jest.fn(),
  }),
}));

jest.mock('@/ElementHighlighter', () => ({
  ElementHighlighter: () => null,
}));

jest.mock('@/floatingPanel', () => ({
  FloatingPanel: () => null,
}));

const render = (element: React.ReactElement) => {
  let root: ReturnType<typeof create> | undefined;
  act(() => {
    root = create(element);
  });
  return root as ReturnType<typeof create>;
};

describe('ElementInspector', () => {
  it('renders children when disabled', () => {
    const tree = render(
      <ElementInspector enabled={false}>
        <div>Hello World</div>
      </ElementInspector>,
    );
    expect(JSON.stringify(tree.toJSON())).toContain('Hello World');
  });

  it('renders children when enabled', () => {
    const tree = render(
      <ElementInspector enabled>
        <div>Hello World</div>
      </ElementInspector>,
    );
    expect(JSON.stringify(tree.toJSON())).toContain('Hello World');
  });

  it('defaults enabled to false (renders only children)', () => {
    const tree = render(
      <ElementInspector>
        <div>Child</div>
      </ElementInspector>,
    );
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Child');
    expect(json).not.toContain('View');
  });

  it('wraps children in a View when enabled', () => {
    const tree = render(
      <ElementInspector enabled>
        <div>Content</div>
      </ElementInspector>,
    );
    const views = tree.root.findAllByType('View' as any);
    expect(views.length).toBeGreaterThan(0);
  });
});
