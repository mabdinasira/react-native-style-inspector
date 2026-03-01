import { extractBoxModel } from '@/utils/yogaLayout';

describe('extractBoxModel', () => {
  it('returns zero box model for null style', () => {
    const result = extractBoxModel(null, { width: 100, height: 100 });
    expect(result.margin).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    expect(result.border).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    expect(result.padding).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    expect(result.content).toEqual({ width: 100, height: 100 });
  });

  it('extracts individual margin values', () => {
    const style = { marginTop: 10, marginRight: 20, marginBottom: 30, marginLeft: 40 };
    const result = extractBoxModel(style, { width: 200, height: 200 });
    expect(result.margin).toEqual({ top: 10, right: 20, bottom: 30, left: 40 });
  });

  it('uses shorthand margin when individual values are absent', () => {
    const style = { margin: 15 };
    const result = extractBoxModel(style, { width: 100, height: 100 });
    expect(result.margin).toEqual({ top: 15, right: 15, bottom: 15, left: 15 });
  });

  it('uses marginVertical/marginHorizontal shorthands', () => {
    const style = { marginVertical: 10, marginHorizontal: 20 };
    const result = extractBoxModel(style, { width: 100, height: 100 });
    expect(result.margin).toEqual({ top: 10, right: 20, bottom: 10, left: 20 });
  });

  it('prefers specific over shorthand for margin', () => {
    const style = { margin: 5, marginTop: 10, marginHorizontal: 20 };
    const result = extractBoxModel(style, { width: 100, height: 100 });
    expect(result.margin.top).toBe(10);
    expect(result.margin.right).toBe(20);
    expect(result.margin.bottom).toBe(5);
    expect(result.margin.left).toBe(20);
  });

  it('extracts border widths from shorthand', () => {
    const style = { borderWidth: 2 };
    const result = extractBoxModel(style, { width: 100, height: 100 });
    expect(result.border).toEqual({ top: 2, right: 2, bottom: 2, left: 2 });
  });

  it('prefers individual border widths over shorthand', () => {
    const style = { borderWidth: 1, borderTopWidth: 3 };
    const result = extractBoxModel(style, { width: 100, height: 100 });
    expect(result.border.top).toBe(3);
    expect(result.border.right).toBe(1);
  });

  it('extracts padding values with specificity', () => {
    const style = { padding: 10, paddingTop: 20 };
    const result = extractBoxModel(style, { width: 100, height: 100 });
    expect(result.padding.top).toBe(20);
    expect(result.padding.right).toBe(10);
    expect(result.padding.bottom).toBe(10);
    expect(result.padding.left).toBe(10);
  });

  it('computes content size by subtracting padding and border', () => {
    const style = { padding: 10, borderWidth: 2 };
    const result = extractBoxModel(style, { width: 100, height: 80 });
    expect(result.content).toEqual({ width: 76, height: 56 });
  });

  it('ignores non-number style values', () => {
    const style = { marginTop: 'auto' };
    const result = extractBoxModel(style as Record<string, unknown>, { width: 100, height: 100 });
    expect(result.margin.top).toBe(0);
  });
});
