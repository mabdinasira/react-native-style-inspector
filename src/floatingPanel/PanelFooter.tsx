import { StyleSheet, Text, View } from 'react-native';
import { MONOSPACE_FONT } from '../constants';

interface PanelFooterProps {
  propertyCount: number;
  width: number;
  height: number;
}

/** Expanded panel footer — property count, element dimensions, with top divider. */
export const PanelFooter = ({ propertyCount, width, height }: PanelFooterProps) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
    </Text>
    <Text style={styles.footerText}>
      {Math.round(width)} × {Math.round(height)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#444',
  },
  footerText: {
    color: '#666',
    fontSize: 11,
    fontFamily: MONOSPACE_FONT,
  },
});
