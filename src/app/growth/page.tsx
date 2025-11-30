import { AppLayout } from "@/components/app-layout";
import { GrowthReport } from "@/components/growth-report";
import { auth } from "@/auth";
import { getEntriesForUser } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function GrowthPage() {
  const session = await auth();

  const entries = session?.user?.id
    ? await getEntriesForUser(session.user.id)
    : [];

  return (
    <AppLayout>
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-8 py-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Growth</h1>
            <p className="text-sm text-muted-foreground">Track your personal growth journey</p>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-8 py-8">
          <GrowthReport entries={entries} />
        </div>
      </main>
    </AppLayout>
  );
}
