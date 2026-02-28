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
  const num = (key: string): number | undefined => {
    const val = style?.[key];
    return typeof val === 'number' ? val : undefined;
  };

  const margin = {
    top: num('marginTop') ?? num('marginVertical') ?? num('margin') ?? 0,
    right: num('marginRight') ?? num('marginHorizontal') ?? num('margin') ?? 0,
    bottom: num('marginBottom') ?? num('marginVertical') ?? num('margin') ?? 0,
    left: num('marginLeft') ?? num('marginHorizontal') ?? num('margin') ?? 0,
  };

  const border = {
    top: num('borderTopWidth') ?? num('borderWidth') ?? 0,
    right: num('borderRightWidth') ?? num('borderWidth') ?? 0,
    bottom: num('borderBottomWidth') ?? num('borderWidth') ?? 0,
    left: num('borderLeftWidth') ?? num('borderWidth') ?? 0,
  };

  const padding = {
    top: num('paddingTop') ?? num('paddingVertical') ?? num('padding') ?? 0,
    right: num('paddingRight') ?? num('paddingHorizontal') ?? num('padding') ?? 0,
    bottom: num('paddingBottom') ?? num('paddingVertical') ?? num('padding') ?? 0,
    left: num('paddingLeft') ?? num('paddingHorizontal') ?? num('padding') ?? 0,
  };

  const content = {
    width: measured.width - padding.left - padding.right - border.left - border.right,
    height: measured.height - padding.top - padding.bottom - border.top - border.bottom,
  };

  return { margin, border, padding, content };
};
