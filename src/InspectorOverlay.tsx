import type { ReactNode } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Z_INDEX } from './constants/ui';
import { ElementCycler } from './ElementCycler';
import { ElementHighlighter } from './ElementHighlighter';
import { useLayoutSnapshot } from './hooks/useLayoutSnapshot';
import { useTapToSelect } from './hooks/useTapToSelect';
import { StylePanel } from './StylePanel';

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
  const { snapshot, buildSnapshot } = useLayoutSnapshot();
  const { selected, matches, selectedIndex, handleTap, cycleNext, cyclePrevious, clearSelection } =
    useTapToSelect(snapshot);

  if (!enabled) {
    return <>{children}</>;
  }

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

  return (
    <View style={styles.container}>
      {children}

      {/* Transparent tap-capture overlay — only active in inspect mode */}
      {isInspecting && (
        <View
          style={styles.tapOverlay}
          onStartShouldSetResponder={() => true}
          onResponderRelease={handleTap}
        />
      )}

      {/* Highlight overlay — margin/padding/content visualization */}
      {isInspecting && <ElementHighlighter element={selected} />}

      {/* Element cycling controls — visible when multiple elements overlap */}
      {isInspecting && selected && (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>{selected.componentName}</Text>
          <ElementCycler
            total={matches.length}
            currentIndex={selectedIndex}
            componentName={selected.componentName}
            onPrevious={cyclePrevious}
            onNext={cycleNext}
          />
        </View>
      )}

      {/* Style property panel — anchored to bottom */}
      {isInspecting && <StylePanel element={selected} />}

      {/* Floating inspect toggle button */}
      <TouchableOpacity
        style={[styles.fab, isInspecting && styles.fabActive]}
        onPress={toggleInspect}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>{isInspecting ? '✕' : '⊙'}</Text>
      </TouchableOpacity>
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
  infoBar: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 33, 62, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: Z_INDEX.INFO_BAR,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 160,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F3460',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: Z_INDEX.FAB,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabActive: {
    backgroundColor: '#E94560',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
