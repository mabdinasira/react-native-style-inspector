import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import { BoxModelDiagram } from './BoxModelDiagram';
import { Z_INDEX } from './constants/ui';
import { FiberAdapter } from './fiber/FiberAdapter';
import type { MeasuredElement } from './fiber/types';
import { formatSourceLocation, getOwnerName, getSourceLocation } from './utils/sourceMapping';
import { formatValue, isColorProp } from './utils/styleFormatting';

interface StylePanelProps {
  element: MeasuredElement | null;
}

/** Scrollable panel showing the flattened style properties of the selected element. */
export const StylePanel = ({ element }: StylePanelProps) => {
  if (!element) return null;

  const style = FiberAdapter.getStyle(element.fiber);
  if (!style) return null;

  const source = getSourceLocation(element.fiber);
  const entries = Object.entries(style);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.componentName}>&lt;{element.componentName}&gt;</Text>
        {source ? (
          <Text style={styles.sourceText} numberOfLines={1}>
            {formatSourceLocation(source)}
          </Text>
        ) : (
          <Text style={styles.sourceText} numberOfLines={1}>
            {getOwnerName(element.fiber)}
          </Text>
        )}
      </View>

      {/* Box model visualization */}
      {/* <BoxModelDiagram element={element} /> */}

      {/* Property list */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No styles applied</Text>
        ) : (
          entries.map(([key, value]) => (
            <View key={key} style={styles.row}>
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

      {/* Footer — property count */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {entries.length} {entries.length === 1 ? 'property' : 'properties'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 260,
    backgroundColor: 'rgba(30, 30, 30, 0.97)',
    borderTopWidth: 1,
    borderTopColor: '#444',
    zIndex: Z_INDEX.STYLE_PANEL,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
  },
  componentName: {
    color: '#E06C75',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Menlo',
  },
  sourceText: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'Menlo',
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  propertyName: {
    color: '#9CDCFE',
    fontSize: 12,
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
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666',
    marginRight: 6,
  },
  propertyValue: {
    color: '#CE9178',
    fontSize: 12,
    fontFamily: 'Menlo',
    flexShrink: 1,
  },
  emptyText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  footer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#444',
  },
  footerText: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'Menlo',
  },
});
