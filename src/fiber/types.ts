/** React component function with optional display name. */
type ComponentFunction = ((...args: never[]) => unknown) & {
  displayName?: string;
  name?: string;
};

/** Minimal fiber node type — only the fields we access. */
export interface FiberNode {
  tag: number;
  type: string | ComponentFunction;
  memoizedProps: Record<string, unknown>;
  stateNode: unknown;
  child: FiberNode | null;
  sibling: FiberNode | null;
  return: FiberNode | null;
  _debugSource?: {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
  };
  _debugOwner?: FiberNode;
}

/** Host component fiber tag — View, Text, Image, etc. */
export const HOST_COMPONENT_TAG = 5;

export interface MeasuredElement {
  fiber: FiberNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  zIndex: number;
  componentName: string;
}
