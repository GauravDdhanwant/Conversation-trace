import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projects, metricSnapshots } from "@/lib/db/schema";
import { createMetricSnapshotSchema } from "@/lib/validation";
import { generateId } from "@/lib/utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = createMetricSnapshotSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = getDb();
  const project = db.select().from(projects).where(eq(projects.id, id)).get();
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const snapshotId = generateId("metric");
  const now = new Date().toISOString();

  const snapshot = {
    id: snapshotId,
    projectId: id,
    value: parsed.data.value,
    recordedAt: now,
    notes: parsed.data.notes ?? null,
  };

  db.insert(metricSnapshots).values(snapshot).run();

  return NextResponse.json(snapshot);
}
