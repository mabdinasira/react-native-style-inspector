/** Complete set of React Native style properties typed as ColorValue */
const COLOR_PROPS = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderStartColor',
  'borderEndColor',
  'borderBlockColor',
  'borderBlockStartColor',
  'borderBlockEndColor',
  'outlineColor',
  'shadowColor',
  'textDecorationColor',
  'textShadowColor',
  'tintColor',
  'overlayColor',
]);

/** Returns true if the style property name holds a color value */
export const isColorProp = (propertyName: string): boolean => COLOR_PROPS.has(propertyName);

/** Format a style value for display in the inspector panel */
export const formatValue = (value: unknown): string => {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
};
