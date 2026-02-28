import { useCallback, useRef } from 'react';

export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): ((...args: Args) => void) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    (...args: Args) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );
};
