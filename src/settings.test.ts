import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, LIMIT, SIZE, normalizeSettings } from './settings';

describe('normalizeSettings', () => {
  it('returns defaults for empty storage', () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps stored values and fills missing keys', () => {
    const s = normalizeSettings({ grayscale: true });
    expect(s.grayscale).toBe(true);
    expect(s.limitMinutes).toBe(DEFAULT_SETTINGS.limitMinutes);
  });

  it('clamps out-of-range values', () => {
    const s = normalizeSettings({ sizePercent: 500, limitMinutes: 0 });
    expect(s.sizePercent).toBe(SIZE.max);
    expect(s.limitMinutes).toBe(LIMIT.min);
    expect(normalizeSettings({ sizePercent: 1 }).sizePercent).toBe(SIZE.min);
  });
});
