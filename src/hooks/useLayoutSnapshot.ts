import { useCallback, useRef, useState } from 'react';
import { FiberAdapter, type MeasuredElement } from '../fiber';
import { buildLayoutSnapshot } from '../utils';
import { useDebouncedCallback } from './useDebouncedCallback';

/**
 * Builds and caches the layout snapshot when inspect mode is activated.
 * Call `buildSnapshot` on inspect-mode entry. Call `invalidate` after
 * style mutations — it debounces and rebuilds automatically.
 */
export const useLayoutSnapshot = () => {
  const [snapshot, setSnapshot] = useState<MeasuredElement[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const snapshotRef = useRef<MeasuredElement[]>([]);

  const buildSnapshot = useCallback(async (): Promise<number> => {
    const root = FiberAdapter.getFiberRoot();
    if (!root) return 0;

    setIsBuilding(true);
    try {
      const elements = await buildLayoutSnapshot(root);
      snapshotRef.current = elements;
      setSnapshot(elements);
      return elements.length;
    } finally {
      setIsBuilding(false);
    }
  }, []);

  /** Mark stale — debounced 300ms so rapid style edits don't rebuild every time. */
  const invalidate = useDebouncedCallback(buildSnapshot, 300);

  /** Rebuild only if the snapshot is empty (first time). */
  const ensureFresh = useCallback(async () => {
    if (snapshotRef.current.length === 0) {
      await buildSnapshot();
    }
  }, [buildSnapshot]);

  return { snapshot, isBuilding, buildSnapshot, invalidate, ensureFresh };
};
