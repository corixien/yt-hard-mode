export type Language = 'auto' | 'de' | 'en';

export interface Settings {
  grayscale: boolean;
  timer: boolean;
  sizePercent: number; // clock height as % of the video height
  backdrop: boolean; // dark band behind the clock
  limitEnabled: boolean;
  limitMinutes: number; // daily watch time after which the clock starts growing
  language: Language;
}

export const DEFAULT_SETTINGS: Settings = {
  grayscale: false,
  timer: true,
  sizePercent: 12,
  backdrop: true,
  limitEnabled: true,
  limitMinutes: 60,
  language: 'auto',
};

export const SIZE = { min: 5, max: 100, step: 1 } as const;
export const LIMIT = { min: 1, max: 720, step: 1 } as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

// Stored objects can miss keys added in newer versions, so merge over defaults and clamp.
export function normalizeSettings(raw: Partial<Settings> | null | undefined): Settings {
  const merged = { ...DEFAULT_SETTINGS, ...raw };
  return {
    ...merged,
    sizePercent: clamp(merged.sizePercent, SIZE.min, SIZE.max),
    limitMinutes: clamp(merged.limitMinutes, LIMIT.min, LIMIT.max),
  };
}
