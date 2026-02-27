import { StyleSheet, Text, View } from 'react-native';
import { CloseButton } from './CloseButton';

interface HandleContentProps {
  onClose: () => void;
}

/** Floating handle shown in inspect mode before an element is selected. */
export const HandleContent = ({ onClose }: HandleContentProps) => (
  <View style={styles.handle}>
    <View style={styles.dot} />
    <Text style={styles.handleText}>Tap an element</Text>
    <CloseButton onPress={onClose} />
  </View>
);

const styles = StyleSheet.create({
  handle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0F3460',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.3)',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E94560',
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  handleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
