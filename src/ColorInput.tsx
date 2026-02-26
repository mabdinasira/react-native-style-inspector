import { View } from 'react-native';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

/** Text input for color values (hex, rgb, rgba, hsl, named) with preview swatch. Phase 2. */
export const ColorInput = (_props: ColorInputProps) => {
  // TODO: Phase 2 — TextInput accepting any CSS color format + color preview swatch
  return <View />;
};
