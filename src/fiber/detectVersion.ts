/**
 * Detect the React version at runtime from the renderer.
 * Used to load the correct fiber adapter if needed.
 */
export const detectReactVersion = (): { major: number; minor: number } | null => {
  const hook = (globalThis as Record<string, unknown>).__REACT_DEVTOOLS_GLOBAL_HOOK__ as
    | { renderers?: Map<number, { version?: string }> }
    | undefined;

  if (!hook?.renderers) return null;

  for (const renderer of hook.renderers.values()) {
    if (!renderer?.version) continue;
    const [major, minor] = renderer.version.split('.').map(Number);
    return { major: major ?? 0, minor: minor ?? 0 };
  }

  return null;
};
