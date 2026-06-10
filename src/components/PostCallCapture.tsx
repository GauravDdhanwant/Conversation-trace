"use client";

import { useState } from "react";

interface PostCallCaptureProps {
  projectId: string;
  onCaptured: () => void;
}

export function PostCallCapture({ projectId, onCaptured }: PostCallCaptureProps) {
  const [title, setTitle] = useState("");
  const [rawNotes, setRawNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, title, rawNotes }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to capture engagement");
      }

      setMessage(
        data.idempotent
          ? `Idempotent: ${data.message}`
          : `Extracted ${data.extractedItems.length} items from call notes.`,
      );
      setTitle("");
      setRawNotes("");
      onCaptured();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Post-Call Capture</h2>
      <p className="mt-1 text-sm text-slate-500">
        Paste call notes or transcript. AI extracts decisions, actions, and requirements.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Call title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly sync — Acme stakeholders"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
            Notes / transcript
          </label>
          <textarea
            id="notes"
            required
            rows={8}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Decision: ...&#10;Action: ...&#10;Requirement: ..."
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract & Save"}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
    </section>
  );
}
