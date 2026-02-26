import { View } from 'react-native';

export interface HighlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  margin?: { top: number; right: number; bottom: number; left: number };
}

interface ElementHighlighterProps {
  rect: HighlightRect | null;
}

/** Draws a colored highlight overlay on the selected element. */
export const ElementHighlighter = ({ rect }: ElementHighlighterProps) => {
  if (!rect) return null;

  // TODO: Draw margin (orange), padding (green), content (blue) boxes
  return (
    <View
      pointerEvents='none'
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        borderWidth: 1,
        borderColor: '#4A90D9',
        backgroundColor: 'rgba(74, 144, 217, 0.15)',
      }}
    />
  );
};
