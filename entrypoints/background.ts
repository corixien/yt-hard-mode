import { browser } from 'wxt/browser';
import { usageItem } from '../src/storage';
import type { RuntimeMessage } from '../src/messages';
import { addMs, resetUsage, todayMs } from '../src/usage';

export default defineBackground(() => {
  // Serialize writes so increments from several tabs cannot overwrite each other.
  let queue: Promise<unknown> = Promise.resolve();

  browser.runtime.onMessage.addListener((message: RuntimeMessage) => {
    const result = queue.then(async () => {
      const now = new Date();
      const usage = await usageItem.getValue();
      switch (message.type) {
        case 'get':
          return todayMs(usage, now);
        case 'add': {
          if (!Number.isFinite(message.ms) || message.ms <= 0) return todayMs(usage, now);
          const next = addMs(usage, message.ms, now);
          await usageItem.setValue(next);
          return next.ms;
        }
        case 'reset':
          await usageItem.setValue(resetUsage(now));
          return 0;
      }
    });
    queue = result.catch(() => undefined);
    return result;
  });
});
