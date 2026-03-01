import { formatValue, isColorProp } from '@/utils/styleFormatting';

describe('isColorProp', () => {
  it('returns true for known color properties', () => {
    expect(isColorProp('color')).toBe(true);
    expect(isColorProp('backgroundColor')).toBe(true);
    expect(isColorProp('borderColor')).toBe(true);
    expect(isColorProp('shadowColor')).toBe(true);
    expect(isColorProp('tintColor')).toBe(true);
    expect(isColorProp('textDecorationColor')).toBe(true);
    expect(isColorProp('borderTopColor')).toBe(true);
    expect(isColorProp('outlineColor')).toBe(true);
  });

  it('returns false for non-color properties', () => {
    expect(isColorProp('fontSize')).toBe(false);
    expect(isColorProp('flex')).toBe(false);
    expect(isColorProp('margin')).toBe(false);
    expect(isColorProp('width')).toBe(false);
  });
});

describe('formatValue', () => {
  it('formats undefined', () => {
    expect(formatValue(undefined)).toBe('undefined');
  });

  it('formats null', () => {
    expect(formatValue(null)).toBe('null');
  });

  it('formats numbers', () => {
    expect(formatValue(42)).toBe('42');
    expect(formatValue(0)).toBe('0');
    expect(formatValue(3.14)).toBe('3.14');
  });

  it('formats strings with quotes', () => {
    expect(formatValue('hello')).toBe('"hello"');
    expect(formatValue('#FF0000')).toBe('"#FF0000"');
  });

  it('formats booleans', () => {
    expect(formatValue(true)).toBe('true');
    expect(formatValue(false)).toBe('false');
  });

  it('formats objects as JSON', () => {
    expect(formatValue({ width: 10 })).toBe('{"width":10}');
  });

  it('formats arrays as JSON', () => {
    expect(formatValue([1, 2, 3])).toBe('[1,2,3]');
  });
});
