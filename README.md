# YT Hard Mode

Browser extension for Firefox and Chromium browsers (Brave, Chrome, Edge). Makes YouTube harder to waste time on:

- **Black & white:** grayscales the whole YouTube page.
- **Time timer:** big white `HH:MM:SS` counter over the video while it plays. Counts the time you have videos playing in this browser, ads excluded. Resets daily at midnight; manual reset in the popup. Bar height is adjustable.
- **Settings popup:** opens from the toolbar icon. English and German, dark or light depending on system.

All data stays in the browser (`storage.local`). No network calls, no accounts.

## Install (v1, from source or release zip)

Requires Node 22+ to build. Skip the build if you use a release zip.

```bash
git clone git@github.com:corixien/yt-hard-mode.git
cd yt-hard-mode
npm install
```

### Brave / Chrome / Edge

```bash
npm run build
```

1. Open `brave://extensions` (or `chrome://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select `.output/chrome-mv3`.

### Firefox

```bash
npm run build:firefox
```

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select `.output/firefox-mv3/manifest.json`.

Temporary add-ons are removed on Firefox restart. Load it again, or sign it (see below) for a permanent install.

### Permanent Firefox install (optional)

Sign as an unlisted add-on via [addons.mozilla.org](https://addons.mozilla.org/developers/) (free, needs a Firefox account), then install the signed `.xpi`.

## Development

```bash
npm run dev            # Chromium dev build with reload
npm run dev:firefox    # Firefox dev build with reload
npm run check          # typecheck, tests, both production builds
npm run zip            # release zip for Chromium
npm run zip:firefox    # release zip for Firefox
```

Stack: [WXT](https://wxt.dev), TypeScript, Manifest V3, Vitest.

## License

MIT
