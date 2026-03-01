import type { FiberNode, MeasuredElement } from '@/fiber';
import { hitTest } from '@/utils/hitTest';

const makeElement = (
  overrides: Partial<MeasuredElement> & { x: number; y: number; width: number; height: number },
): MeasuredElement => ({
  fiber: {} as FiberNode,
  depth: 0,
  zIndex: 0,
  componentName: 'View',
  ...overrides,
});

describe('hitTest', () => {
  it('returns empty array when no elements match', () => {
    const snapshot = [makeElement({ x: 100, y: 100, width: 50, height: 50 })];
    expect(hitTest(snapshot, 0, 0)).toEqual([]);
  });

  it('returns matching element when tap is inside bounds', () => {
    const element = makeElement({ x: 10, y: 10, width: 100, height: 100 });
    const result = hitTest([element], 50, 50);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(element);
  });

  it('includes elements when tap is on the edge', () => {
    const element = makeElement({ x: 10, y: 10, width: 100, height: 100 });
    expect(hitTest([element], 10, 10)).toHaveLength(1);
    expect(hitTest([element], 110, 110)).toHaveLength(1);
  });

  it('skips zero-size elements', () => {
    const zeroWidth = makeElement({ x: 0, y: 0, width: 0, height: 100 });
    const zeroHeight = makeElement({ x: 0, y: 0, width: 100, height: 0 });
    expect(hitTest([zeroWidth, zeroHeight], 0, 0)).toEqual([]);
  });

  it('sorts results by area ascending (smallest first)', () => {
    const large = makeElement({ x: 0, y: 0, width: 200, height: 200, componentName: 'Large' });
    const small = makeElement({ x: 0, y: 0, width: 50, height: 50, componentName: 'Small' });
    const medium = makeElement({ x: 0, y: 0, width: 100, height: 100, componentName: 'Medium' });

    const result = hitTest([large, small, medium], 25, 25);
    expect(result).toHaveLength(3);
    expect(result[0].componentName).toBe('Small');
    expect(result[1].componentName).toBe('Medium');
    expect(result[2].componentName).toBe('Large');
  });

  it('returns empty array for empty snapshot', () => {
    expect(hitTest([], 50, 50)).toEqual([]);
  });

  it('excludes elements that do not contain the tap point', () => {
    const inside = makeElement({ x: 0, y: 0, width: 100, height: 100, componentName: 'Inside' });
    const outside = makeElement({
      x: 200,
      y: 200,
      width: 50,
      height: 50,
      componentName: 'Outside',
    });

    const result = hitTest([inside, outside], 50, 50);
    expect(result).toHaveLength(1);
    expect(result[0].componentName).toBe('Inside');
  });
});
