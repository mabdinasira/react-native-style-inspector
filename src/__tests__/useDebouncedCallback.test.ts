import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { act, renderHook } from './renderHook';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not call callback immediately', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current('test');
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it('calls callback after delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current('test');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(callback).toHaveBeenCalledWith('test');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('only calls callback once for rapid invocations', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current('a');
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    act(() => {
      result.current('b');
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    act(() => {
      result.current('c');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('c');
  });

  it('returns a stable function reference', () => {
    const { result, rerender } = renderHook(() => useDebouncedCallback(jest.fn(), 300));
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });
});
