/** Parses user input back to the appropriate type. */
export const parseInput = (text: string, originalValue: unknown): unknown => {
  const trimmed = text.trim();
  if (trimmed === '') return originalValue;

  // Strip surrounding quotes if the user typed them
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  // Only coerce to number when the original was numeric
  if (typeof originalValue === 'number') {
    const asNumber = Number(trimmed);
    if (!Number.isNaN(asNumber)) return asNumber;
  }

  // Boolean
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // JSON arrays/objects (e.g. transform: [{scale: 1}, ...])
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch (_syntaxError) {
      return trimmed;
    }
  }

  // Everything else is a string (e.g. color names, hex codes)
  return trimmed;
};

/** Raw value → editable string (no quotes around strings). */
export const toEditableString = (value: unknown): string => {
  if (value === undefined) return '';
  if (value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};
