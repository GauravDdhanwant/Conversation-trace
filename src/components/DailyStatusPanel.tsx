"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import type { DailyUpdate } from "@/lib/db/schema";

interface DailyStatusPanelProps {
  projectId: string;
  updates: DailyUpdate[];
  onGenerated: () => void;
}

export function DailyStatusPanel({ projectId, updates, onGenerated }: DailyStatusPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateStatus() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/daily-status`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate status");
      }
      onGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const latest = updates[0];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Daily Status</h2>
          <p className="mt-1 text-sm text-slate-500">
            One-click draft from project state. Non-negotiable every working day.
          </p>
        </div>
        <button
          onClick={generateStatus}
          disabled={loading}
          className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Today's Update"}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {latest ? (
        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Latest — {formatDate(latest.publishedAt)}</p>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-slate-800">
            {latest.content}
          </pre>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No daily updates yet.</p>
      )}
    </section>
  );
}
