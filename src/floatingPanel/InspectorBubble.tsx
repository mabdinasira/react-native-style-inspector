import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { INSPECTOR_BUBBLE } from '../constants';

const { SIZE: BUBBLE_SIZE, SWEEP_WIDTH, CENTER_DOT_SIZE, TRAIL_ARMS } = INSPECTOR_BUBBLE;

/**
 * Inspector bubble with a radar-sweep animation.
 * A bright orange line rotates around a dark orange circle with a fading trail.
 */
export const InspectorBubble = () => {
  const sweepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [sweepAnim]);

  return (
    <View style={styles.container}>
      {/* Clipping circle — contains all radar elements */}
      <View style={styles.clipCircle}>
        {/* Dark orange base fill */}
        <View style={styles.baseFill} />

        {/* Subtle grid ring at ~60% radius for radar feel */}
        <View style={styles.gridRing} />

        {/* Sweep line + fading trail arms */}
        {TRAIL_ARMS.map((arm) => {
          const rotation = sweepAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [`${arm.offsetDeg}deg`, `${360 + arm.offsetDeg}deg`],
          });

          return (
            <Animated.View
              key={arm.key}
              style={[
                styles.armWrapper,
                {
                  opacity: arm.opacity,
                  transform: [{ rotate: rotation }],
                },
              ]}
            >
              <View style={styles.sweepLine} />
            </Animated.View>
          );
        })}

        {/* Center dot */}
        <View style={styles.centerDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  clipCircle: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ea580c',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#7c2d12',
  },
  gridRing: {
    position: 'absolute',
    width: BUBBLE_SIZE * 0.55,
    height: BUBBLE_SIZE * 0.55,
    borderRadius: (BUBBLE_SIZE * 0.55) / 2,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.25)',
  },
  armWrapper: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    alignItems: 'center',
  },
  sweepLine: {
    width: SWEEP_WIDTH,
    height: BUBBLE_SIZE / 2 - CENTER_DOT_SIZE / 2 - 2,
    backgroundColor: '#fb923c',
    borderRadius: SWEEP_WIDTH / 2,
    marginTop: 3,
  },
  centerDot: {
    position: 'absolute',
    width: CENTER_DOT_SIZE,
    height: CENTER_DOT_SIZE,
    borderRadius: CENTER_DOT_SIZE / 2,
    backgroundColor: '#f97316',
  },
});
