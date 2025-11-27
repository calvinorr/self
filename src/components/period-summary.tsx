"use client";

import { useState, useMemo } from "react";

interface Entry {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  aiInsight: string | null;
  createdAt: string;
}

interface SummaryData {
  headline: string;
  summary: string;
  highlights: string[];
  moodInsight: string;
  notableQuote: string | null;
  encouragement: string;
  entryCount: number;
  topMood: string;
  period: "week" | "month";
  generatedAt: string;
}

interface PeriodSummaryProps {
  entries: Entry[];
}

export function PeriodSummary({ entries }: PeriodSummaryProps) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const cutoff = period === "week"
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    return entries.filter((e) => new Date(e.createdAt) >= cutoff);
  }, [entries, period]);

  const handleGenerate = async () => {
    if (filteredEntries.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: filteredEntries, period }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const periodLabel = period === "week" ? "Weekly" : "Monthly";

  if (filteredEntries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-xl text-primary">
              summarize
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{periodLabel} Summary</h2>
            <p className="text-sm text-muted-foreground">
              AI-generated reflection on your journaling
            </p>
          </div>
        </div>

        {/* Period Toggle */}
        <div className="flex h-9 items-center rounded-lg bg-surface-elevated p-1 mb-4 w-fit">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setSummary(null);
              }}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                period === p
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        <div className="rounded-lg bg-surface-elevated p-4 text-center">
          <span className="material-symbols-outlined text-3xl text-muted-foreground mb-2 block">
            calendar_today
          </span>
          <p className="text-sm text-muted-foreground">
            No entries this {period}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Start journaling to get your {period}ly summary
          </p>
        </div>
      </div>
    );
  }

  if (!summary && !isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-xl text-primary">
                summarize
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{periodLabel} Summary</h2>
              <p className="text-sm text-muted-foreground">
                {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"} this {period}
              </p>
            </div>
          </div>
        </div>

        {/* Period Toggle */}
        <div className="flex h-9 items-center rounded-lg bg-surface-elevated p-1 mb-4 w-fit">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setSummary(null);
              }}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                period === p
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">auto_awesome</span>
          Generate {periodLabel} Summary
        </button>

        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-xl text-primary animate-spin">
              progress_activity
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Creating Your Summary...</h2>
            <p className="text-sm text-muted-foreground">
              Reflecting on your {period}&apos;s journey
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-6 w-3/4 rounded bg-surface-elevated animate-pulse" />
          <div className="h-24 rounded bg-surface-elevated animate-pulse" />
          <div className="h-16 rounded bg-surface-elevated animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <span className="material-symbols-outlined text-xl text-primary">
              summarize
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{summary!.headline}</h2>
            <p className="text-sm text-muted-foreground">
              {summary!.entryCount} {summary!.entryCount === 1 ? "entry" : "entries"} · Top mood: {summary!.topMood}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Period Toggle */}
          <div className="flex h-8 items-center rounded-lg bg-surface p-0.5">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setSummary(null);
                }}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  period === p
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
            title="Regenerate summary"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Text */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {summary!.summary}
        </p>
      </div>

      {/* Highlights */}
      {summary!.highlights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
            Highlights
          </h4>
          <ul className="space-y-1">
            {summary!.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">
                  check_circle
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notable Quote */}
      {summary!.notableQuote && (
        <div className="mb-4 border-l-2 border-primary/50 pl-4 py-2 bg-surface/50 rounded-r-lg">
          <p className="text-sm italic text-foreground">
            &ldquo;{summary!.notableQuote}&rdquo;
          </p>
        </div>
      )}

      {/* Mood Insight */}
      <div className="mb-4 rounded-lg bg-surface p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-base text-primary">mood</span>
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Mood Insight
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{summary!.moodInsight}</p>
      </div>

      {/* Encouragement */}
      <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
        <span className="material-symbols-outlined text-2xl text-emerald-500 mb-2 block">
          favorite
        </span>
        <p className="text-sm text-muted-foreground">{summary!.encouragement}</p>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Generated {new Date(summary!.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}
