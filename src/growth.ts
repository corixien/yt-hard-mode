// Time after the daily limit until the clock covers the full video height.
export const GROWTH_MS = 5 * 60_000;

// Height in px. Starts at baseHeight once the limit is hit and grows linearly to
// fullHeight over GROWTH_MS. A larger baseHeight therefore grows more slowly.
export function clockHeight(
  totalMs: number,
  limitMs: number | null,
  baseHeight: number,
  fullHeight: number,
): number {
  if (limitMs === null) return baseHeight;
  const over = totalMs - limitMs;
  if (over <= 0) return baseHeight;
  const progress = Math.min(1, over / GROWTH_MS);
  return baseHeight + (fullHeight - baseHeight) * progress;
}
