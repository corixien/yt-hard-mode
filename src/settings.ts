export type Language = 'auto' | 'de' | 'en';

export interface Settings {
  grayscale: boolean;
  timer: boolean;
  barHeight: number;
  language: Language;
}

export const DEFAULT_SETTINGS: Settings = {
  grayscale: false,
  timer: true,
  barHeight: 72,
  language: 'auto',
};

export const BAR_HEIGHT = { min: 24, max: 160, step: 2 } as const;
