import { StyleSheet } from 'react-native';

export type StyleObject = Record<string, unknown>;

/**
 * Resolve any style value (StyleSheet ID, array, or plain object) into a flat object.
 */
export const flattenStyles = (style: unknown): StyleObject | null => {
  if (!style) return null;
  return StyleSheet.flatten(style as Parameters<typeof StyleSheet.flatten>[0]) as StyleObject;
};
