/** Chrome DevTools-style box model colors */
export const BOX_MODEL_COLORS = {
  margin: 'rgba(246, 178, 107, 0.4)',
  marginLabel: '#F6B26B',
  border: 'rgba(255, 217, 102, 0.3)',
  borderLabel: '#FFD966',
  padding: 'rgba(147, 196, 125, 0.4)',
  paddingLabel: '#6AA84F',
  content: 'rgba(79, 195, 247, 0.3)',
  contentLabel: '#4A90D9',
  outline: '#4FC3F7',
} as const;

/** VS Code-style syntax colors for the editable style property list */
export const EDITABLE_VALUE_COLORS = {
  key: { text: '#9CDCFE', underline: 'rgba(156, 220, 254, 0.4)' },
  value: { text: '#CE9178', underline: 'rgba(206, 145, 120, 0.4)' },
} as const;
