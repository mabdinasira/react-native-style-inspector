import type { ReactNode } from 'react';
import { View } from 'react-native';

export interface StyleInspectorProps {
  /** Only enable in dev mode. Pass `__DEV__` here. */
  enabled?: boolean;
  children: ReactNode;
}

/**
 * Root wrapper component. Wrap your app root with this.
 * In production (enabled=false), renders children with zero overhead.
 */
export const StyleInspector = ({ enabled = false, children }: StyleInspectorProps) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
      {/* TODO: Floating inspect button */}
      {/* TODO: Highlight overlay */}
      {/* TODO: Style panel */}
    </View>
  );
};
