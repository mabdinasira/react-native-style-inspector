import { ScrollView, StyleSheet, Text, View } from 'react-native';

/** 500+ views — performance testing for snapshot build time. */
export const StressScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stress Test</Text>
      <Text style={styles.subtitle}>500+ elements — snapshot build must stay under 16ms</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {STRESS_CELLS.map((cell) => (
          <View
            key={cell.id}
            style={[
              styles.cell,
              {
                backgroundColor: cell.color,
                width: cell.size,
                height: cell.size,
              },
            ]}
          >
            <Text style={styles.cellText}>{cell.index}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const SIZES = [32, 40, 48, 36, 44];

const STRESS_CELLS = Array.from({ length: 500 }, (_, index) => ({
  id: `cell-${index}-${SIZES[index % SIZES.length]}`,
  index,
  color: `hsl(${(index * 7) % 360}, 60%, 50%)`,
  size: SIZES[index % SIZES.length],
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    gap: 4,
  },
  cell: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '600',
  },
});
