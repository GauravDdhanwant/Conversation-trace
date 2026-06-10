import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { seedDatabase } from "@/lib/db/seed";

export async function GET() {
  seedDatabase();
  const db = getDb();
  const allProjects = db.select().from(projects).orderBy(desc(projects.createdAt)).all();
  return NextResponse.json(allProjects);
}
