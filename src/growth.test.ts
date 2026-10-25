import { describe, expect, it } from 'vitest';
import { GROWTH_MS, clockHeight } from './growth';

const LIMIT = 60 * 60_000;

describe('clockHeight', () => {
  it('stays at base size without a limit', () => {
    expect(clockHeight(10 * LIMIT, null, 100, 720)).toBe(100);
  });

  it('stays at base size below the limit', () => {
    expect(clockHeight(LIMIT - 1, LIMIT, 100, 720)).toBe(100);
  });

  it('grows linearly after the limit', () => {
    expect(clockHeight(LIMIT + GROWTH_MS / 2, LIMIT, 100, 720)).toBeCloseTo(410);
  });

  it('caps at full height', () => {
    expect(clockHeight(LIMIT + GROWTH_MS, LIMIT, 100, 720)).toBe(720);
    expect(clockHeight(LIMIT + 10 * GROWTH_MS, LIMIT, 100, 720)).toBe(720);
  });

  it('grows more slowly from a larger base', () => {
    const small = clockHeight(LIMIT + GROWTH_MS / 2, LIMIT, 50, 720);
    const large = clockHeight(LIMIT + GROWTH_MS / 2, LIMIT, 400, 720);
    expect(large - 400).toBeLessThan(small - 50);
  });
});
