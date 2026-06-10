import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { extractedItems } from "@/lib/db/schema";
import { updateItemStatusSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateItemStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = getDb();
  const item = db.select().from(extractedItems).where(eq(extractedItems.id, id)).get();

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  db.update(extractedItems)
    .set({ status: parsed.data.status })
    .where(eq(extractedItems.id, id))
    .run();

  return NextResponse.json({ ...item, status: parsed.data.status });
}
