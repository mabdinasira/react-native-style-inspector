import type { MeasuredElement } from '../fiber';

export type PanelState = 'bubble' | 'handle' | 'expanded';

export interface FloatingPanelConfig {
  panelState: PanelState;
  screenWidth: number;
  screenHeight: number;
  onTap: () => void;
}

export interface PanelSize {
  width: number;
  height: number;
}

export interface FloatingPanelProps {
  panelState: PanelState;
  selected: MeasuredElement | null;
  matches: MeasuredElement[];
  selectedIndex: number;
  onToggleInspect: () => void;
  onCycleNext: () => void;
  onCyclePrevious: () => void;
  onClose: () => void;
}
