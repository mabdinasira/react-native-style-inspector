import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CloseButtonProps {
  onPress: () => void;
}

/** Reusable red-tinted circular close button used across panel states. */
export const CloseButton = ({ onPress }: CloseButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    style={styles.button}
    activeOpacity={0.6}
  >
    <Text style={styles.text}>✕</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 14,
  },
});
