import { describe, expect, it } from 'vitest';
import { resolveLocale, t, type MessageKey } from './i18n';

describe('i18n', () => {
  it('follows browser language in auto mode', () => {
    expect(resolveLocale('auto', 'de-DE')).toBe('de');
    expect(resolveLocale('auto', 'fr-FR')).toBe('en');
  });

  it('uses explicit language over browser language', () => {
    expect(resolveLocale('en', 'de-DE')).toBe('en');
    expect(resolveLocale('de', 'en-US')).toBe('de');
  });

  it('has non-empty text for every key in both locales', () => {
    const keys: MessageKey[] = [
      'grayscale', 'timer', 'size', 'backdrop', 'limit', 'limitHint', 'limitMinutes',
      'limitLeft', 'limitReached', 'today', 'reset', 'language', 'footer',
    ];
    for (const key of keys) {
      expect(t(key, 'de')).not.toBe('');
      expect(t(key, 'en')).not.toBe('');
    }
  });
});
