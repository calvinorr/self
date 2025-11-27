import { NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allEntries = await db
      .select()
      .from(entries)
      .orderBy(desc(entries.createdAt));

    return NextResponse.json(allEntries);
  } catch (error) {
    console.error("Failed to fetch entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, mood, aiInsight } = body;

    const [newEntry] = await db
      .insert(entries)
      .values({
        title,
        content,
        mood,
        aiInsight,
      })
      .returning();

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Failed to create entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}
