import { browser } from 'wxt/browser';
import { settingsItem, usageItem } from '../../src/storage';
import { type Language, type Settings } from '../../src/settings';
import { resolveLocale, t, type MessageKey } from '../../src/i18n';
import type { RuntimeMessage } from '../../src/messages';
import { formatHms, todayMs } from '../../src/usage';

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

async function init() {
  let settings = await settingsItem.getValue();

  const grayscale = byId<HTMLInputElement>('grayscale');
  const timer = byId<HTMLInputElement>('timer');
  const barHeight = byId<HTMLInputElement>('barHeight');
  const barValue = byId<HTMLOutputElement>('barValue');
  const barSub = byId<HTMLElement>('barSub');
  const today = byId<HTMLElement>('today');
  const reset = byId<HTMLButtonElement>('reset');
  const langButtons = document.querySelectorAll<HTMLButtonElement>('#lang button');

  const locale = () => resolveLocale(settings.language, navigator.language);

  function render() {
    grayscale.checked = settings.grayscale;
    timer.checked = settings.timer;
    barHeight.value = String(settings.barHeight);
    barValue.value = `${settings.barHeight}px`;
    barSub.hidden = !settings.timer;
    langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === settings.language)));

    document.documentElement.lang = locale();
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n as MessageKey, locale());
    });
  }

  function update(patch: Partial<Settings>) {
    settings = { ...settings, ...patch };
    void settingsItem.setValue(settings);
    render();
  }

  async function refreshToday() {
    today.textContent = formatHms(todayMs(await usageItem.getValue()));
  }

  grayscale.addEventListener('change', () => update({ grayscale: grayscale.checked }));
  timer.addEventListener('change', () => update({ timer: timer.checked }));
  barHeight.addEventListener('input', () => {
    barValue.value = `${barHeight.value}px`;
  });
  barHeight.addEventListener('change', () => update({ barHeight: Number(barHeight.value) }));
  langButtons.forEach((b) =>
    b.addEventListener('click', () => update({ language: b.dataset.lang as Language })),
  );
  reset.addEventListener('click', async () => {
    await browser.runtime.sendMessage({ type: 'reset' } satisfies RuntimeMessage);
    await refreshToday();
  });

  render();
  await refreshToday();
  setInterval(refreshToday, 1000);
}

void init();
