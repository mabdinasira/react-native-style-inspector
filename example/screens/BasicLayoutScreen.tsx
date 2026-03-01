import { StyleSheet, Text, View } from 'react-native';

/** Simple views, text, images — verifies basic style reading and highlighting. */
export const BasicLayoutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Layout</Text>
      <Text style={styles.subtitle}>Tap any element to inspect it</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Card Title</Text>
            <Text style={styles.cardSubtitle}>Subtitle text</Text>
          </View>
        </View>
        <Text style={styles.cardBody}>
          This is a card component with multiple nested elements. Each element should be
          individually selectable.
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: '#E06C75' }]}>
          <Text style={styles.boxText}>Red</Text>
        </View>
        <View style={[styles.box, { backgroundColor: '#98C379' }]}>
          <Text style={styles.boxText}>Green</Text>
        </View>
        <View style={[styles.box, { backgroundColor: '#61AFEF' }]}>
          <Text style={styles.boxText}>Blue</Text>
        </View>
      </View>

      <View style={styles.inlineStyleDemo}>
        <Text style={{ color: '#C678DD', fontSize: 14, fontWeight: 'bold' }}>
          Inline styles (no StyleSheet)
        </Text>
      </View>

      <View style={styles.transformCard}>
        <Text style={styles.transformLabel}>Transform test</Text>
        <View style={styles.transformRow}>
          <View style={styles.rotatedBox}>
            <Text style={styles.boxText}>Rotate</Text>
          </View>
          <View style={styles.scaledBox}>
            <Text style={styles.boxText}>Scale</Text>
          </View>
          <View style={styles.skewedBox}>
            <Text style={styles.boxText}>Multi</Text>
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
  card: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E94560',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  cardBody: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  box: {
    flex: 1,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: '#FFF',
    fontWeight: '600',
  },
  inlineStyleDemo: {
    padding: 12,
    backgroundColor: '#16213E',
    borderRadius: 8,
  },
  transformCard: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  transformLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  transformRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  rotatedBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#C678DD',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '15deg' }],
  },
  scaledBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#E5C07B',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 0.85 }],
  },
  skewedBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#56B6C2',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-5deg' }, { scale: 1.1 }, { perspective: 800 }],
  },
});
