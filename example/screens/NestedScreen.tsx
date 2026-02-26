import { StyleSheet, Text, View } from 'react-native';

/** Deep nesting, style arrays, StyleSheet + inline mix — stress tests style resolution. */
export const NestedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Nesting</Text>
      <Text style={styles.subtitle}>Tests style resolution through deep component trees</Text>

      {/* Deep nesting */}
      <View style={styles.level1}>
        <Text style={styles.levelLabel}>Level 1</Text>
        <View style={styles.level2}>
          <Text style={styles.levelLabel}>Level 2</Text>
          <View style={styles.level3}>
            <Text style={styles.levelLabel}>Level 3</Text>
            <View style={styles.level4}>
              <Text style={styles.levelLabel}>Level 4</Text>
              <View style={styles.level5}>
                <Text style={styles.levelLabel}>Level 5 (deepest)</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Style arrays test */}
      <View style={[styles.arrayBase, styles.arrayOverride, { borderWidth: 2 }]}>
        <Text style={[styles.arrayTextBase, { fontWeight: 'bold' }]}>
          Style array: [base, override, inline]
        </Text>
      </View>

      {/* Mixed StyleSheet + inline */}
      <View style={styles.mixedContainer}>
        <View style={[styles.mixedChild, { transform: [{ rotate: '3deg' }] }]}>
          <Text style={{ color: '#FFF', fontSize: 12 }}>Rotated + mixed styles</Text>
        </View>
        <View style={[styles.mixedChild, { opacity: 0.6, backgroundColor: '#E06C75' }]}>
          <Text style={{ color: '#FFF', fontSize: 12 }}>Opacity override</Text>
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
  level1: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    borderWidth: 1,
    borderColor: '#E94560',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  level2: {
    backgroundColor: 'rgba(97, 175, 239, 0.15)',
    borderWidth: 1,
    borderColor: '#61AFEF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  level3: {
    backgroundColor: 'rgba(152, 195, 121, 0.15)',
    borderWidth: 1,
    borderColor: '#98C379',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  level4: {
    backgroundColor: 'rgba(198, 120, 221, 0.15)',
    borderWidth: 1,
    borderColor: '#C678DD',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  level5: {
    backgroundColor: 'rgba(209, 154, 102, 0.15)',
    borderWidth: 1,
    borderColor: '#D19A66',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  levelLabel: {
    color: '#CCC',
    fontSize: 12,
  },
  arrayBase: {
    backgroundColor: '#16213E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#333',
  },
  arrayOverride: {
    borderColor: '#61AFEF',
    borderRadius: 12,
  },
  arrayTextBase: {
    color: '#98C379',
    fontSize: 13,
  },
  mixedContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mixedChild: {
    flex: 1,
    backgroundColor: '#61AFEF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
});
