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
} as const;
