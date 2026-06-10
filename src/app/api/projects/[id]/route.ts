import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  projects,
  engagements,
  extractedItems,
  dailyUpdates,
  metricSnapshots,
} from "@/lib/db/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const project = db.select().from(projects).where(eq(projects.id, id)).get();
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const projectEngagements = db
    .select()
    .from(engagements)
    .where(eq(engagements.projectId, id))
    .orderBy(desc(engagements.createdAt))
    .all();

  const items = db
    .select()
    .from(extractedItems)
    .where(eq(extractedItems.projectId, id))
    .orderBy(desc(extractedItems.createdAt))
    .all();

  const updates = db
    .select()
    .from(dailyUpdates)
    .where(eq(dailyUpdates.projectId, id))
    .orderBy(desc(dailyUpdates.publishedAt))
    .all();

  const snapshots = db
    .select()
    .from(metricSnapshots)
    .where(eq(metricSnapshots.projectId, id))
    .orderBy(desc(metricSnapshots.recordedAt))
    .all();

  return NextResponse.json({
    project,
    engagements: projectEngagements,
    extractedItems: items,
    dailyUpdates: updates,
    metricSnapshots: snapshots,
    currentMetricValue: snapshots[0]?.value ?? null,
  });
}
