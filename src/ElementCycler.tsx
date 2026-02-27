import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ElementCyclerProps {
  /** Total number of overlapping elements at the tap point */
  total: number;
  /** Currently selected index (0-based) */
  currentIndex: number;
  /** Name of the currently selected component */
  componentName: string;
  onPrevious: () => void;
  onNext: () => void;
}

/** UI for cycling through overlapping elements at a tap point. */
export const ElementCycler = ({
  total,
  currentIndex,
  componentName,
  onPrevious,
  onNext,
}: ElementCyclerProps) => {
  if (total <= 1) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious} style={styles.button} activeOpacity={0.6}>
        <Text style={styles.arrow}>▲</Text>
      </TouchableOpacity>

      <Text style={styles.label} numberOfLines={1}>
        {componentName} ({currentIndex + 1}/{total})
      </Text>

      <TouchableOpacity onPress={onNext} style={styles.button} activeOpacity={0.6}>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrow: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  label: {
    color: '#DDDDDD',
    fontSize: 13,
    fontWeight: '500',
    marginHorizontal: 4,
    flexShrink: 1,
  },
});
