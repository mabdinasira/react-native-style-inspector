import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MONOSPACE_FONT } from '../constants';
import { EditableValue } from './EditableValue';

interface AddPropertyRowProps {
  onAdd: (key: string, value: unknown) => void;
  onCancel: () => void;
}

/** Inline two-step row for adding a new style property: type key → type value → applied. */
export const AddPropertyRow = ({ onAdd, onCancel }: AddPropertyRowProps) => {
  const [key, setKey] = useState('');
  const [waitingForValue, setWaitingForValue] = useState(false);

  if (!waitingForValue) {
    return (
      <View style={styles.row}>
        <View style={styles.content}>
          <EditableValue
            value=''
            displayValue=''
            onSubmit={(newKey) => {
              const trimmed = String(newKey).trim();
              if (!trimmed) {
                onCancel();
                return;
              }
              setKey(trimmed);
              setWaitingForValue(true);
            }}
            variant='key'
            initialEditing
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <Text style={styles.pendingKey}>{key}:</Text>
        <EditableValue
          value=''
          displayValue=''
          onSubmit={(newValue) => {
            const trimmed = String(newValue).trim();
            if (!trimmed) {
              onCancel();
              return;
            }
            onAdd(key, newValue);
          }}
          variant='value'
          initialEditing
        />
      </View>
    </View>
  );
};

interface AddPropertyButtonProps {
  onPress: () => void;
}

/** Dim "+ add property" button shown at the bottom of the style list. */
export const AddPropertyButton = ({ onPress }: AddPropertyButtonProps) => (
  <Pressable style={styles.button} onPress={onPress} hitSlop={6}>
    <Text style={styles.buttonText}>+ add property</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingKey: {
    color: '#9CDCFE',
    fontSize: 13,
    fontFamily: MONOSPACE_FONT,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: '#666',
    fontSize: 12,
    fontFamily: MONOSPACE_FONT,
  },
});
