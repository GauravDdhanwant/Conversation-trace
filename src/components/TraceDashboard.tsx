"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Project,
  Engagement,
  ExtractedItem,
  DailyUpdate,
  MetricSnapshot,
} from "@/lib/db/schema";
import { MetricCard } from "./MetricCard";
import { PostCallCapture } from "./PostCallCapture";
import { DailyStatusPanel } from "./DailyStatusPanel";
import { ExtractedItemsList } from "./ExtractedItemsList";
import { MetricSnapshotForm } from "./MetricSnapshotForm";
import { formatDate } from "@/lib/utils";

interface ProjectData {
  project: Project;
  engagements: Engagement[];
  extractedItems: ExtractedItem[];
  dailyUpdates: DailyUpdate[];
  metricSnapshots: MetricSnapshot[];
  currentMetricValue: number | null;
}

interface TraceDashboardProps {
  projectId: string;
}

export function TraceDashboard({ projectId }: TraceDashboardProps) {
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to load project");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to load project");
        const json = await res.json();
        if (!active) return;
        setData(json);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [projectId]);

  async function handleStatusChange(id: string, status: ExtractedItem["status"]) {
    await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadProject();
  }

  if (loading) {
    return <p className="text-slate-500">Loading project trace...</p>;
  }

  if (error || !data) {
    return <p className="text-red-600">{error ?? "Project not found"}</p>;
  }

  const { project, engagements, extractedItems, dailyUpdates, metricSnapshots, currentMetricValue } =
    data;

  const openCount = extractedItems.filter((i) => i.status === "open").length;
  const traceableRequirements = extractedItems.filter(
    (i) => i.type === "requirement" && i.linkedFeatureRef,
  ).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">Conversation Trace</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Trace requirements to conversations. Automate daily status. Measure whether the needle
            moved — not just whether features shipped.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-lg bg-white px-4 py-3 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-2xl font-bold text-slate-900">{openCount}</p>
            <p className="text-xs text-slate-500">Open items</p>
          </div>
          <div className="rounded-lg bg-white px-4 py-3 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-2xl font-bold text-slate-900">{engagements.length}</p>
            <p className="text-xs text-slate-500">Engagements</p>
          </div>
          <div className="rounded-lg bg-white px-4 py-3 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-2xl font-bold text-slate-900">{traceableRequirements}</p>
            <p className="text-xs text-slate-500">Traced reqs</p>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <MetricCard
          metricName={project.successMetricName}
          baseline={project.baselineValue}
          target={project.targetValue}
          current={currentMetricValue}
          convictionStatement={project.convictionStatement}
        />
        <DailyStatusPanel
          projectId={projectId}
          updates={dailyUpdates}
          onGenerated={loadProject}
        />
      </div>

      <MetricSnapshotForm projectId={projectId} onRecorded={loadProject} />

      <div className="grid gap-8 lg:grid-cols-2">
        <PostCallCapture projectId={projectId} onCaptured={loadProject} />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Engagements</h2>
          {engagements.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No engagements logged yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {engagements.slice(0, 5).map((eng) => (
                <li key={eng.id} className="rounded-lg border border-slate-100 p-4">
                  <p className="font-medium text-slate-900">{eng.title}</p>
                  <p className="text-xs text-slate-400">{formatDate(eng.createdAt)}</p>
                  {eng.summary && (
                    <p className="mt-2 text-sm text-slate-600">{eng.summary}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Decision & Requirement Log</h2>
        <p className="mt-1 text-sm text-slate-500">
          Every item traces back to a source engagement. Requirements get a feature reference ID.
        </p>
        <div className="mt-4">
          <ExtractedItemsList items={extractedItems} onStatusChange={handleStatusChange} />
        </div>
      </section>

      {metricSnapshots.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Metric History</h2>
          <ul className="mt-4 space-y-2">
            {metricSnapshots.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm"
              >
                <span className="font-medium text-slate-900">{s.value}</span>
                <span className="text-slate-500">{formatDate(s.recordedAt)}</span>
                {s.notes && <span className="text-slate-400">{s.notes}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
