import { FLOATING_PANEL } from '../constants/ui';
import type { PanelSize, PanelState } from './types';

export const getPanelSize = (panelState: PanelState): PanelSize => {
  switch (panelState) {
    case 'bubble':
      return { width: FLOATING_PANEL.BUBBLE_SIZE, height: FLOATING_PANEL.BUBBLE_SIZE };
    case 'handle':
      return { width: FLOATING_PANEL.HANDLE_WIDTH, height: FLOATING_PANEL.HANDLE_HEIGHT };
    case 'expanded':
      return { width: FLOATING_PANEL.PANEL_WIDTH, height: FLOATING_PANEL.PANEL_HEIGHT };
  }
};
