import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

export type StyleObject = Record<string, unknown>;

/**
 * Resolve any style value (StyleSheet ID, array, or plain object) into a flat object.
 */
export const flattenStyles = (style: unknown): StyleObject | null => {
  if (!style) return null;
  const flat = StyleSheet.flatten(style as StyleProp<ViewStyle>);
  return (flat ?? null) as StyleObject | null;
};
