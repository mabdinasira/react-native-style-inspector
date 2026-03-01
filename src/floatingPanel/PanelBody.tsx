import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Checkbox } from '../components';
import type { MeasuredElement } from '../fiber';
import { useStyleOverrides } from '../hooks';
import { formatValue, isColorProp } from '../utils';
import { AddPropertyButton, AddPropertyRow } from './AddPropertyRow';
import { EditableValue } from './EditableValue';
import { PanelFooter } from './PanelFooter';

interface PanelBodyProps {
  element: MeasuredElement;
}

/** Scrollable style property list with footer — the main content of the expanded panel. */
export const PanelBody = ({ element }: PanelBodyProps) => {
  const {
    entries,
    addedEntries,
    resolveEntry,
    handleToggle,
    handleValueChange,
    handleKeyChange,
    handleAddProperty,
    handleAddedValueChange,
    handleAddedKeyChange,
    handleRemoveProperty,
  } = useStyleOverrides(element);

  const [pendingAdd, setPendingAdd] = useState(false);

  const totalCount = entries.length + addedEntries.length;
  if (entries.length === 0 && addedEntries.length === 0 && !pendingAdd) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled
        keyboardShouldPersistTaps='handled'
      >
        {entries.map(([originalKey, originalValue], index) => {
          const { activeKey, displayValue, disabled } = resolveEntry(originalKey, originalValue);
          return (
            <View key={originalKey} style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
              <Checkbox checked={!disabled} onToggle={() => handleToggle(originalKey)} />
              <View style={[styles.rowContent, disabled && styles.rowDisabled]}>
                <EditableValue
                  value={activeKey}
                  displayValue={activeKey}
                  onSubmit={(newKey) => handleKeyChange(originalKey, String(newKey))}
                  variant='key'
                  disabled={disabled}
                />
                <View style={styles.valueContainer}>
                  {isColorProp(activeKey) && (
                    <View style={[styles.colorSwatch, { backgroundColor: String(displayValue) }]} />
                  )}
                  <EditableValue
                    value={displayValue}
                    displayValue={formatValue(displayValue)}
                    onSubmit={(newValue) => handleValueChange(originalKey, newValue)}
                    variant='value'
                    disabled={disabled}
                  />
                </View>
              </View>
            </View>
          );
        })}

        {addedEntries.map(([key, value], index) => {
          const rowIndex = entries.length + index;
          return (
            <View key={`added-${key}`} style={[styles.row, rowIndex % 2 === 0 && styles.rowAlt]}>
              <Checkbox checked onToggle={() => handleRemoveProperty(key)} />
              <View style={styles.rowContent}>
                <EditableValue
                  value={key}
                  displayValue={key}
                  onSubmit={(newKey) => handleAddedKeyChange(key, String(newKey))}
                  variant='key'
                />
                <View style={styles.valueContainer}>
                  {isColorProp(key) && (
                    <View style={[styles.colorSwatch, { backgroundColor: String(value) }]} />
                  )}
                  <EditableValue
                    value={value}
                    displayValue={formatValue(value)}
                    onSubmit={(newValue) => handleAddedValueChange(key, newValue)}
                    variant='value'
                  />
                </View>
              </View>
            </View>
          );
        })}

        {pendingAdd ? (
          <AddPropertyRow
            onAdd={(key, value) => {
              handleAddProperty(key, value);
              setPendingAdd(false);
            }}
            onCancel={() => setPendingAdd(false)}
          />
        ) : (
          <AddPropertyButton onPress={() => setPendingAdd(true)} />
        )}
      </ScrollView>

      <PanelFooter propertyCount={totalCount} width={element.width} height={element.height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowAlt: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  rowDisabled: {
    opacity: 0.35,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  colorSwatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666',
    marginRight: 6,
  },
});
