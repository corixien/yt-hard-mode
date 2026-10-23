import { defineConfig } from 'wxt';

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: 'YT Hard Mode',
    description: 'Grayscale YouTube and show a big timer for the time you spend watching videos.',
    permissions: ['storage'],
    host_permissions: ['*://*.youtube.com/*'],
    browser_specific_settings: {
      gecko: {
        id: 'yt-hard-mode@corixien.github.io',
        strict_min_version: '128.0',
      },
    },
  },
});
