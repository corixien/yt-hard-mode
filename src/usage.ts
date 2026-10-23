export interface Usage {
  date: string;
  ms: number;
}

const dayKey = (now: Date) => now.toLocaleDateString('en-CA');

export function todayMs(usage: Usage, now: Date = new Date()): number {
  return usage.date === dayKey(now) ? usage.ms : 0;
}

export function addMs(usage: Usage, ms: number, now: Date = new Date()): Usage {
  return { date: dayKey(now), ms: todayMs(usage, now) + ms };
}

export function resetUsage(now: Date = new Date()): Usage {
  return { date: dayKey(now), ms: 0 };
}

export function formatHms(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}
