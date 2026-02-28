import { StyleSheet, View } from 'react-native';
import { BOX_MODEL_COLORS } from './constants/colors';
import { Z_INDEX } from './constants/ui';
import { FiberAdapter } from './fiber/FiberAdapter';
import type { MeasuredElement } from './fiber/types';
import { extractBoxModel } from './utils/yogaLayout';

interface ElementHighlighterProps {
  element: MeasuredElement | null;
  outlineOnly?: boolean;
}

/**
 * Draws a Chrome DevTools-style highlight on the selected element.
 *
 * Full mode: margin (orange), padding (green), content (blue) fills + outline.
 * Outline-only mode: just the crisp border — keeps selection visible without obscuring content.
 *
 * The measured rect is the border box (includes border + padding, NOT margin).
 * Margin extends outward, padding/content sit inside.
 *
 * Layering trick: each nested View's background covers the parent's color,
 * so only the "strips" around the edges remain visible:
 *   orange margin strips → green padding strips → blue content fill
 */
export const ElementHighlighter = ({ element, outlineOnly = false }: ElementHighlighterProps) => {
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
      {!outlineOnly && (
        <>
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
        </>
      )}

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

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: Z_INDEX.HIGHLIGHT,
  },
  marginLayer: {
    position: 'absolute',
    backgroundColor: BOX_MODEL_COLORS.margin,
  },
  paddingLayer: {
    backgroundColor: BOX_MODEL_COLORS.padding,
  },
  contentLayer: {
    backgroundColor: BOX_MODEL_COLORS.content,
  },
  outline: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: BOX_MODEL_COLORS.outline,
  },
});
