import { fireEvent, render } from '@testing-library/react-native';
import { Checkbox } from '@/components/Checkbox';

describe('Checkbox', () => {
  it('shows tick when checked', () => {
    const { getByText } = render(<Checkbox checked onToggle={jest.fn()} />);
    expect(getByText('✓')).toBeTruthy();
  });

  it('does not show tick when unchecked', () => {
    const { queryByText } = render(<Checkbox checked={false} onToggle={jest.fn()} />);
    expect(queryByText('✓')).toBeNull();
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const { getByText } = render(<Checkbox checked onToggle={onToggle} />);
    fireEvent.press(getByText('✓'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
