import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { seedDatabase } from "@/lib/db/seed";

export const dynamic = "force-dynamic";

export default function HomePage() {
  seedDatabase();
  const db = getDb();
  const allProjects = db.select().from(projects).orderBy(desc(projects.createdAt)).all();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Trace conversations to outcomes
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Conversation Trace</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Own the outcome, not the task. Trace every requirement to a conversation, automate daily
          status, and measure whether the business metric moved.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Active Projects</h2>
        {allProjects.length === 0 ? (
          <p className="mt-4 text-slate-500">No projects yet. Seed the demo to get started.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {allProjects.map((project) => (
              <li key={project.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-slate-900">{project.name}</p>
                  <p className="text-sm text-slate-500">{project.successMetricName}</p>
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Open Project
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">Post-Call Capture</h3>
          <p className="mt-2 text-sm text-slate-500">
            Paste notes → AI extracts decisions, actions, requirements with trace IDs.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">Daily Status</h3>
          <p className="mt-2 text-sm text-slate-500">
            One-click status draft from project state. Every working day.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">Outcome Dashboard</h3>
          <p className="mt-2 text-sm text-slate-500">
            Baseline → current → target with conviction statement.
          </p>
        </div>
      </section>
    </main>
  );
}
