import { useMemo } from 'react';
import { FiberAdapter } from '../fiber/FiberAdapter';
import type { MeasuredElement } from '../fiber/types';

/**
 * Extracts display info from a selected fiber node.
 */
export const useFiberInfo = (element: MeasuredElement | null) => {
  return useMemo(() => {
    if (!element) {
      return {
        componentName: null,
        style: null,
        source: null,
      };
    }

    return {
      componentName: element.componentName,
      style: FiberAdapter.getStyle(element.fiber),
      source: FiberAdapter.getSource(element.fiber),
    };
  }, [element]);
};
