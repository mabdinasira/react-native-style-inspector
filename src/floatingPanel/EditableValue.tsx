import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

interface EditableValueProps {
  value: unknown;
  displayValue: string;
  onSubmit: (parsed: unknown) => void;
  variant: 'key' | 'value';
  disabled?: boolean;
}

const VALID_STYLE_KEY = /^[a-zA-Z][a-zA-Z0-9]*$/;
const MAX_VALUE_LENGTH = 200;

/** Parses user input back to the appropriate type. */
const parseInput = (text: string, originalValue: unknown): unknown => {
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
const toEditableString = (value: unknown): string => {
  if (value === undefined) return '';
  if (value === null) return '';
  return String(value);
};

const variantColors = {
  key: { text: '#9CDCFE', underline: 'rgba(156, 220, 254, 0.4)' },
  value: { text: '#CE9178', underline: 'rgba(206, 145, 120, 0.4)' },
};

/** Tappable style value that becomes an inline TextInput on press. */
export const EditableValue = ({
  value,
  displayValue,
  onSubmit,
  variant,
  disabled,
}: EditableValueProps) => {
  const colors = variantColors[variant];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);
  const committedRef = useRef(false);

  const startEditing = () => {
    if (disabled) return;
    committedRef.current = false;
    setDraft(toEditableString(value));
    setEditing(true);
    // Focus after the TextInput mounts
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitEdit = () => {
    // Guard against double-fire from onSubmitEditing + onBlur
    if (committedRef.current) return;
    committedRef.current = true;

    const trimmed = draft.trim();
    const changed = trimmed !== '' && trimmed !== toEditableString(value);

    if (changed) {
      // Validate key names and cap value length
      if (variant === 'key' && !VALID_STYLE_KEY.test(trimmed)) return;
      if (trimmed.length > MAX_VALUE_LENGTH) return;

      const parsed = parseInput(trimmed, value);
      onSubmit(parsed);
    }

    setEditing(false);
  };

  if (editing) {
    return (
      <TextInput
        ref={inputRef}
        style={[styles.base, styles.editing, { color: colors.text, borderColor: colors.underline }]}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commitEdit}
        onBlur={commitEdit}
        autoCapitalize='none'
        autoCorrect={false}
        selectTextOnFocus
        returnKeyType='done'
      />
    );
  }

  return (
    <Pressable onPress={startEditing} hitSlop={4}>
      <Text style={[styles.base, { color: colors.text }, disabled && styles.strikethrough]}>
        {displayValue}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    fontSize: 13,
    fontFamily: 'Menlo',
    padding: 0,
    margin: 0,
    minWidth: 20,
  },
  editing: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
});
