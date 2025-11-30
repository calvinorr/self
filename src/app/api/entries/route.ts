import { NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { auth } from "@/auth";
import { getEntriesForUser } from "@/lib/queries";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allEntries = await getEntriesForUser(session.user.id);

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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, mood, aiInsight } = body;

    const [newEntry] = await db
      .insert(entries)
      .values({
        userId: session.user.id,
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
