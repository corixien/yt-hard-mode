import { browser } from 'wxt/browser';
import { deviceIdItem, usageItem } from '../src/storage';
import type { RuntimeMessage } from '../src/messages';
import { addMs, resetUsage, sumToday, todayKey, type Usage } from '../src/usage';

// Each device publishes its absolute day total under usage:<deviceId> in storage.sync.
const PREFIX = 'usage:';

export default defineBackground(() => {
  // Serialize writes so increments from several tabs cannot overwrite each other.
  let queue: Promise<unknown> = Promise.resolve();

  async function deviceId(): Promise<string> {
    let id = await deviceIdItem.getValue();
    if (!id) {
      id = crypto.randomUUID();
      await deviceIdItem.setValue(id);
    }
    return id;
  }

  // Other devices' entries. Sync failure degrades to this device only.
  async function otherEntries(own: string): Promise<Usage[]> {
    try {
      const all = await browser.storage.sync.get(null);
      return Object.entries(all)
        .filter(([key]) => key.startsWith(PREFIX) && key !== PREFIX + own)
        .map(([, value]) => value as Usage);
    } catch {
      return [];
    }
  }

  // Writes this device's absolute total and removes other devices' entries from previous days.
  async function publish(own: string, usage: Usage, now: Date) {
    const all = await browser.storage.sync.get(null);
    const stale = Object.entries(all)
      .filter(([key, value]) => key.startsWith(PREFIX) && key !== PREFIX + own && (value as Usage).date !== todayKey(now))
      .map(([key]) => key);
    await browser.storage.sync.set({ [PREFIX + own]: usage });
    if (stale.length) await browser.storage.sync.remove(stale);
  }

  async function combinedTotal(own: string, local: Usage, now: Date): Promise<number> {
    const others = await otherEntries(own);
    return sumToday([local, ...others], now);
  }

  browser.runtime.onMessage.addListener((message: RuntimeMessage) => {
    const result = queue.then(async () => {
      const now = new Date();
      const own = await deviceId();
      const local = await usageItem.getValue();

      switch (message.type) {
        case 'get':
          return combinedTotal(own, local, now);
        case 'add': {
          if (!Number.isFinite(message.ms) || message.ms <= 0) {
            return combinedTotal(own, local, now);
          }
          const next = addMs(local, message.ms, now);
          await usageItem.setValue(next);
          await publish(own, next, now).catch(() => undefined); // retried on next flush
          return combinedTotal(own, next, now);
        }
        case 'reset': {
          const next = resetUsage(now);
          await usageItem.setValue(next);
          await publish(own, next, now).catch(() => undefined);
          return combinedTotal(own, next, now);
        }
      }
    });
    queue = result.catch(() => undefined);
    return result;
  });
});
