import type { MeasuredElement } from '../fiber';

/**
 * Given a tap point and a layout snapshot, return all elements
 * whose bounds contain the point, sorted by area (smallest first).
 */
export const hitTest = (
  snapshot: MeasuredElement[],
  tapX: number,
  tapY: number,
): MeasuredElement[] => {
  const matches: MeasuredElement[] = [];

  for (const element of snapshot) {
    const { x, y, width, height } = element;

    // Skip zero-size elements
    if (width === 0 || height === 0) continue;

    if (tapX >= x && tapX <= x + width && tapY >= y && tapY <= y + height) {
      matches.push(element);
    }
  }

  // Sort by area ascending — smallest (most specific) element first
  matches.sort((a, b) => a.width * a.height - b.width * b.height);

  return matches;
};
