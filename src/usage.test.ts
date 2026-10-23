import { describe, expect, it } from 'vitest';
import { addMs, formatHms, resetUsage, todayMs } from './usage';

const day1 = new Date(2026, 9, 23, 12);
const day2 = new Date(2026, 9, 24, 0, 5);

describe('usage', () => {
  it('accumulates within the same day', () => {
    const u = addMs(addMs({ date: '', ms: 0 }, 1000, day1), 2500, day1);
    expect(todayMs(u, day1)).toBe(3500);
  });

  it('starts from zero when the day changes', () => {
    const u = addMs({ date: '2026-10-23', ms: 60_000 }, 1000, day2);
    expect(todayMs(u, day2)).toBe(1000);
  });

  it('resets to zero', () => {
    expect(todayMs(resetUsage(day1), day1)).toBe(0);
  });

  it('formats HH:MM:SS', () => {
    expect(formatHms(0)).toBe('00:00:00');
    expect(formatHms(3_723_999)).toBe('01:02:03');
  });
});
