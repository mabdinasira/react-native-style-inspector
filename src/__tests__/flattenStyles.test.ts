import { flattenStyles } from '@/utils/flattenStyles';

// Mock StyleSheet.flatten since we're not in an RN environment
jest.mock('react-native', () => ({
  StyleSheet: {
    flatten: (style: unknown) => {
      if (!style) return undefined;
      if (Array.isArray(style)) return Object.assign({}, ...style);
      return style;
    },
  },
}));

describe('flattenStyles', () => {
  it('returns null for falsy input', () => {
    expect(flattenStyles(null)).toBeNull();
    expect(flattenStyles(undefined)).toBeNull();
    expect(flattenStyles(0)).toBeNull();
    expect(flattenStyles('')).toBeNull();
  });

  it('flattens a plain style object', () => {
    const style = { flex: 1, backgroundColor: 'red' };
    expect(flattenStyles(style)).toEqual({ flex: 1, backgroundColor: 'red' });
  });

  it('flattens an array of style objects', () => {
    const result = flattenStyles([{ flex: 1 }, { backgroundColor: 'red' }]);
    expect(result).toEqual({ flex: 1, backgroundColor: 'red' });
  });

  it('later styles override earlier ones in arrays', () => {
    const result = flattenStyles([{ backgroundColor: 'red' }, { backgroundColor: 'blue' }]);
    expect(result).toEqual({ backgroundColor: 'blue' });
  });
});
