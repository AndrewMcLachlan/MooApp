import { describe, it, expect } from 'vitest';
import { computePillFit } from '../ComboBoxPills';

describe('computePillFit', () => {
  it('keeps every pill when they all fit', () => {
    // 100 + 10 + 100 = 210 exactly
    expect(computePillFit([100, 100], 210, 10, 0)).toBe(2);
  });

  it('tolerates sub-pixel rounding at the exact boundary', () => {
    // Integer-rounded pill widths sum to 251 while the fractional available
    // width is 250.5 — a content-hugged control lands here and must not
    // collapse into the "+N more" chip.
    expect(computePillFit([84, 84, 83], 250.5, 0, 0)).toBe(3);
  });

  it('reserves room for the input while the dropdown is open', () => {
    // All would fit closed (200 <= 200), but the open input reserve pushes
    // the row into chip mode.
    expect(computePillFit([95, 95], 200, 10, 110)).toBeLessThan(2);
  });

  it('drops overflowing pills behind the chip, keeping the ones that fit', () => {
    // total 100+10+100+10+100 = 320 > 240; chip reserve 56+10 leaves the
    // first pill (100 + 66 <= 240) and the second (210 + 66 > 240 breaks).
    expect(computePillFit([100, 100, 100], 240, 10, 0)).toBe(1);
  });

  it('never collapses to zero pills — the first pill always shows', () => {
    expect(computePillFit([300], 100, 10, 0)).toBe(1);
    expect(computePillFit([300, 300], 100, 10, 0)).toBe(1);
  });

  it('returns zero only for an empty pill list', () => {
    expect(computePillFit([], 240, 10, 0)).toBe(0);
  });
});
