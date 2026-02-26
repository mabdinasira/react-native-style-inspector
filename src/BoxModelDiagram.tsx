import { Text, View } from 'react-native';

interface BoxModelProps {
  margin?: { top: number; right: number; bottom: number; left: number };
  border?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  content?: { width: number; height: number };
}

/** Visual margin -> border -> padding -> content diagram. */
export const BoxModelDiagram = ({ content }: BoxModelProps) => {
  // TODO: Nested colored boxes visualizing the box model
  return (
    <View style={{ alignItems: 'center', padding: 12 }}>
      <Text style={{ color: '#888', fontSize: 11, marginBottom: 4 }}>Box Model</Text>
      {/* Margin layer (orange) */}
      <View
        style={{
          backgroundColor: 'rgba(246, 178, 107, 0.3)',
          padding: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#F6B26B', fontSize: 9 }}>margin</Text>
        {/* Border layer (yellow) */}
        <View
          style={{
            backgroundColor: 'rgba(255, 217, 102, 0.3)',
            padding: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFD966', fontSize: 9 }}>border</Text>
          {/* Padding layer (green) */}
          <View
            style={{
              backgroundColor: 'rgba(106, 168, 79, 0.3)',
              padding: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#6AA84F', fontSize: 9 }}>padding</Text>
            {/* Content (blue) */}
            <View
              style={{
                backgroundColor: 'rgba(74, 144, 217, 0.3)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#4A90D9', fontSize: 9 }}>
                {content ? `${content.width} x ${content.height}` : 'content'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
