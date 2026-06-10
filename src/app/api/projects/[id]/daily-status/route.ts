import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  projects,
  extractedItems,
  engagements,
  dailyUpdates,
  metricSnapshots,
} from "@/lib/db/schema";
import { generateDailyStatus } from "@/lib/ai/status";
import { generateId } from "@/lib/utils";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const project = db.select().from(projects).where(eq(projects.id, id)).get();
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const items = db
    .select()
    .from(extractedItems)
    .where(eq(extractedItems.projectId, id))
    .all();

  const recentEngagements = db
    .select()
    .from(engagements)
    .where(eq(engagements.projectId, id))
    .orderBy(desc(engagements.createdAt))
    .limit(3)
    .all();

  const latestSnapshot = db
    .select()
    .from(metricSnapshots)
    .where(eq(metricSnapshots.projectId, id))
    .orderBy(desc(metricSnapshots.recordedAt))
    .get();

  const content = await generateDailyStatus({
    projectName: project.name,
    successMetricName: project.successMetricName,
    baselineValue: project.baselineValue,
    targetValue: project.targetValue,
    currentValue: latestSnapshot?.value ?? null,
    openDecisions: items.filter((i) => i.type === "decision" && i.status === "open").map((i) => i.content),
    openActions: items.filter((i) => i.type === "action" && i.status === "open").map((i) => i.content),
    openRequirements: items
      .filter((i) => i.type === "requirement" && i.status === "open")
      .map((i) => i.content),
    recentEngagements: recentEngagements.map((e) => ({
      title: e.title,
      summary: e.summary,
      createdAt: e.createdAt,
    })),
  });

  const updateId = generateId("update");
  const now = new Date().toISOString();

  db.insert(dailyUpdates).values({
    id: updateId,
    projectId: id,
    content,
    publishedAt: now,
  }).run();

  return NextResponse.json({
    id: updateId,
    projectId: id,
    content,
    publishedAt: now,
  });
}
