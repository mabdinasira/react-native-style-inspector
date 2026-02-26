import { ScrollView, Text, View } from 'react-native';
import type { StyleObject } from './utils/flattenStyles';

interface StylePanelProps {
  componentName: string | null;
  styles: StyleObject | null;
  source: { fileName: string; lineNumber: number } | null;
}

/** Scrollable panel showing the flattened style properties of the selected element. */
export const StylePanel = ({ componentName, styles, source }: StylePanelProps) => {
  if (!styles) return null;

  // TODO: Full style panel UI with property list
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: 300,
        backgroundColor: '#1E1E1E',
        borderTopWidth: 1,
        borderTopColor: '#333',
      }}
    >
      <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ color: '#E06C75', fontSize: 13, fontWeight: '600' }}>
          {componentName ?? 'Unknown'}
        </Text>
        {source && (
          <Text style={{ color: '#666', fontSize: 11, marginTop: 2 }}>
            {source.fileName}:{source.lineNumber}
          </Text>
        )}
      </View>
      <ScrollView style={{ padding: 8 }}>
        {Object.entries(styles).map(([key, value]) => (
          <View key={key} style={{ flexDirection: 'row', paddingVertical: 2 }}>
            <Text style={{ color: '#9CDCFE', fontSize: 12, flex: 1 }}>{key}</Text>
            <Text style={{ color: '#CE9178', fontSize: 12 }}>{String(value)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
