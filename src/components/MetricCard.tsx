"use client";

import { metricProgress } from "@/lib/utils";

interface MetricCardProps {
  metricName: string;
  baseline: number;
  target: number;
  current: number | null;
  convictionStatement: string;
}

export function MetricCard({
  metricName,
  baseline,
  target,
  current,
  convictionStatement,
}: MetricCardProps) {
  const { percent, delta, direction } = metricProgress(baseline, target, current);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Outcome Metric
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{metricName}</h2>
        </div>
        {current !== null && (
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              direction === "improving"
                ? "bg-emerald-50 text-emerald-700"
                : direction === "worsening"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {current} min
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Baseline</p>
          <p className="text-lg font-semibold text-slate-900">{baseline}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 p-3">
          <p className="text-xs text-indigo-600">Current</p>
          <p className="text-lg font-semibold text-indigo-900">{current ?? "—"}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="text-xs text-emerald-600">Target</p>
          <p className="text-lg font-semibold text-emerald-900">{target}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm text-slate-600">
          <span>Progress to target</span>
          <span>{current !== null ? `${Math.round(percent)}%` : "No data"}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        {delta !== null && (
          <p className="mt-2 text-sm text-slate-500">
            {delta <= 0
              ? `${Math.abs(delta)} min improvement from baseline`
              : `${delta} min above baseline — needs attention`}
          </p>
        )}
      </div>

      <blockquote className="mt-6 border-l-4 border-indigo-200 pl-4 text-sm italic text-slate-600">
        {convictionStatement}
      </blockquote>
    </section>
  );
}
