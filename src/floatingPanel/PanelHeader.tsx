import { StyleSheet, Text, View } from 'react-native';
import { ElementCycler } from '../ElementCycler';
import type { MeasuredElement } from '../fiber/types';
import { formatSourceLocation, getOwnerName, getSourceLocation } from '../utils/sourceMapping';
import { CloseButton } from './CloseButton';

interface PanelHeaderProps {
  selected: MeasuredElement;
  matches: MeasuredElement[];
  selectedIndex: number;
  onCycleNext: () => void;
  onCyclePrevious: () => void;
  onClose: () => void;
}

/** Expanded panel header — grab bar, component info, cycling controls, close button. */
export const PanelHeader = ({
  selected,
  matches,
  selectedIndex,
  onCycleNext,
  onCyclePrevious,
  onClose,
}: PanelHeaderProps) => {
  const source = getSourceLocation(selected.fiber);
  const ownerName = getOwnerName(selected.fiber);

  return (
    <View style={styles.header}>
      {/* Grab bar — visual drag indicator */}
      <View style={styles.grabBarContainer}>
        <View style={styles.grabBar} />
      </View>

      {/* Component info row */}
      <View style={styles.infoRow}>
        <Text style={styles.componentName} numberOfLines={1}>
          &lt;{selected.componentName}&gt;
        </Text>

        <View style={styles.controls}>
          <ElementCycler
            total={matches.length}
            currentIndex={selectedIndex}
            componentName={selected.componentName}
            onPrevious={onCyclePrevious}
            onNext={onCycleNext}
          />

          <CloseButton onPress={onClose} />
        </View>
      </View>

      {/* Source location — on its own line so it's not truncated */}
      {source ? (
        <Text style={styles.sourceText} numberOfLines={1}>
          {formatSourceLocation(source)}
        </Text>
      ) : ownerName ? (
        <Text style={styles.sourceText} numberOfLines={1}>
          {ownerName}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 6,
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
  },
  grabBarContainer: {
    alignItems: 'center',
    paddingBottom: 6,
  },
  grabBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  componentName: {
    color: '#E06C75',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Menlo',
    flexShrink: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  sourceText: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'Menlo',
  },
});
