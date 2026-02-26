import { useCallback, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { MeasuredElement } from '../fiber/types';
import { hitTest } from '../utils/hitTest';

interface TapToSelectState {
  /** All overlapping elements at the tap point, sorted by area (smallest first) */
  matches: MeasuredElement[];
  /** Currently selected index in the matches array */
  selectedIndex: number;
  /** The currently selected element */
  selected: MeasuredElement | null;
}

/**
 * Handles tap-to-select interaction.
 * On tap, hit-tests the snapshot and selects the most specific element.
 * Supports cycling through overlapping elements.
 */
export const useTapToSelect = (snapshot: MeasuredElement[]) => {
  const [state, setState] = useState<TapToSelectState>({
    matches: [],
    selectedIndex: 0,
    selected: null,
  });

  const handleTap = useCallback(
    (event: GestureResponderEvent) => {
      const { pageX, pageY } = event.nativeEvent;
      const matches = hitTest(snapshot, pageX, pageY);

      setState({
        matches,
        selectedIndex: 0,
        selected: matches[0] ?? null,
      });
    },
    [snapshot],
  );

  const cycleNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = (prev.selectedIndex + 1) % prev.matches.length;
      return {
        ...prev,
        selectedIndex: nextIndex,
        selected: prev.matches[nextIndex] ?? null,
      };
    });
  }, []);

  const cyclePrevious = useCallback(() => {
    setState((prev) => {
      const prevIndex = (prev.selectedIndex - 1 + prev.matches.length) % prev.matches.length;
      return {
        ...prev,
        selectedIndex: prevIndex,
        selected: prev.matches[prevIndex] ?? null,
      };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setState({ matches: [], selectedIndex: 0, selected: null });
  }, []);

  return {
    ...state,
    handleTap,
    cycleNext,
    cyclePrevious,
    clearSelection,
  };
};
