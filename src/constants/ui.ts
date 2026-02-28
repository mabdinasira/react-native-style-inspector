import { Platform } from 'react-native';

/** Cross-platform monospace font family */
export const MONOSPACE_FONT = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** Z-index layering for inspector UI elements */
export const Z_INDEX = {
  HIGHLIGHT: 9997,
  TAP_OVERLAY: 9998,
  FLOATING_PANEL: 10000,
} as const;

/** Timeout for fiber measure() calls (ms) */
export const MEASURE_TIMEOUT_MS = 3000;

/** Floating panel dimensions and animation config */
export const FLOATING_PANEL = {
  BUBBLE_SIZE: 48,
  HANDLE_WIDTH: 180,
  HANDLE_HEIGHT: 44,
  PANEL_WIDTH: 280,
  PANEL_HEIGHT: 320,
  PANEL_BODY_HEIGHT: 220,
  TAP_THRESHOLD: 5,
  EDGE_MARGIN: 12,
  TOP_SAFE_AREA: 50,
  BOTTOM_SAFE_AREA: 40,
  SNAP_FRICTION: 7,
  SNAP_TENSION: 40,
  EXPAND_DURATION: 250,
  HIGHLIGHT_FLASH_MS: 1500,
} as const;

/** Validation constraints for editable style values */
export const EDITABLE_VALUE = {
  VALID_STYLE_KEY: /^[a-zA-Z][a-zA-Z0-9]*$/,
  MAX_VALUE_LENGTH: 200,
} as const;

/** InspectorBubble sizing and animation trail config */
export const INSPECTOR_BUBBLE = {
  SIZE: 48,
  SWEEP_WIDTH: 2.5,
  CENTER_DOT_SIZE: 8,
  TRAIL_ARMS: [
    { key: 'sweep', offsetDeg: 0, opacity: 0.9 },
    { key: 'trail-1', offsetDeg: -18, opacity: 0.45 },
    { key: 'trail-2', offsetDeg: -36, opacity: 0.3 },
    { key: 'trail-3', offsetDeg: -54, opacity: 0.2 },
  ],
} as const;
