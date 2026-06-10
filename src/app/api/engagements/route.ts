import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projects, engagements, extractedItems } from "@/lib/db/schema";
import { createEngagementSchema } from "@/lib/validation";
import { extractFromNotes, hashNotes } from "@/lib/ai/extract";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createEngagementSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { projectId, title, rawNotes } = parsed.data;
  const db = getDb();

  const project = db.select().from(projects).where(eq(projects.id, projectId)).get();
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const notesHash = hashNotes(rawNotes);
  const existingEngagement = db
    .select()
    .from(engagements)
    .where(eq(engagements.extractionHash, notesHash))
    .get();

  if (existingEngagement && existingEngagement.projectId === projectId) {
    const existingItems = db
      .select()
      .from(extractedItems)
      .where(eq(extractedItems.engagementId, existingEngagement.id))
      .all();

    return NextResponse.json({
      engagement: existingEngagement,
      extractedItems: existingItems,
      idempotent: true,
      message: "Identical notes already processed — returning existing extraction.",
    });
  }

  const extraction = await extractFromNotes(rawNotes);
  const engagementId = generateId("eng");
  const now = new Date().toISOString();

  db.insert(engagements).values({
    id: engagementId,
    projectId,
    title,
    rawNotes,
    summary: extraction.summary,
    extractionHash: notesHash,
    createdAt: now,
  }).run();

  const createdItems: Array<typeof extractedItems.$inferSelect> = [];

  const itemGroups = [
    { type: "decision" as const, items: extraction.decisions },
    { type: "action" as const, items: extraction.actions },
    { type: "requirement" as const, items: extraction.requirements },
  ];

  for (const group of itemGroups) {
    for (const content of group.items) {
      const itemId = generateId("item");
      const item = {
        id: itemId,
        engagementId,
        projectId,
        type: group.type,
        content,
        status: "open" as const,
        linkedFeatureRef: group.type === "requirement" ? `FEAT-${itemId.slice(-4).toUpperCase()}` : null,
        createdAt: now,
      };
      db.insert(extractedItems).values(item).run();
      createdItems.push(item);
    }
  }

  return NextResponse.json({
    engagement: {
      id: engagementId,
      projectId,
      title,
      rawNotes,
      summary: extraction.summary,
      extractionHash: notesHash,
      createdAt: now,
    },
    extractedItems: createdItems,
    idempotent: false,
  });
}
