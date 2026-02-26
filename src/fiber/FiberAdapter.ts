import { StyleSheet } from 'react-native';
import type { FiberNode } from './types';
import { HOST_COMPONENT_TAG } from './types';

/**
 * Unified API for all fiber tree access.
 * Abstracts away React version differences.
 */
export const FiberAdapter = {
  /**
   * Get the fiber root from the React DevTools global hook.
   * Returns null if the hook is not available (production build).
   */
  getFiberRoot(): FiberNode | null {
    const hook = (globalThis as Record<string, unknown>).__REACT_DEVTOOLS_GLOBAL_HOOK__ as
      | { getFiberRoots?: (id: number) => Set<{ current: FiberNode }> }
      | undefined;

    if (!hook?.getFiberRoots) return null;

    // Renderer ID 1 is typically the React Native renderer
    const roots = hook.getFiberRoots(1);
    if (!roots || roots.size === 0) return null;

    const root = roots.values().next().value;
    return root?.current ?? null;
  },

  /**
   * Walk the fiber tree and collect all host component fibers.
   */
  walkHostFibers(root: FiberNode): FiberNode[] {
    const hostFibers: FiberNode[] = [];

    const walk = (fiber: FiberNode | null, _depth: number) => {
      if (!fiber) return;

      if (fiber.tag === HOST_COMPONENT_TAG) {
        hostFibers.push(fiber);
      }

      walk(fiber.child, _depth + 1);
      walk(fiber.sibling, _depth);
    };
    walk(root.child, 0);
    return hostFibers;
  },

  /**
   * Get the flattened style object from a fiber's props.
   */
  getStyle(fiber: FiberNode): Record<string, unknown> | null {
    const style = fiber.memoizedProps?.style;
    if (!style) return null;
    return StyleSheet.flatten(style as Parameters<typeof StyleSheet.flatten>[0]) as Record<
      string,
      unknown
    >;
  },

  /**
   * Get the source file location from a fiber's debug info.
   */
  getSource(fiber: FiberNode): { fileName: string; lineNumber: number } | null {
    return fiber._debugSource ?? null;
  },

  /**
   * Get the display name of the component.
   */
  getComponentName(fiber: FiberNode): string {
    if (typeof fiber.type === 'string') return fiber.type;
    if (typeof fiber.type === 'function')
      return fiber.type.displayName ?? fiber.type.name ?? 'Unknown';
    return 'Unknown';
  },

  /**
   * Measure a fiber's native view on screen.
   * Returns a promise with { x, y, width, height }.
   */
  measure(fiber: FiberNode): Promise<{ x: number; y: number; width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const stateNode = fiber.stateNode as {
        measure?: (
          cb: (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number,
          ) => void,
        ) => void;
      };

      if (!stateNode?.measure) {
        reject(new Error('Fiber stateNode does not support measure()'));
        return;
      }

      stateNode.measure((_x, _y, width, height, pageX, pageY) => {
        resolve({ x: pageX, y: pageY, width, height });
      });
    });
  },

  /**
   * Override a style property on a fiber using the devtools hook.
   * Works on both old arch and Fabric.
   */
  overrideStyle(fiber: FiberNode, key: string, value: unknown): boolean {
    const hook = (globalThis as Record<string, unknown>).__REACT_DEVTOOLS_GLOBAL_HOOK__ as
      | {
          renderers?: Map<
            number,
            { overrideProps?: (fiber: FiberNode, path: string[], value: unknown) => void }
          >;
        }
      | undefined;

    if (!hook?.renderers) return false;

    const renderer = hook.renderers.get(1);
    if (!renderer?.overrideProps) return false;

    renderer.overrideProps(fiber, ['style', key], value);
    return true;
  },
};
