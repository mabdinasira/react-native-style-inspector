import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { EDITABLE_VALUE, EDITABLE_VALUE_COLORS, MONOSPACE_FONT } from '../constants';
import { parseInput, toEditableString } from '../utils';

interface EditableValueProps {
  value: unknown;
  displayValue: string;
  onSubmit: (parsed: unknown) => void;
  variant: 'key' | 'value';
  disabled?: boolean;
}

/** Tappable style value that becomes an inline TextInput on press. */
export const EditableValue = ({
  value,
  displayValue,
  onSubmit,
  variant,
  disabled,
}: EditableValueProps) => {
  const colors = EDITABLE_VALUE_COLORS[variant];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [invalid, setInvalid] = useState(false);
  const committedRef = useRef(false);

  const startEditing = () => {
    if (disabled) return;
    committedRef.current = false;
    setDraft(toEditableString(value));
    setEditing(true);
  };

  const commitEdit = () => {
    // Guard against double-fire from onSubmitEditing + onBlur
    if (committedRef.current) return;
    committedRef.current = true;

    const trimmed = draft.trim();
    const changed = trimmed !== '' && trimmed !== toEditableString(value);

    if (changed) {
      const isInvalidKey = variant === 'key' && !EDITABLE_VALUE.VALID_STYLE_KEY.test(trimmed);
      const isTooLong = trimmed.length > EDITABLE_VALUE.MAX_VALUE_LENGTH;

      if (isInvalidKey || isTooLong) {
        setInvalid(true);
        setTimeout(() => setEditing(false), 300);
        return;
      }

      const parsed = parseInput(trimmed, value);
      onSubmit(parsed);
    }

    setEditing(false);
  };

  if (editing) {
    return (
      <TextInput
        style={[
          styles.base,
          styles.editing,
          { color: colors.text, borderColor: invalid ? '#f44' : colors.underline },
        ]}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commitEdit}
        onBlur={commitEdit}
        autoCapitalize='none'
        autoCorrect={false}
        autoFocus
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
    fontFamily: MONOSPACE_FONT,
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
