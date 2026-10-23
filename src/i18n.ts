import type { Language } from './settings';

const de = {
  grayscale: 'Schwarz-Weiß',
  grayscaleHint: 'Ganze YouTube-Seite in Graustufen',
  timer: 'Zeit-Timer',
  timerHint: 'Großer Zähler über dem Video, solange es läuft',
  barHeight: 'Balkenhöhe',
  today: 'Heute gesehen',
  reset: 'Zurücksetzen',
  language: 'Sprache',
  footer: 'Zählt nur laufende Videos auf YouTube, Werbung ausgenommen. Alle Daten bleiben lokal.',
};

export type MessageKey = keyof typeof de;

const en: Record<MessageKey, string> = {
  grayscale: 'Black & white',
  grayscaleHint: 'Whole YouTube page in grayscale',
  timer: 'Time timer',
  timerHint: 'Big counter over the video while it plays',
  barHeight: 'Bar height',
  today: 'Watched today',
  reset: 'Reset',
  language: 'Language',
  footer: 'Counts only playing videos on YouTube, ads excluded. All data stays local.',
};

const messages = { de, en } as const;

export type Locale = keyof typeof messages;

export function resolveLocale(language: Language, browserLanguage: string): Locale {
  if (language !== 'auto') return language;
  return browserLanguage.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function t(key: MessageKey, locale: Locale): string {
  return messages[locale][key];
}
