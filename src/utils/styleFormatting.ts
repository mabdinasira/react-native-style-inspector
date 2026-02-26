/** Regex matching RN style property names that hold color values */
const COLOR_PROPS = /color|background|shadow|tint|overlay/i;

/** Returns true if the style property name typically holds a color value */
export const isColorProp = (propertyName: string): boolean => COLOR_PROPS.test(propertyName);

/** Format a style value for display in the inspector panel */
export const formatValue = (value: unknown): string => {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
};
