import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { FLOATING_PANEL } from '../constants/ui';
import { getPanelSize } from '../floatingPanel/panelUtils';
import type { FloatingPanelConfig } from '../floatingPanel/types';
import { clamp } from '../utils/clamp';

/**
 * Core animation/gesture hook for the floating inspector panel.
 * Owns Animated.ValueXY for position, PanResponder for drag,
 * and Animated.Value for expand/collapse transitions.
 */
export const useFloatingPanel = ({
  panelState,
  screenWidth,
  screenHeight,
  onTap,
}: FloatingPanelConfig) => {
  // Mutable refs so PanResponder callbacks never capture stale values
  const panelStateRef = useRef(panelState);
  panelStateRef.current = panelState;

  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;

  const screenRef = useRef({ width: screenWidth, height: screenHeight });
  screenRef.current = { width: screenWidth, height: screenHeight };

  // Initial position: middle-left edge
  const initialX = FLOATING_PANEL.EDGE_MARGIN;
  const initialY = (screenHeight - FLOATING_PANEL.BUBBLE_SIZE) / 2;

  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const expandProgress = useRef(new Animated.Value(0)).current;

  // Track raw position for synchronous reads (Animated.Value doesn't expose current value)
  const currentPosition = useRef<{ x: number; y: number }>({ x: initialX, y: initialY });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const panelSize = useMemo(() => getPanelSize(panelState), [panelState]);
  const panelSizeRef = useRef(panelSize);
  panelSizeRef.current = panelSize;

  // Snap to nearest left/right edge with spring animation
  const snapToEdge = useCallback(() => {
    const { width } = screenRef.current;
    const size = panelSizeRef.current;
    const midpoint = width / 2;
    const centerX = currentPosition.current.x + size.width / 2;

    const targetX =
      centerX < midpoint
        ? FLOATING_PANEL.EDGE_MARGIN
        : width - size.width - FLOATING_PANEL.EDGE_MARGIN;

    currentPosition.current.x = targetX;

    Animated.spring(position.x, {
      toValue: targetX,
      friction: FLOATING_PANEL.SNAP_FRICTION,
      tension: FLOATING_PANEL.SNAP_TENSION,
      useNativeDriver: false,
    }).start();
  }, [position.x]);

  // PanResponder — recreated when screen dimensions change
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > FLOATING_PANEL.TAP_THRESHOLD ||
          Math.abs(gesture.dy) > FLOATING_PANEL.TAP_THRESHOLD,

        onPanResponderGrant: () => {
          isDragging.current = false;
          dragStart.current = { ...currentPosition.current };
        },

        onPanResponderMove: (_, gesture) => {
          const movedEnough =
            Math.abs(gesture.dx) > FLOATING_PANEL.TAP_THRESHOLD ||
            Math.abs(gesture.dy) > FLOATING_PANEL.TAP_THRESHOLD;

          if (movedEnough) {
            isDragging.current = true;
          }

          if (!isDragging.current) return;

          const { width: screenW, height: screenH } = screenRef.current;
          const size = panelSizeRef.current;

          const newX = clamp(
            dragStart.current.x + gesture.dx,
            FLOATING_PANEL.EDGE_MARGIN,
            screenW - size.width - FLOATING_PANEL.EDGE_MARGIN,
          );
          const newY = clamp(
            dragStart.current.y + gesture.dy,
            FLOATING_PANEL.TOP_SAFE_AREA,
            screenH - size.height - FLOATING_PANEL.BOTTOM_SAFE_AREA,
          );

          position.setValue({ x: newX, y: newY });
          currentPosition.current = { x: newX, y: newY };
        },

        onPanResponderRelease: () => {
          if (!isDragging.current) {
            onTapRef.current();
            return;
          }

          // Bubble and handle snap to edge; expanded stays where dropped
          if (panelStateRef.current !== 'expanded') {
            snapToEdge();
          }
        },
      }),
    [position, snapToEdge],
  );

  // Animate expand/collapse when panelState changes
  useEffect(() => {
    Animated.timing(expandProgress, {
      toValue: panelState === 'expanded' ? 1 : 0,
      duration: FLOATING_PANEL.EXPAND_DURATION,
      useNativeDriver: false,
    }).start();
  }, [panelState, expandProgress]);

  // Reposition panel on state change so the new size stays on-screen.
  // Bubble/handle: instantly snap to nearest edge.
  // Expanded: spring-animate into screen bounds.
  useEffect(() => {
    const { x, y } = currentPosition.current;
    const size = getPanelSize(panelState);

    if (panelState === 'expanded') {
      const targetX = clamp(
        x,
        FLOATING_PANEL.EDGE_MARGIN,
        screenWidth - size.width - FLOATING_PANEL.EDGE_MARGIN,
      );
      const targetY = clamp(
        y,
        FLOATING_PANEL.TOP_SAFE_AREA,
        screenHeight - size.height - FLOATING_PANEL.BOTTOM_SAFE_AREA,
      );

      if (targetX !== x || targetY !== y) {
        currentPosition.current = { x: targetX, y: targetY };
        Animated.spring(position, {
          toValue: { x: targetX, y: targetY },
          friction: FLOATING_PANEL.SNAP_FRICTION,
          tension: FLOATING_PANEL.SNAP_TENSION,
          useNativeDriver: false,
        }).start();
      }
    } else {
      // Bubble / handle — snap instantly to nearest edge (no animation needed,
      // the panel content swap already provides the visual transition)
      const midpoint = screenWidth / 2;
      const centerX = x + size.width / 2;

      const targetX =
        centerX < midpoint
          ? FLOATING_PANEL.EDGE_MARGIN
          : screenWidth - size.width - FLOATING_PANEL.EDGE_MARGIN;
      const targetY = clamp(
        y,
        FLOATING_PANEL.TOP_SAFE_AREA,
        screenHeight - size.height - FLOATING_PANEL.BOTTOM_SAFE_AREA,
      );

      if (targetX !== x || targetY !== y) {
        currentPosition.current = { x: targetX, y: targetY };
        position.setValue({ x: targetX, y: targetY });
      }
    }
  }, [panelState, screenWidth, screenHeight, position]);

  return {
    position,
    expandProgress,
    panHandlers: panResponder.panHandlers,
    panelSize,
  };
};
