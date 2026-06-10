export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function metricProgress(
  baseline: number,
  target: number,
  current: number | null,
): { percent: number; delta: number | null; direction: "improving" | "worsening" | "unknown" } {
  if (current === null) {
    return { percent: 0, delta: null, direction: "unknown" };
  }

  const totalChange = baseline - target;
  const currentChange = baseline - current;
  const percent = totalChange === 0 ? 100 : Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
  const delta = current - baseline;
  const direction = current <= baseline ? "improving" : "worsening";

  return { percent, delta, direction };
}
