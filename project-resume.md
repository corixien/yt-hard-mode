# Project Resume

> Instruction for Claude: read this whole file first. Then read every file under "Must read before any change". Do not modify anything until you have fully understood the project. Keep this file updated as you work (see "Maintenance rules").

Last updated: 2026-10-25 12:00

## 1. What this project is
YT Hard Mode: browser extension for Firefox and Chromium (Brave, Chrome, Edge). Grayscales the whole YouTube page and shows a big `HH:MM:SS` watch-time timer over the video. Settings popup opens from the toolbar icon. DE/EN. Stack: WXT + TypeScript, Manifest V3, Vitest. Public repo `corixien/yt-hard-mode`, MIT. No network calls, no accounts; data in `storage.local`.

## 2. Must read before any change
1. `CLAUDE.md` - agent notes, commands, invariants
2. `wxt.config.ts` - manifest, permissions, Firefox gecko id
3. `entrypoints/youtube.content.ts` - timing logic, grayscale class, overlay wiring
4. `entrypoints/background.ts` - single writer for daily usage (queue)
5. `src/usage.ts` - day rollover and HH:MM:SS formatting
6. `src/timer-overlay.ts` - shadow-DOM band, fixed-position offset correction

## 3. How to navigate
- `entrypoints/` - WXT entrypoints: `background.ts`, `youtube.content.ts`, `popup/` (index.html, main.ts, style.css)
- `src/` - shared logic: `settings.ts` (types, defaults), `storage.ts` (wxt storage items), `usage.ts` (+ test), `i18n.ts` (+ test), `timer-overlay.ts`, `messages.ts` (runtime message types)
- `wxt.config.ts` - manifest; `vitest.config.ts`; `tsconfig.json` extends generated `.wxt/tsconfig.json`
- Lookup:
  - timer math / daily reset -> `src/usage.ts`, `entrypoints/background.ts`
  - what counts as watching (ads, play state) -> `entrypoints/youtube.content.ts` (`tick`, `isAdPlaying`)
  - overlay size/position -> `src/timer-overlay.ts`
  - settings UI and labels -> `entrypoints/popup/`, `src/i18n.ts`
- Data flow: content script counts ms while video plays -> `browser.runtime.sendMessage({type:'add'})` every 5 s and on pagehide -> background adds to `local:usage` -> reply = today's total -> content updates display. Popup reads `local:usage` every 1 s, writes `local:settings`; content watches settings.

## 4. Commands
Run from repo root (`/home/mateo/yt-hard-mode`). Node 22+.
- `npm install`
- `npm run dev` / `npm run dev:firefox` - dev builds with reload
- `npm run check` - typecheck + tests + both production builds (run before commit)
- `npm test` - Vitest
- `npm run build` -> `.output/chrome-mv3`; `npm run build:firefox` -> `.output/firefox-mv3`
- `npm run zip` / `npm run zip:firefox` - release zips in `.output/`
- No deploy, no production systems.

## 5. Invariants and gotchas
- Only background writes `local:usage` (serialized queue prevents cross-tab overwrites). Don't write it from content/popup.
- Count only while video plays and `.ad-showing` is absent. Tab visibility does NOT matter (user choice).
- Gap cap `MAX_TICK_GAP_MS` (120 s) prevents counting suspend gaps.
- Grayscale is `filter` on `<html>`. This makes `position: fixed` relative to html, so `timer-overlay.ts` measures and corrects the offset. Don't remove that correction.
- Overlay mounts into `document.fullscreenElement ?? body` so it stays visible in fullscreen.
- Manifest is MV3 for both targets (`manifestVersion: 3` in wxt.config). Firefox gecko id: `yt-hard-mode@corixien.github.io`.
- Only host permission: `*://*.youtube.com/*`. Keep it that way.
- Not verified in a live browser yet: timing accuracy in background tabs (Chrome throttles timers to 1/min after 5 min hidden; ticks are coarser, pause events still fire).

## 6. Current state
- Branch: `main`. Tags `v1.0.0` and `v1.1.0` (v1.1.0 = daily limit growth, size %, backdrop toggle). Releases with chrome and firefox zips.
- Working tree: all v1 files new (see Done). Not yet committed/pushed unless `git log` shows it.
- Goal of current task: v1 for Chromium and Firefox, all changes on `main`, tag `v1.0.0`.

### Done
- [x] Milestones 1-5 implemented: WXT skeleton, timer + overlay, grayscale, DE/EN, settings popup with bar height slider, daily reset
- [x] Unit tests (`src/usage.test.ts`, `src/i18n.test.ts`) pass; typecheck clean; both builds succeed
- [x] README (install steps), LICENSE (MIT), CLAUDE.md

### In progress
- [ ] Live-browser manual test (not done)

### Next steps
1. Manual test in Brave and Firefox on youtube.com (not done): timer appears while playing, hides on pause, grayscale toggles, reset works.

### Open questions / blockers
- Ads: default assumed "not counted" (not explicitly answered).
- Size default 12% of video height, slider 5-100%; limit default 60 min, on. Assumed.
- License MIT and copyright "corixien": assumed, user did not confirm.
- Store publishing: not planned (user: local install only).

## 7. Decisions log
- 2026-10-23 - WXT + TypeScript, MV3 for both browsers - one codebase for Firefox and Chromium, hot reload.
- 2026-10-23 - Repo `corixien/yt-hard-mode` public, default branch `main`.
- 2026-10-23 - Daily reset at midnight with manual reset; count playing video in any tab including background; timer visible only during playback; Shorts and embeds included.
- 2026-10-23 - Settings in toolbar popup (not options page); language auto + manual DE/EN; theme follows system.
- 2026-10-23 - Own i18n dict (not `_locales`) so the popup can switch language without browser restart.

## 8. Resume prompt
Paste this into a new session:
> Read project-resume.md in this project fully. Read every file it lists under "Must read before any change". Then continue from "Current state". Do not change anything before you have understood the project. Keep project-resume.md updated.
