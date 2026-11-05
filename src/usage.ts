export interface Usage {
  date: string;
  ms: number;
}

export const todayKey = (now: Date = new Date()) => now.toLocaleDateString('en-CA');

export function todayMs(usage: Usage, now: Date = new Date()): number {
  return usage.date === todayKey(now) ? usage.ms : 0;
}

// Sum of all entries that belong to today (one entry per device).
export function sumToday(entries: Usage[], now: Date = new Date()): number {
  const key = todayKey(now);
  return entries.reduce((sum, e) => (e.date === key ? sum + e.ms : sum), 0);
}

export function addMs(usage: Usage, ms: number, now: Date = new Date()): Usage {
  return { date: todayKey(now), ms: todayMs(usage, now) + ms };
}

export function resetUsage(now: Date = new Date()): Usage {
  return { date: todayKey(now), ms: 0 };
}

export function formatHms(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}
