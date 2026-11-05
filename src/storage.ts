import { storage } from 'wxt/utils/storage';
import { DEFAULT_SETTINGS, normalizeSettings, type Settings } from './settings';
import type { Usage } from './usage';

// Settings follow the browser account (storage.sync).
export const settingsItem = storage.defineItem<Settings>('sync:settings', {
  fallback: DEFAULT_SETTINGS,
});

export const readSettings = async () => normalizeSettings(await settingsItem.getValue());

// This device's own day counter. Source of truth; mirrored to sync as usage:<deviceId>.
export const usageItem = storage.defineItem<Usage>('local:usage', {
  fallback: { date: '', ms: 0 },
});

// Random id per browser profile, so each device owns one sync entry.
export const deviceIdItem = storage.defineItem<string>('local:deviceId', {
  fallback: '',
});
