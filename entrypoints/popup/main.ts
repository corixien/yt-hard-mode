import { browser } from 'wxt/browser';
import { settingsItem, readSettings, usageItem } from '../../src/storage';
import { LIMIT, normalizeSettings, type Language, type Settings } from '../../src/settings';
import { resolveLocale, t, type MessageKey } from '../../src/i18n';
import type { RuntimeMessage } from '../../src/messages';
import { formatHms, todayMs } from '../../src/usage';

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

async function init() {
  let settings = await readSettings();

  const grayscale = byId<HTMLInputElement>('grayscale');
  const timer = byId<HTMLInputElement>('timer');
  const timerSub = byId<HTMLElement>('timerSub');
  const sizePercent = byId<HTMLInputElement>('sizePercent');
  const sizeValue = byId<HTMLOutputElement>('sizeValue');
  const backdrop = byId<HTMLInputElement>('backdrop');
  const limitEnabled = byId<HTMLInputElement>('limitEnabled');
  const limitSub = byId<HTMLElement>('limitSub');
  const limitMinutes = byId<HTMLInputElement>('limitMinutes');
  const limitInfo = byId<HTMLElement>('limitInfo');
  const today = byId<HTMLElement>('today');
  const reset = byId<HTMLButtonElement>('reset');
  const langButtons = document.querySelectorAll<HTMLButtonElement>('#lang button');

  const locale = () => resolveLocale(settings.language, navigator.language);

  function render() {
    grayscale.checked = settings.grayscale;
    timer.checked = settings.timer;
    timerSub.hidden = !settings.timer;
    sizePercent.value = String(settings.sizePercent);
    sizeValue.value = `${settings.sizePercent}%`;
    backdrop.checked = settings.backdrop;
    limitEnabled.checked = settings.limitEnabled;
    limitSub.hidden = !settings.limitEnabled;
    limitMinutes.value = String(settings.limitMinutes);
    langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === settings.language)));

    document.documentElement.lang = locale();
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n as MessageKey, locale());
    });
  }

  function update(patch: Partial<Settings>) {
    settings = normalizeSettings({ ...settings, ...patch });
    void settingsItem.setValue(settings);
    render();
    void refreshToday();
  }

  async function refreshToday() {
    const totalMs = todayMs(await usageItem.getValue());
    today.textContent = formatHms(totalMs);

    if (!settings.limitEnabled) {
      limitInfo.textContent = '';
      return;
    }
    const limitMs = settings.limitMinutes * 60_000;
    limitInfo.textContent =
      totalMs >= limitMs
        ? t('limitReached', locale())
        : t('limitLeft', locale()).replace('{time}', formatHms(limitMs - totalMs));
  }

  grayscale.addEventListener('change', () => update({ grayscale: grayscale.checked }));
  timer.addEventListener('change', () => update({ timer: timer.checked }));
  sizePercent.addEventListener('input', () => {
    sizeValue.value = `${sizePercent.value}%`;
  });
  sizePercent.addEventListener('change', () => update({ sizePercent: Number(sizePercent.value) }));
  backdrop.addEventListener('change', () => update({ backdrop: backdrop.checked }));
  limitEnabled.addEventListener('change', () => update({ limitEnabled: limitEnabled.checked }));
  limitMinutes.addEventListener('change', () =>
    update({ limitMinutes: Math.round(Number(limitMinutes.value)) || LIMIT.min }),
  );
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
