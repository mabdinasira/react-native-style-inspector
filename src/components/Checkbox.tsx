import { Pressable, StyleSheet, Text, View } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export const Checkbox = ({ checked, onToggle }: CheckboxProps) => (
  <Pressable onPress={onToggle} hitSlop={6} style={styles.pressable}>
    <View style={[styles.box, checked && styles.checked]}>
      {checked && <Text style={styles.tick}>✓</Text>}
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  box: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#4FC3F7',
    borderColor: '#4FC3F7',
  },
  tick: {
    fontSize: 9,
    lineHeight: 11,
    color: '#fff',
    fontWeight: '700',
  },
});
