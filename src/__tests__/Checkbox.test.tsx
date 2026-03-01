import { act, create } from 'react-test-renderer';
import { Checkbox } from '@/components/Checkbox';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const render = (element: React.ReactElement) => {
  let root: ReturnType<typeof create> | undefined;
  act(() => {
    root = create(element);
  });
  return root as ReturnType<typeof create>;
};

describe('Checkbox', () => {
  it('shows tick when checked', () => {
    const tree = render(<Checkbox checked onToggle={jest.fn()} />);
    expect(JSON.stringify(tree.toJSON())).toContain('✓');
  });

  it('does not show tick when unchecked', () => {
    const tree = render(<Checkbox checked={false} onToggle={jest.fn()} />);
    expect(JSON.stringify(tree.toJSON())).not.toContain('✓');
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const tree = render(<Checkbox checked onToggle={onToggle} />);
    const pressable = tree.root.findByType('Pressable' as any);
    pressable.props.onPress();
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
