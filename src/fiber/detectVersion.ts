/**
 * Detect the React version at runtime from the renderer.
 * Used to load the correct fiber adapter if needed.
 */
export const detectReactVersion = (): { major: number; minor: number } | null => {
  const hook = (globalThis as Record<string, unknown>).__REACT_DEVTOOLS_GLOBAL_HOOK__ as
    | { renderers?: Map<number, { version?: string }> }
    | undefined;

  if (!hook?.renderers) return null;

  const renderer = hook.renderers.get(1);
  if (!renderer?.version) return null;

  const [major, minor] = renderer.version.split('.').map(Number);
  return { major: major ?? 0, minor: minor ?? 0 };
};
