import { useRef, useState } from 'react';
import type { MeasuredElement } from '../fiber/types';
import { useStyleMutation } from './useStyleMutation';

/**
 * Manages style overrides, key renames, and property toggling for a selected element.
 * Builds the final style object and applies it to the fiber on every change.
 */
export const useStyleOverrides = (element: MeasuredElement) => {
  const { originalStyle, applyStyle } = useStyleMutation(element);
  const [overrides, setOverrides] = useState<Record<string, unknown>>({});
  const [disabledKeys, setDisabledKeys] = useState<Set<string>>(new Set());
  const [keyRenames, setKeyRenames] = useState<Record<string, string>>({});

  // Refs mirror state so handlers always read the latest values (no stale closures)
  const overridesRef = useRef(overrides);
  const disabledRef = useRef(disabledKeys);
  const keyRenamesRef = useRef(keyRenames);
  const prevElementRef = useRef(element);

  // Reset when element changes (render-phase setState — React's recommended
  // pattern for adjusting state based on props, avoids stale flash from useEffect)
  if (prevElementRef.current !== element) {
    prevElementRef.current = element;
    overridesRef.current = {};
    disabledRef.current = new Set();
    keyRenamesRef.current = {};
    setOverrides({});
    setDisabledKeys(new Set());
    setKeyRenames({});
  }

  // Build a flat style from original + overrides − disabled + renames, then apply
  const buildAndApply = (
    nextOverrides: Record<string, unknown>,
    nextDisabled: Set<string>,
    nextRenames: Record<string, string>,
  ) => {
    const style: Record<string, unknown> = {};
    for (const [originalKey, originalValue] of Object.entries(originalStyle)) {
      if (nextDisabled.has(originalKey)) continue;
      const activeKey = nextRenames[originalKey] ?? originalKey;
      const value = activeKey in nextOverrides ? nextOverrides[activeKey] : originalValue;
      style[activeKey] = value;
    }
    applyStyle(style);
  };

  const handleToggle = (key: string) => {
    const nextDisabled = new Set(disabledRef.current);
    if (nextDisabled.has(key)) {
      nextDisabled.delete(key);
    } else {
      nextDisabled.add(key);
    }
    disabledRef.current = nextDisabled;
    buildAndApply(overridesRef.current, nextDisabled, keyRenamesRef.current);
    setDisabledKeys(nextDisabled);
  };

  const handleValueChange = (originalKey: string, newValue: unknown) => {
    const activeKey = keyRenamesRef.current[originalKey] ?? originalKey;
    const nextOverrides = { ...overridesRef.current, [activeKey]: newValue };
    overridesRef.current = nextOverrides;
    buildAndApply(nextOverrides, disabledRef.current, keyRenamesRef.current);
    setOverrides(nextOverrides);
  };

  const handleKeyChange = (originalKey: string, newKey: string) => {
    const currentRenamedKey = keyRenamesRef.current[originalKey] ?? originalKey;
    if (newKey === currentRenamedKey) return;

    const nextRenames = { ...keyRenamesRef.current };
    const nextOverrides = { ...overridesRef.current };
    if (currentRenamedKey in nextOverrides) {
      nextOverrides[newKey] = nextOverrides[currentRenamedKey];
      delete nextOverrides[currentRenamedKey];
    }

    if (newKey === originalKey) {
      delete nextRenames[originalKey];
    } else {
      nextRenames[originalKey] = newKey;
    }

    overridesRef.current = nextOverrides;
    keyRenamesRef.current = nextRenames;
    buildAndApply(nextOverrides, disabledRef.current, nextRenames);
    setOverrides(nextOverrides);
    setKeyRenames(nextRenames);
  };

  /** Resolve the active key and display value for an original style entry. */
  const resolveEntry = (originalKey: string, originalValue: unknown) => {
    const activeKey = keyRenames[originalKey] ?? originalKey;
    const displayValue = activeKey in overrides ? overrides[activeKey] : originalValue;
    const disabled = disabledKeys.has(originalKey);
    return { activeKey, displayValue, disabled };
  };

  return {
    originalStyle,
    entries: Object.entries(originalStyle),
    resolveEntry,
    handleToggle,
    handleValueChange,
    handleKeyChange,
  };
};
