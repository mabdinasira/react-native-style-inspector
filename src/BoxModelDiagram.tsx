import { StyleSheet, Text, View } from 'react-native';
import { BOX_MODEL_COLORS } from './constants/colors';
import { FiberAdapter } from './fiber/FiberAdapter';
import type { MeasuredElement } from './fiber/types';
import type { BoxModel } from './utils/yogaLayout';
import { extractBoxModel } from './utils/yogaLayout';

interface BoxModelDiagramProps {
  element: MeasuredElement | null;
}

/** Chrome DevTools-style box model diagram with actual values on each edge. */
export const BoxModelDiagram = ({ element }: BoxModelDiagramProps) => {
  if (!element) return null;

  const style = FiberAdapter.getStyle(element.fiber);
  const boxModel = extractBoxModel(style, {
    width: element.width,
    height: element.height,
  });

  return (
    <View style={styles.container}>
      {/* Margin layer */}
      <View style={styles.marginLayer}>
        <Text style={styles.layerLabel}>margin</Text>
        <EdgeValues edges={boxModel.margin} color={BOX_MODEL_COLORS.marginLabel} />

        {/* Border layer */}
        <View style={styles.borderLayer}>
          <Text style={styles.layerLabel}>border</Text>
          <EdgeValues edges={boxModel.border} color={BOX_MODEL_COLORS.borderLabel} />

          {/* Padding layer */}
          <View style={styles.paddingLayer}>
            <Text style={styles.layerLabel}>padding</Text>
            <EdgeValues edges={boxModel.padding} color={BOX_MODEL_COLORS.paddingLabel} />

            {/* Content */}
            <View style={styles.contentLayer}>
              <Text style={styles.contentText}>
                {Math.round(boxModel.content.width)} x {Math.round(boxModel.content.height)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

interface EdgeValuesProps {
  edges: BoxModel['margin'];
  color: string;
}

/** Renders the four edge values (top/right/bottom/left) around a layer. */
const EdgeValues = ({ edges, color }: EdgeValuesProps) => {
  const valueStyle = [styles.edgeValue, { color }];

  return (
    <>
      <View style={styles.edgeTop}>
        <Text style={valueStyle}>{edges.top || '-'}</Text>
      </View>
      <View style={styles.edgeRow}>
        <Text style={valueStyle}>{edges.left || '-'}</Text>
        <View style={styles.edgeSpacer} />
        <Text style={valueStyle}>{edges.right || '-'}</Text>
      </View>
      <View style={styles.edgeBottom}>
        <Text style={valueStyle}>{edges.bottom || '-'}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
  },
  marginLayer: {
    backgroundColor: BOX_MODEL_COLORS.margin,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  borderLayer: {
    backgroundColor: BOX_MODEL_COLORS.border,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  paddingLayer: {
    backgroundColor: BOX_MODEL_COLORS.padding,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  contentLayer: {
    backgroundColor: BOX_MODEL_COLORS.content,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 6,
  },
  contentText: {
    color: BOX_MODEL_COLORS.contentLabel,
    fontSize: 10,
    fontFamily: 'Menlo',
    fontWeight: '600',
  },
  layerLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 8,
    fontFamily: 'Menlo',
    alignSelf: 'flex-start',
  },
  edgeTop: {
    alignItems: 'center',
  },
  edgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  edgeSpacer: {
    flex: 1,
  },
  edgeBottom: {
    alignItems: 'center',
  },
  edgeValue: {
    fontSize: 9,
    fontFamily: 'Menlo',
    fontWeight: '600',
  },
});
