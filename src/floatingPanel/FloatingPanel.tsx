import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { FLOATING_PANEL, Z_INDEX } from '../constants';
import { useFloatingPanel } from '../hooks';
import { HandleContent } from './HandleContent';
import { InspectorBubble } from './InspectorBubble';
import { PanelBody } from './PanelBody';
import { PanelHeader } from './PanelHeader';
import type { FloatingPanelProps } from './types';

/**
 * Unified floating panel that renders as a bubble, handle, or expanded panel.
 * Draggable via PanResponder. Bubble/handle snap to edge; expanded floats freely.
 */
export const FloatingPanel = ({
  panelState,
  selected,
  matches,
  selectedIndex,
  onToggleInspect,
  onCycleNext,
  onCyclePrevious,
  onClose,
}: FloatingPanelProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const { position, expandProgress, panHandlers, panelSize } = useFloatingPanel({
    panelState,
    screenWidth,
    screenHeight,
    onTap: onToggleInspect,
  });

  const bodyHeight = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FLOATING_PANEL.PANEL_BODY_HEIGHT],
  });

  const bodyOpacity = expandProgress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x,
          top: position.y,
          width: panelSize.width,
          zIndex: Z_INDEX.FLOATING_PANEL,
        },
        panelState === 'bubble' && styles.bubbleContainer,
        panelState === 'handle' && styles.handleContainer,
      ]}
    >
      {/* Drag surface — the touchable/draggable area */}
      <View {...panHandlers}>
        {panelState === 'bubble' && <InspectorBubble />}
        {panelState === 'handle' && <HandleContent onClose={onClose} />}
        {panelState === 'expanded' && selected && (
          <PanelHeader
            selected={selected}
            matches={matches}
            selectedIndex={selectedIndex}
            onCycleNext={onCycleNext}
            onCyclePrevious={onCyclePrevious}
            onClose={onClose}
          />
        )}
      </View>

      {/* Expandable body — animated height/opacity */}
      {panelState === 'expanded' && selected && (
        <Animated.View style={[styles.body, { height: bodyHeight, opacity: bodyOpacity }]}>
          <PanelBody element={selected} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(30, 30, 30, 0.97)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  bubbleContainer: {
    borderRadius: FLOATING_PANEL.BUBBLE_SIZE / 2,
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'visible',
    shadowOpacity: 0,
    elevation: 0,
  },
  handleContainer: {
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  body: {
    overflow: 'hidden',
  },
});
