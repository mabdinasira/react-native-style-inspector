import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FiberAdapter } from '../fiber/FiberAdapter';
import type { MeasuredElement } from '../fiber/types';
import { formatValue, isColorProp } from '../utils/styleFormatting';
import { PanelFooter } from './PanelFooter';

interface PanelBodyProps {
  element: MeasuredElement;
}

/** Scrollable style property list with footer — the main content of the expanded panel. */
export const PanelBody = ({ element }: PanelBodyProps) => {
  const style = FiberAdapter.getStyle(element.fiber);
  if (!style) return null;

  const entries = Object.entries(style);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled
      >
        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No styles applied</Text>
        ) : (
          entries.map(([key, value], index) => (
            <View key={key} style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
              <Text style={styles.propertyName}>{key}</Text>
              <View style={styles.valueContainer}>
                {isColorProp(key) && (
                  <View style={[styles.colorSwatch, { backgroundColor: String(value) }]} />
                )}
                <Text style={styles.propertyValue} numberOfLines={1}>
                  {formatValue(value)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <PanelFooter propertyCount={entries.length} width={element.width} height={element.height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  rowAlt: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  propertyName: {
    color: '#9CDCFE',
    fontSize: 13,
    fontFamily: 'Menlo',
    flexShrink: 0,
    marginRight: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  colorSwatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666',
    marginRight: 6,
  },
  propertyValue: {
    color: '#CE9178',
    fontSize: 13,
    fontFamily: 'Menlo',
    flexShrink: 1,
  },
  emptyText: {
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});
