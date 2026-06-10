"use client";

import type { ExtractedItem } from "@/lib/db/schema";

const typeStyles = {
  decision: "bg-violet-50 text-violet-700 border-violet-200",
  action: "bg-sky-50 text-sky-700 border-sky-200",
  requirement: "bg-amber-50 text-amber-700 border-amber-200",
};

interface ExtractedItemsListProps {
  items: ExtractedItem[];
  onStatusChange: (id: string, status: ExtractedItem["status"]) => void;
}

export function ExtractedItemsList({ items, onStatusChange }: ExtractedItemsListProps) {
  const grouped = {
    decision: items.filter((i) => i.type === "decision"),
    action: items.filter((i) => i.type === "action"),
    requirement: items.filter((i) => i.type === "requirement"),
  };

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
        No extracted items yet. Capture a call to populate decisions, actions, and requirements.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {(["decision", "action", "requirement"] as const).map((type) => (
        <div key={type}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {type}s ({grouped[type].length})
          </h3>
          <ul className="space-y-2">
            {grouped[type].map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-block rounded border px-2 py-0.5 text-xs font-medium capitalize ${typeStyles[type]}`}
                  >
                    {type}
                  </span>
                  <p className="mt-2 text-sm text-slate-800">{item.content}</p>
                  {item.linkedFeatureRef && (
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      Trace: {item.linkedFeatureRef}
                    </p>
                  )}
                </div>
                <select
                  value={item.status}
                  onChange={(e) =>
                    onStatusChange(item.id, e.target.value as ExtractedItem["status"])
                  }
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700"
                >
                  <option value="open">Open</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
