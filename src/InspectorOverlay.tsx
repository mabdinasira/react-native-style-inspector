import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FLOATING_PANEL, Z_INDEX } from './constants/ui';
import { ElementHighlighter } from './ElementHighlighter';
import { FloatingPanel } from './floatingPanel/FloatingPanel';
import type { PanelState } from './floatingPanel/types';
import { useDebouncedCallback } from './hooks/useDebouncedCallback';
import { useLayoutSnapshot } from './hooks/useLayoutSnapshot';
import { useTapToSelect } from './hooks/useTapToSelect';

export interface StyleInspectorProps {
  /** Only enable in dev mode. Pass `__DEV__` here. */
  enabled?: boolean;
  children: ReactNode;
}

/**
 * Root wrapper component. Wrap your app root with this.
 * In production (enabled=false), renders children with zero overhead.
 */
export const StyleInspector = ({ enabled = false, children }: StyleInspectorProps) => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const { snapshot, buildSnapshot } = useLayoutSnapshot();
  const { selected, matches, selectedIndex, handleTap, cycleNext, cyclePrevious, clearSelection } =
    useTapToSelect(snapshot);

  const hideHighlight = useDebouncedCallback(
    () => setHighlightVisible(false),
    FLOATING_PANEL.HIGHLIGHT_FLASH_MS,
  );
  const flashHighlight = useCallback(() => {
    setHighlightVisible(true);
    hideHighlight();
  }, [hideHighlight]);

  if (!enabled) {
    return <>{children}</>;
  }

  // Derive panel state from inspector state
  const panelState: PanelState = isInspecting ? (selected ? 'expanded' : 'handle') : 'bubble';

  const toggleInspect = async () => {
    if (isInspecting) {
      setIsInspecting(false);
      clearSelection();
    } else {
      try {
        await buildSnapshot();
        setIsInspecting(true);
      } catch {
        // Snapshot failed (no fiber root, measure errors, etc.) — stay in normal mode
      }
    }
  };

  const handleClose = () => {
    if (selected) {
      // Expanded → handle (deselect element, stay in inspect mode)
      clearSelection();
    } else {
      // Handle → bubble (exit inspect mode)
      setIsInspecting(false);
    }
  };

  return (
    <View style={styles.container}>
      {children}

      {/* Transparent tap-capture overlay — only active in inspect mode */}
      {isInspecting && (
        <View
          style={styles.tapOverlay}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(event) => {
            handleTap(event);
            flashHighlight();
          }}
        />
      )}

      {/* Persistent outline — always visible while element is selected */}
      {isInspecting && selected && <ElementHighlighter element={selected} outlineOnly />}

      {/* Full box model highlight — flashes on select/cycle, then auto-hides */}
      {highlightVisible && <ElementHighlighter element={selected} />}

      {/* Floating panel — bubble / handle / expanded */}
      <FloatingPanel
        panelState={panelState}
        selected={selected}
        matches={matches}
        selectedIndex={selectedIndex}
        onToggleInspect={toggleInspect}
        onCycleNext={() => {
          cycleNext();
          flashHighlight();
        }}
        onCyclePrevious={() => {
          cyclePrevious();
          flashHighlight();
        }}
        onClose={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: Z_INDEX.TAP_OVERLAY,
  },
});
