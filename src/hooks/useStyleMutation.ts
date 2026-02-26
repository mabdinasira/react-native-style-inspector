import { useCallback, useRef } from 'react';
import { FiberAdapter } from '../fiber/FiberAdapter';
import type { MeasuredElement } from '../fiber/types';

/**
 * Applies live style changes via overrideProps.
 * Tracks original styles for reset functionality.
 * Phase 2 — placeholder for now.
 */
export const useStyleMutation = (element: MeasuredElement | null) => {
  const originalStyleRef = useRef<Record<string, unknown> | null>(null);

  const mutateStyle = useCallback(
    (key: string, value: unknown) => {
      if (!element) return false;

      // Save original style on first mutation
      if (!originalStyleRef.current) {
        originalStyleRef.current = FiberAdapter.getStyle(element.fiber);
      }

      return FiberAdapter.overrideStyle(element.fiber, key, value);
    },
    [element],
  );

  const resetStyles = useCallback(() => {
    if (!(element && originalStyleRef.current)) return;

    // Re-apply all original style values
    for (const [key, value] of Object.entries(originalStyleRef.current)) {
      FiberAdapter.overrideStyle(element.fiber, key, value);
    }
    originalStyleRef.current = null;
  }, [element]);

  return { mutateStyle, resetStyles };
};
