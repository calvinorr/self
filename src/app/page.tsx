import Link from "next/link";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Sidebar } from "@/components/sidebar";
import { EntryCard } from "@/components/entry-card";
import { InsightsPanel } from "@/components/insights-panel";

export const dynamic = "force-dynamic";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  const allEntries = await db
    .select()
    .from(entries)
    .orderBy(desc(entries.createdAt));

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-8 py-4">
          <div className="flex-1">
            <label className="flex h-10 w-full max-w-sm flex-col">
              <div className="relative flex w-full flex-1 items-stretch">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  type="search"
                  placeholder="Search entries..."
                  className="block w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex gap-8 p-8">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-foreground animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
                {getGreeting()}
              </h1>
              <h2 className="mt-2 text-lg font-medium text-muted-foreground animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
                Your Recent Entries
              </h2>
            </div>

            {allEntries.length === 0 ? (
              <div className="text-center py-16 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
                <div className="mx-auto w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-muted-foreground">book_4</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No entries yet</h2>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start your journaling journey by creating your first entry.
                </p>
                <Link
                  href="/entry/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                  Write your first entry
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {allEntries.map((entry, index) => (
                  <EntryCard key={entry.id} entry={entry} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          {allEntries.length > 0 && <InsightsPanel entries={allEntries} />}
        </div>
      </main>
    </div>
  );
}
