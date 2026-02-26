import type { StyleObject } from './flattenStyles';

export interface BoxModel {
  margin: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
  padding: { top: number; right: number; bottom: number; left: number };
  content: { width: number; height: number };
}

/**
 * Extract box model values from a flattened style object.
 */
export const extractBoxModel = (
  style: StyleObject | null,
  measured: { width: number; height: number },
): BoxModel => {
  const num = (key: string): number => {
    const val = style?.[key];
    return typeof val === 'number' ? val : 0;
  };

  const margin = {
    top: num('marginTop') || num('marginVertical') || num('margin'),
    right: num('marginRight') || num('marginHorizontal') || num('margin'),
    bottom: num('marginBottom') || num('marginVertical') || num('margin'),
    left: num('marginLeft') || num('marginHorizontal') || num('margin'),
  };

  const border = {
    top: num('borderTopWidth') || num('borderWidth'),
    right: num('borderRightWidth') || num('borderWidth'),
    bottom: num('borderBottomWidth') || num('borderWidth'),
    left: num('borderLeftWidth') || num('borderWidth'),
  };

  const padding = {
    top: num('paddingTop') || num('paddingVertical') || num('padding'),
    right: num('paddingRight') || num('paddingHorizontal') || num('padding'),
    bottom: num('paddingBottom') || num('paddingVertical') || num('padding'),
    left: num('paddingLeft') || num('paddingHorizontal') || num('padding'),
  };

  const content = {
    width: measured.width - padding.left - padding.right - border.left - border.right,
    height: measured.height - padding.top - padding.bottom - border.top - border.bottom,
  };

  return { margin, border, padding, content };
};
