import { FiberAdapter } from '../fiber/FiberAdapter';
import type { FiberNode, MeasuredElement } from '../fiber/types';

/**
 * Build a layout snapshot: walk the fiber tree, measure every host fiber,
 * return a flat array sorted by zIndex (desc) → depth (desc).
 */
export const buildLayoutSnapshot = async (root: FiberNode): Promise<MeasuredElement[]> => {
  const hostFibers = FiberAdapter.walkHostFibers(root);
  const elements: MeasuredElement[] = [];

  // Measure all host fibers in parallel
  const measurements = await Promise.allSettled(
    hostFibers.map(async ({ fiber, depth }) => {
      const rect = await FiberAdapter.measure(fiber);
      const style = FiberAdapter.getStyle(fiber);

      return {
        fiber,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        depth,
        zIndex: typeof style?.zIndex === 'number' ? style.zIndex : 0,
        componentName: FiberAdapter.getComponentName(fiber),
      } satisfies MeasuredElement;
    }),
  );

  for (const result of measurements) {
    if (result.status === 'fulfilled') {
      const element = result.value;
      // Skip zero-size elements — invisible and untappable
      if (element.width > 0 && element.height > 0) {
        elements.push(element);
      }
    }
    // Skip fibers that fail to measure (unmounted, off-screen, etc.)
  }

  // Sort: zIndex descending, then depth descending
  elements.sort((a, b) => {
    if (a.zIndex !== b.zIndex) return b.zIndex - a.zIndex;
    return b.depth - a.depth;
  });

  return elements;
};
