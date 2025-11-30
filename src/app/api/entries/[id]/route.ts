import { NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isDev = process.env.NODE_ENV === "development";

    // In development, skip userId check to allow viewing any entry
    const [entry] = isDev
      ? await db
          .select()
          .from(entries)
          .where(eq(entries.id, parseInt(id)))
      : await db
          .select()
          .from(entries)
          .where(
            and(
              eq(entries.id, parseInt(id)),
              eq(entries.userId, session.user.id)
            )
          );

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to fetch entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, mood, aiInsight } = body;
    const isDev = process.env.NODE_ENV === "development";

    // In development, skip userId check
    const [updatedEntry] = isDev
      ? await db
          .update(entries)
          .set({
            title,
            content,
            mood,
            aiInsight,
            updatedAt: new Date(),
          })
          .where(eq(entries.id, parseInt(id)))
          .returning()
      : await db
          .update(entries)
          .set({
            title,
            content,
            mood,
            aiInsight,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(entries.id, parseInt(id)),
              eq(entries.userId, session.user.id)
            )
          )
          .returning();

    if (!updatedEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Failed to update entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isDev = process.env.NODE_ENV === "development";

    // In development, skip userId check
    const [deletedEntry] = isDev
      ? await db
          .delete(entries)
          .where(eq(entries.id, parseInt(id)))
          .returning()
      : await db
          .delete(entries)
          .where(
            and(
              eq(entries.id, parseInt(id)),
              eq(entries.userId, session.user.id)
            )
          )
          .returning();

    if (!deletedEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete entry:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
