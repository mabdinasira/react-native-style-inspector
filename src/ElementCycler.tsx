import { Text, TouchableOpacity, View } from 'react-native';

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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D2D2D',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <TouchableOpacity onPress={onPrevious} hitSlop={8}>
        <Text style={{ color: '#CCC', fontSize: 14 }}>▲</Text>
      </TouchableOpacity>
      <Text style={{ color: '#CCC', fontSize: 12, marginHorizontal: 8 }}>
        {componentName} ({currentIndex + 1}/{total})
      </Text>
      <TouchableOpacity onPress={onNext} hitSlop={8}>
        <Text style={{ color: '#CCC', fontSize: 14 }}>▼</Text>
      </TouchableOpacity>
    </View>
  );
};
