import { StyleSheet, Text, View } from 'react-native';
import { BOX_MODEL_COLORS } from './constants/colors';

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
    <View style={styles.container}>
      <Text style={styles.title}>Box Model</Text>
      {/* Margin layer */}
      <View style={styles.marginLayer}>
        <Text style={styles.marginLabel}>margin</Text>
        {/* Border layer */}
        <View style={styles.borderLayer}>
          <Text style={styles.borderLabel}>border</Text>
          {/* Padding layer */}
          <View style={styles.paddingLayer}>
            <Text style={styles.paddingLabel}>padding</Text>
            {/* Content */}
            <View style={styles.contentLayer}>
              <Text style={styles.contentLabel}>
                {content ? `${content.width} x ${content.height}` : 'content'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
  },
  title: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  marginLayer: {
    backgroundColor: BOX_MODEL_COLORS.margin,
    padding: 8,
    alignItems: 'center',
  },
  marginLabel: {
    color: BOX_MODEL_COLORS.marginLabel,
    fontSize: 9,
  },
  borderLayer: {
    backgroundColor: BOX_MODEL_COLORS.border,
    padding: 8,
    alignItems: 'center',
  },
  borderLabel: {
    color: BOX_MODEL_COLORS.borderLabel,
    fontSize: 9,
  },
  paddingLayer: {
    backgroundColor: BOX_MODEL_COLORS.padding,
    padding: 8,
    alignItems: 'center',
  },
  paddingLabel: {
    color: BOX_MODEL_COLORS.paddingLabel,
    fontSize: 9,
  },
  contentLayer: {
    backgroundColor: BOX_MODEL_COLORS.content,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  contentLabel: {
    color: BOX_MODEL_COLORS.contentLabel,
    fontSize: 9,
  },
});
