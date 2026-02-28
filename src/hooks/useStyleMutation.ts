import { useCallback, useMemo } from 'react';
import { FiberAdapter, type MeasuredElement } from '../fiber';
import { flattenStyles } from '../utils';

/**
 * Captures the original flattened style for an element and provides
 * a function to replace the element's entire style via overrideProps.
 *
 * All override/disabled tracking belongs in the consuming component —
 * this hook only handles fiber interaction.
 */
export const useStyleMutation = (element: MeasuredElement) => {
  const originalStyle = useMemo(() => {
    const flat = flattenStyles(element.fiber.memoizedProps?.style);
    return flat ? structuredClone(flat) : {};
  }, [element]);

  /** Replace the element's entire style with a flat object. */
  const applyStyle = useCallback(
    (style: Record<string, unknown>) => FiberAdapter.setStyle(element.fiber, style),
    [element],
  );

  /** Restore the element's original style. */
  const resetStyle = useCallback(
    () => FiberAdapter.setStyle(element.fiber, originalStyle),
    [element, originalStyle],
  );

  return { originalStyle, applyStyle, resetStyle };
};
