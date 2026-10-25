import type { Language } from './settings';

const de = {
  grayscale: 'Schwarz-Weiß',
  grayscaleHint: 'Ganze YouTube-Seite in Graustufen',
  timer: 'Zeit-Timer',
  timerHint: 'Großer Zähler über dem Video, solange es läuft',
  size: 'Größe',
  backdrop: 'Abdunkelung hinter der Zeit',
  limit: 'Tageslimit',
  limitHint: 'Danach wächst die Zeit in 5 Min. über den ganzen Screen',
  limitMinutes: 'Minuten pro Tag',
  limitLeft: 'Noch {time} bis zum Limit',
  limitReached: 'Limit erreicht, die Zeit wächst',
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
  size: 'Size',
  backdrop: 'Dark backdrop behind the time',
  limit: 'Daily limit',
  limitHint: 'After that the time grows over the whole screen within 5 min',
  limitMinutes: 'Minutes per day',
  limitLeft: '{time} left until limit',
  limitReached: 'Limit reached, the clock is growing',
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
