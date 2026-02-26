import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/** Overlapping views, zIndex, position: absolute — tests hit-testing and element cycling. */
export const OverlapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overlapping Elements</Text>
      <Text style={styles.subtitle}>Tests hit-testing accuracy and element cycling (▲▼)</Text>

      {/* Stacked absolute elements */}
      <View style={styles.stackContainer}>
        <View style={[styles.stackBox, styles.stackBottom]}>
          <Text style={styles.stackLabel}>Bottom (z:1)</Text>
        </View>
        <View style={[styles.stackBox, styles.stackMiddle]}>
          <Text style={styles.stackLabel}>Middle (z:2)</Text>
        </View>
        <View style={[styles.stackBox, styles.stackTop]}>
          <Text style={styles.stackLabel}>Top (z:3)</Text>
        </View>
      </View>

      {/* Small button on top of large container */}
      <View style={styles.buttonTestContainer}>
        <Text style={styles.bgText}>Large background container</Text>
        <TouchableOpacity style={styles.smallButton}>
          <Text style={styles.buttonText}>Small Button</Text>
        </TouchableOpacity>
      </View>

      {/* Partially overlapping siblings */}
      <View style={styles.overlapRow}>
        <View style={[styles.overlapBox, { backgroundColor: '#E94560', left: 0 }]}>
          <Text style={styles.overlapLabel}>A</Text>
        </View>
        <View style={[styles.overlapBox, { backgroundColor: '#61AFEF', left: 60 }]}>
          <Text style={styles.overlapLabel}>B</Text>
        </View>
        <View style={[styles.overlapBox, { backgroundColor: '#98C379', left: 120 }]}>
          <Text style={styles.overlapLabel}>C</Text>
        </View>
      </View>

      {/* Nested full-width elements (depth test) */}
      <View style={styles.depthOuter}>
        <View style={styles.depthMiddle}>
          <View style={styles.depthInner}>
            <Text style={{ color: '#FFF', fontSize: 11 }}>
              3 layers deep — inspector should select innermost first
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  stackContainer: {
    height: 150,
    marginBottom: 24,
    position: 'relative',
  },
  stackBox: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackBottom: {
    backgroundColor: '#E94560',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  stackMiddle: {
    backgroundColor: '#61AFEF',
    top: 20,
    left: 40,
    zIndex: 2,
  },
  stackTop: {
    backgroundColor: '#98C379',
    top: 40,
    left: 80,
    zIndex: 3,
  },
  stackLabel: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  buttonTestContainer: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  bgText: {
    color: '#555',
    fontSize: 14,
  },
  smallButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#E94560',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  overlapRow: {
    height: 100,
    marginBottom: 24,
    position: 'relative',
  },
  overlapBox: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
  },
  overlapLabel: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  depthOuter: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  depthMiddle: {
    backgroundColor: 'rgba(97, 175, 239, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  depthInner: {
    backgroundColor: 'rgba(152, 195, 121, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
});
