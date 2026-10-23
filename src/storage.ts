import { storage } from 'wxt/utils/storage';
import { DEFAULT_SETTINGS, type Settings } from './settings';
import type { Usage } from './usage';

export const settingsItem = storage.defineItem<Settings>('local:settings', {
  fallback: DEFAULT_SETTINGS,
});

export const usageItem = storage.defineItem<Usage>('local:usage', {
  fallback: { date: '', ms: 0 },
});
