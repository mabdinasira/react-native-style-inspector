import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { act, renderHook } from './renderHook';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay', () => {
    let value = 'hello';
    const { result, rerender } = renderHook(() => useDebouncedValue(value, 300));

    value = 'world';
    rerender();
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('hello');
  });

  it('updates value after delay', () => {
    let value = 'hello';
    const { result, rerender } = renderHook(() => useDebouncedValue(value, 300));

    value = 'world';
    rerender();
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('world');
  });

  it('resets timer on rapid updates', () => {
    let value = 'a';
    const { result, rerender } = renderHook(() => useDebouncedValue(value, 300));

    value = 'b';
    rerender();
    act(() => {
      jest.advanceTimersByTime(200);
    });

    value = 'c';
    rerender();
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('c');
  });
});
