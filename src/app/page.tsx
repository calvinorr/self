import Link from "next/link";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/entry-card";
import { PenLine, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allEntries = await db
    .select()
    .from(entries)
    .orderBy(desc(entries.createdAt));

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Journal</h1>
        </div>
        <Link href="/entry/new">
          <Button className="gap-2">
            <PenLine className="h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </header>

      {allEntries.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No entries yet</h2>
          <p className="text-muted-foreground mb-6">
            Start your journaling journey by creating your first entry.
          </p>
          <Link href="/entry/new">
            <Button className="gap-2">
              <PenLine className="h-4 w-4" />
              Write your first entry
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {allEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </main>
  );
}
