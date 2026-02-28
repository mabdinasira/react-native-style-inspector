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

  // Everything else is a string (e.g. color names, hex codes)
  return trimmed;
};

/** Raw value → editable string (no quotes around strings). */
export const toEditableString = (value: unknown): string => {
  if (value === undefined) return '';
  if (value === null) return '';
  return String(value);
};
