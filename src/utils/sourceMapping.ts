import type { FiberNode } from '../fiber/types';

export interface SourceLocation {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
}

/**
 * Extract the source file location from a fiber node.
 * React adds this in dev mode via @babel/plugin-transform-react-jsx-source.
 */
export const getSourceLocation = (fiber: FiberNode): SourceLocation | null => {
  return fiber._debugSource ?? null;
};

/**
 * Format a source location for display.
 * Strips the project root for readability.
 */
export const formatSourceLocation = (source: SourceLocation): string => {
  // Strip common prefixes for readability
  let fileName = source.fileName;
  const prefixes = ['/node_modules/', '/src/'];
  for (const prefix of prefixes) {
    const idx = fileName.lastIndexOf(prefix);
    if (idx !== -1) {
      fileName = fileName.substring(idx + 1);
      break;
    }
  }
  return `${fileName}:${source.lineNumber}`;
};
