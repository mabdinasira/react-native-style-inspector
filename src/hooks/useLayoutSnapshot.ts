import { useCallback, useRef, useState } from 'react';
import { FiberAdapter } from '../fiber/FiberAdapter';
import type { MeasuredElement } from '../fiber/types';
import { buildLayoutSnapshot } from '../utils/layoutSnapshot';

/**
 * Builds and caches the layout snapshot when inspect mode is activated.
 * Invalidates on layout changes (debounced).
 */
export const useLayoutSnapshot = () => {
  const [snapshot, setSnapshot] = useState<MeasuredElement[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const invalidatedRef = useRef(false);

  const buildSnapshot = useCallback(async () => {
    const root = FiberAdapter.getFiberRoot();
    if (!root) return;

    setIsBuilding(true);
    try {
      const elements = await buildLayoutSnapshot(root);
      setSnapshot(elements);
    } finally {
      setIsBuilding(false);
    }
  }, []);

  const invalidate = useCallback(() => {
    invalidatedRef.current = true;
  }, []);

  /** Rebuild snapshot if it was invalidated, then return it. */
  const ensureFresh = useCallback(async () => {
    if (invalidatedRef.current || snapshot.length === 0) {
      invalidatedRef.current = false;
      await buildSnapshot();
    }
  }, [buildSnapshot, snapshot.length]);

  return { snapshot, isBuilding, buildSnapshot, invalidate, ensureFresh };
};
