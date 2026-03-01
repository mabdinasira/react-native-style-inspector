import { parseInput, toEditableString } from '@/utils/styleInputParsing';

describe('parseInput', () => {
  it('returns original value for empty input', () => {
    expect(parseInput('', 42)).toBe(42);
    expect(parseInput('  ', 'hello')).toBe('hello');
  });

  it('strips surrounding double quotes', () => {
    expect(parseInput('"hello"', 'original')).toBe('hello');
  });

  it('strips surrounding single quotes', () => {
    expect(parseInput("'hello'", 'original')).toBe('hello');
  });

  it('coerces to number when original was number', () => {
    expect(parseInput('42', 10)).toBe(42);
    expect(parseInput('3.14', 0)).toBe(3.14);
    expect(parseInput('-5', 0)).toBe(-5);
  });

  it('does not coerce to number when original was string', () => {
    expect(parseInput('42', 'original')).toBe('42');
  });

  it('returns string when number parse fails and original was number', () => {
    expect(parseInput('abc', 10)).toBe('abc');
  });

  it('parses boolean true', () => {
    expect(parseInput('true', 'anything')).toBe(true);
  });

  it('parses boolean false', () => {
    expect(parseInput('false', 'anything')).toBe(false);
  });

  it('parses JSON arrays (e.g. transform)', () => {
    const transform = [{ scale: 1 }, { perspective: 1000 }];
    expect(parseInput('[{"scale":1},{"perspective":1000}]', transform)).toEqual(transform);
  });

  it('parses JSON objects', () => {
    expect(parseInput('{"flex":1}', {})).toEqual({ flex: 1 });
  });

  it('returns string for invalid JSON starting with [ or {', () => {
    expect(parseInput('[not json', 'original')).toBe('[not json');
  });

  it('returns trimmed string for everything else', () => {
    expect(parseInput('  #FF0000  ', '#000')).toBe('#FF0000');
    expect(parseInput('bold', 'normal')).toBe('bold');
  });
});

describe('toEditableString', () => {
  it('returns empty string for undefined', () => {
    expect(toEditableString(undefined)).toBe('');
  });

  it('returns empty string for null', () => {
    expect(toEditableString(null)).toBe('');
  });

  it('converts number to string', () => {
    expect(toEditableString(42)).toBe('42');
  });

  it('converts string value as-is', () => {
    expect(toEditableString('hello')).toBe('hello');
  });

  it('converts boolean to string', () => {
    expect(toEditableString(true)).toBe('true');
    expect(toEditableString(false)).toBe('false');
  });

  it('JSON-stringifies arrays', () => {
    const transform = [{ scale: 1 }, { rotateY: '0deg' }];
    expect(toEditableString(transform)).toBe('[{"scale":1},{"rotateY":"0deg"}]');
  });

  it('JSON-stringifies objects', () => {
    expect(toEditableString({ flex: 1 })).toBe('{"flex":1}');
  });
});
