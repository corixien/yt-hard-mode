import { browser } from 'wxt/browser';
import { settingsItem } from '../src/storage';
import type { RuntimeMessage } from '../src/messages';
import type { Settings } from '../src/settings';
import { createTimerOverlay } from '../src/timer-overlay';
import { formatHms } from '../src/usage';

const TICK_MS = 1000;
const FLUSH_MS = 5000;
const MAX_TICK_GAP_MS = 120_000; // larger gaps mean the tab or machine was suspended

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  runAt: 'document_idle',
  async main() {
    const style = document.createElement('style');
    style.textContent = 'html.yhm-bw { filter: grayscale(1) !important; }';
    document.head.append(style);

    const overlay = createTimerOverlay();
    let settings: Settings = await settingsItem.getValue();
    let base = await send({ type: 'get' });
    let unsent = 0; // ms counted but not yet sent to the background
    let inflight = 0; // ms sent, reply pending
    let lastTick = Date.now();
    let playing = false;
    let video: HTMLVideoElement | null = null;
    let frameId = 0;
    let flushChain: Promise<void> = Promise.resolve();

    function send(message: RuntimeMessage): Promise<number> {
      return browser.runtime.sendMessage(message) as Promise<number>;
    }

    function findVideo() {
      return (
        document.querySelector<HTMLVideoElement>('video.html5-main-video') ??
        document.querySelector<HTMLVideoElement>('video')
      );
    }

    function attachVideo() {
      const next = findVideo();
      if (!next || next === video) return;
      video = next;
      video.addEventListener('play', tick);
      video.addEventListener('pause', tick);
      video.addEventListener('ended', tick);
    }

    function isAdPlaying() {
      return document.querySelector('.ad-showing') !== null;
    }

    function render() {
      const total = base + inflight + unsent;
      const rect = playing && video ? video.getBoundingClientRect() : null;
      overlay.update({
        visible: settings.timer && playing,
        text: formatHms(total),
        height: settings.barHeight,
        rect,
      });
    }

    function frame() {
      render();
      frameId = requestAnimationFrame(frame);
    }

    function tick() {
      attachVideo();
      const now = Date.now();
      if (playing) unsent += Math.min(now - lastTick, MAX_TICK_GAP_MS);
      lastTick = now;
      playing = video !== null && !video.paused && !video.ended && !isAdPlaying();

      if (playing && frameId === 0) frameId = requestAnimationFrame(frame);
      if (!playing && frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
      render();
    }

    function flush(): Promise<void> {
      flushChain = flushChain.then(async () => {
        if (unsent <= 0) return;
        const ms = unsent;
        unsent = 0;
        inflight += ms;
        try {
          base = await send({ type: 'add', ms });
          inflight -= ms;
        } catch {
          // Extension reloaded or background unavailable: keep the time and retry on next flush.
          unsent += ms;
          inflight -= ms;
        }
      });
      return flushChain;
    }

    function applySettings(next: Settings) {
      settings = next;
      document.documentElement.classList.toggle('yhm-bw', next.grayscale);
      render();
    }

    applySettings(settings);
    settingsItem.watch((next) => applySettings(next));
    overlay.mount(document.fullscreenElement ?? document.body);
    document.addEventListener('fullscreenchange', () => {
      overlay.mount(document.fullscreenElement ?? document.body);
    });

    attachVideo();
    setInterval(tick, TICK_MS);
    setInterval(() => void flush(), FLUSH_MS);
    addEventListener('pagehide', () => {
      tick();
      void flush();
    });
  },
});
