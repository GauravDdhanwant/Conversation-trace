import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

export async function POST() {
  const result = seedDatabase();
  return NextResponse.json(result);
}
