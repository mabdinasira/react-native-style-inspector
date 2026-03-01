import { fireEvent, render } from '@testing-library/react-native';
import { ElementCycler } from '@/ElementCycler';

describe('ElementCycler', () => {
  it('returns null when total is 1 or less', () => {
    const { toJSON } = render(
      <ElementCycler
        total={1}
        currentIndex={0}
        componentName='View'
        onPrevious={jest.fn()}
        onNext={jest.fn()}
      />,
    );
    expect(toJSON()).toBeNull();
  });

  it('renders cycling label when total > 1', () => {
    const { getByText } = render(
      <ElementCycler
        total={3}
        currentIndex={1}
        componentName='Text'
        onPrevious={jest.fn()}
        onNext={jest.fn()}
      />,
    );
    expect(getByText(/Text/)).toBeTruthy();
    expect(getByText(/2/)).toBeTruthy();
    expect(getByText(/3/)).toBeTruthy();
  });

  it('calls onPrevious when up arrow is pressed', () => {
    const onPrevious = jest.fn();
    const { getByText } = render(
      <ElementCycler
        total={3}
        currentIndex={1}
        componentName='View'
        onPrevious={onPrevious}
        onNext={jest.fn()}
      />,
    );
    fireEvent.press(getByText('▲'));
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when down arrow is pressed', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <ElementCycler
        total={3}
        currentIndex={1}
        componentName='View'
        onPrevious={jest.fn()}
        onNext={onNext}
      />,
    );
    fireEvent.press(getByText('▼'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
