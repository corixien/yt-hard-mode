# YT Hard Mode: agent notes

Browser extension (WXT, TypeScript, MV3) for Firefox and Chromium. Grayscale YouTube + watch-time timer.

## Commands
- `npm run check`: typecheck, tests, both builds. Run before commit.
- `npm test`: Vitest, pure logic in `src/*.test.ts`.
- `npm run dev` / `npm run dev:firefox`: dev builds.

## Layout
- `entrypoints/youtube.content.ts`: timing, grayscale class, overlay, limit growth. Runs on youtube.com.
- `src/growth.ts`: clock height after daily limit (linear, 5 min to full).
- `entrypoints/background.ts`: single writer for daily usage (serialized queue).
- `entrypoints/popup/`: settings UI.
- `src/`: shared pure logic (`usage`, `i18n`, `settings`), storage items, overlay.

## Invariants
- Only the background writes `local:usage`. Content script and popup send messages.
- Counted time = video playing, not ad (`.ad-showing`), any tab visibility.
- Clock size: `sizePercent` of video height is the base; growth from `clockHeight` in `src/growth.ts`. Slider max = full video height.
- No network calls, no analytics, no external hosts beyond `*://*.youtube.com/*`.
- Git: all work on `main`, push directly.
