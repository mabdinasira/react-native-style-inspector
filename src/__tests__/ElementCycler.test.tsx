import { act, create } from 'react-test-renderer';
import { ElementCycler } from '@/ElementCycler';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const render = (element: React.ReactElement) => {
  let root: ReturnType<typeof create> | undefined;
  act(() => {
    root = create(element);
  });
  return root as ReturnType<typeof create>;
};

describe('ElementCycler', () => {
  it('returns null when total is 1 or less', () => {
    const tree = render(
      <ElementCycler
        total={1}
        currentIndex={0}
        componentName='View'
        onPrevious={jest.fn()}
        onNext={jest.fn()}
      />,
    );
    expect(tree.toJSON()).toBeNull();
  });

  it('renders cycling label when total > 1', () => {
    const tree = render(
      <ElementCycler
        total={3}
        currentIndex={1}
        componentName='Text'
        onPrevious={jest.fn()}
        onNext={jest.fn()}
      />,
    );
    // React splits JSX expressions into separate children, so check for each part
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Text');
    expect(json).toContain('2');
    expect(json).toContain('3');
  });

  it('calls onPrevious when up arrow is pressed', () => {
    const onPrevious = jest.fn();
    const tree = render(
      <ElementCycler
        total={3}
        currentIndex={1}
        componentName='View'
        onPrevious={onPrevious}
        onNext={jest.fn()}
      />,
    );
    const buttons = tree.root.findAllByType('TouchableOpacity' as any);
    buttons[0].props.onPress();
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when down arrow is pressed', () => {
    const onNext = jest.fn();
    const tree = render(
      <ElementCycler
        total={3}
        currentIndex={1}
        componentName='View'
        onPrevious={jest.fn()}
        onNext={onNext}
      />,
    );
    const buttons = tree.root.findAllByType('TouchableOpacity' as any);
    buttons[1].props.onPress();
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
