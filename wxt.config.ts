import { defineConfig } from 'wxt';

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: 'YT Hard Mode',
    description: 'Grayscale YouTube and show a big timer for the time you spend watching videos.',
    permissions: ['storage'],
    host_permissions: ['*://*.youtube.com/*'],
    action: {
      default_icon: { 16: 'icon/16.png', 32: 'icon/32.png', 48: 'icon/48.png' },
    },
    browser_specific_settings: {
      gecko: {
        id: 'yt-hard-mode@corixien.github.io',
        strict_min_version: '128.0',
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
});
