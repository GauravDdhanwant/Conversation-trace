"use client";

import { useState } from "react";

interface MetricSnapshotFormProps {
  projectId: string;
  onRecorded: () => void;
}

export function MetricSnapshotForm({ projectId, onRecorded }: MetricSnapshotFormProps) {
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`/api/projects/${projectId}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(value), notes: notes || undefined }),
      });
      setValue("");
      setNotes("");
      onRecorded();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="metric-value" className="block text-xs font-medium text-slate-600">
          Record current value
        </label>
        <input
          id="metric-value"
          type="number"
          step="0.1"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div className="min-w-[200px] flex-1">
        <label htmlFor="metric-notes" className="block text-xs font-medium text-slate-600">
          Notes (optional)
        </label>
        <input
          id="metric-notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. After staging deploy"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Record Snapshot"}
      </button>
    </form>
  );
}
