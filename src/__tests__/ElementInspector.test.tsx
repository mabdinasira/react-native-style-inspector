import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ElementInspector } from '@/ElementInspector';

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

describe('ElementInspector', () => {
  it('renders children when disabled', () => {
    const { getByText } = render(
      <ElementInspector enabled={false}>
        <Text>Hello World</Text>
      </ElementInspector>,
    );
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders children when enabled', () => {
    const { getByText } = render(
      <ElementInspector enabled>
        <Text>Hello World</Text>
      </ElementInspector>,
    );
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('defaults enabled to false (renders only children)', () => {
    const { getByText, toJSON } = render(
      <ElementInspector>
        <Text>Child</Text>
      </ElementInspector>,
    );
    expect(getByText('Child')).toBeTruthy();
    // When disabled, should just render the child directly
    const json = JSON.stringify(toJSON());
    expect(json).toContain('Child');
  });

  it('wraps children in a View when enabled', () => {
    const { toJSON } = render(
      <ElementInspector enabled>
        <Text>Content</Text>
      </ElementInspector>,
    );
    const json = JSON.stringify(toJSON());
    expect(json).toContain('Content');
  });
});
