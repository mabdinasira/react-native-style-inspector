import type { FiberNode } from '../fiber';

export interface SourceLocation {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
}

/**
 * Extract the source file location from a fiber node.
 * Host components (RCTView, RCTText, etc.) don't have _debugSource,
 * so we check _debugOwner (the component that rendered this element)
 * and walk up the fiber tree as a fallback.
 */
export const getSourceLocation = (fiber: FiberNode): SourceLocation | null => {
  // Check the fiber itself first
  if (fiber._debugSource) return fiber._debugSource;

  // Check _debugOwner — points to the component that created this JSX
  if (fiber._debugOwner?._debugSource) return fiber._debugOwner._debugSource;

  // Walk up the return (parent) chain
  let current: FiberNode | null = fiber.return;
  while (current) {
    if (current._debugSource) return current._debugSource;
    current = current.return;
  }

  return null;
};

/**
 * Format a source location for display.
 * Strips the project root for readability.
 * Adds extension to the file name and line number, e.g. "MyComponent.js:42"
 */
export const formatSourceLocation = (source: SourceLocation): string => {
  const lastSlash = source.fileName.lastIndexOf('/');
  const fileName = lastSlash === -1 ? source.fileName : source.fileName.substring(lastSlash + 1);
  return `${fileName}:${source.lineNumber}`;
};

/** Names of RN host wrappers and interop layers that should be skipped when resolving owner. */
const SKIP_NAMES = new Set(['View', 'Text', 'ScrollView', 'Image', 'TextInput']);
const SKIP_PREFIXES = ['CssInterop.', 'NativeWind.', 'RCT'];

const isInternalWrapper = (name: string): boolean => {
  if (SKIP_NAMES.has(name)) return true;
  return SKIP_PREFIXES.some((prefix) => name.startsWith(prefix));
};

/**
 * Get the name of the nearest user component that owns this fiber.
 * React 19 dropped _debugSource, so we use _debugOwner to find the
 * parent component name as a fallback.
 */
export const getOwnerName = (fiber: FiberNode): string | null => {
  type OwnerInfo = {
    type: string | (((...args: never[]) => unknown) & { displayName?: string; name?: string });
    _debugOwner?: OwnerInfo;
  };

  let owner = fiber._debugOwner as OwnerInfo | undefined;
  while (owner) {
    const ownerType = owner.type;
    if (typeof ownerType === 'function') {
      const name = ownerType.displayName ?? ownerType.name;
      if (name && !isInternalWrapper(name)) {
        return `in ${name}`;
      }
    }
    owner = owner._debugOwner;
  }
  return null;
};
