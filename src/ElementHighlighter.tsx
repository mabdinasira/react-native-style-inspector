import { StyleSheet, View } from 'react-native';
import { FiberAdapter } from './fiber/FiberAdapter';
import type { MeasuredElement } from './fiber/types';
import { extractBoxModel } from './utils/yogaLayout';

interface ElementHighlighterProps {
  element: MeasuredElement | null;
}

/**
 * Draws a Chrome DevTools-style highlight on the selected element.
 * Shows margin (orange), padding (green), and content (blue) regions.
 *
 * The measured rect is the border box (includes border + padding, NOT margin).
 * Margin extends outward, padding/content sit inside.
 *
 * Layering trick: each nested View's background covers the parent's color,
 * so only the "strips" around the edges remain visible:
 *   orange margin strips → green padding strips → blue content fill
 */
export const ElementHighlighter = ({ element }: ElementHighlighterProps) => {
  if (!element) return null;

  const style = FiberAdapter.getStyle(element.fiber);
  const { margin, border, padding } = extractBoxModel(style, {
    width: element.width,
    height: element.height,
  });

  // Margin box extends outward from the measured rect
  const marginBoxLeft = element.x - margin.left;
  const marginBoxTop = element.y - margin.top;
  const marginBoxWidth = element.width + margin.left + margin.right;
  const marginBoxHeight = element.height + margin.top + margin.bottom;

  return (
    <View pointerEvents='none' style={styles.root}>
      {/* Margin layer — orange, covers full area including margins */}
      <View
        style={[
          styles.marginLayer,
          {
            left: marginBoxLeft,
            top: marginBoxTop,
            width: marginBoxWidth,
            height: marginBoxHeight,
          },
        ]}
      >
        {/* Padding layer — green, covers the element's border box */}
        <View
          style={[
            styles.paddingLayer,
            {
              position: 'absolute',
              left: margin.left,
              top: margin.top,
              width: element.width,
              height: element.height,
            },
          ]}
        >
          {/* Content layer — blue, inset by border + padding */}
          <View
            style={[
              styles.contentLayer,
              {
                position: 'absolute',
                left: border.left + padding.left,
                top: border.top + padding.top,
                right: border.right + padding.right,
                bottom: border.bottom + padding.bottom,
              },
            ]}
          />
        </View>
      </View>

      {/* Crisp outline at the border box edge */}
      <View
        style={[
          styles.outline,
          {
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
          },
        ]}
      />
    </View>
  );
};

const MARGIN_COLOR = 'rgba(246, 178, 107, 0.4)';
const PADDING_COLOR = 'rgba(147, 196, 125, 0.4)';
const CONTENT_COLOR = 'rgba(79, 195, 247, 0.3)';
const OUTLINE_COLOR = '#4FC3F7';

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9997,
  },
  marginLayer: {
    position: 'absolute',
    backgroundColor: MARGIN_COLOR,
  },
  paddingLayer: {
    backgroundColor: PADDING_COLOR,
  },
  contentLayer: {
    backgroundColor: CONTENT_COLOR,
  },
  outline: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: OUTLINE_COLOR,
  },
});
