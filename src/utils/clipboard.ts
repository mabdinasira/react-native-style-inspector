import { Clipboard } from 'react-native';
import type { StyleObject } from './flattenStyles';

/**
 * Copy a style object to the clipboard as formatted JavaScript.
 */
export const copyStyleToClipboard = (style: StyleObject): void => {
  const formatted = JSON.stringify(style, null, 2);
  // Wrap in JS object syntax
  const jsFormatted = formatted
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
    .replace(/"/g, "'"); // Single quotes for string values

  Clipboard.setString(jsFormatted);
};
