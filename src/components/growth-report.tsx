"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Entry } from "@/db/schema";

interface GrowthStats {
  currentMonth: {
    name: string;
    entryCount: number;
    moodAverage: number | null;
  };
  previousMonth: {
    name: string;
    entryCount: number;
    moodAverage: number | null;
  };
  totalEntries: number;
  moodTrend: "improving" | "declining" | "stable" | null;
}

interface Celebration {
  title: string;
  description: string;
}

interface GrowthArea {
  title: string;
  description: string;
}

interface RecurringTheme {
  theme: string;
  trend: "stable" | "increasing" | "decreasing";
  note: string;
}

interface GrowthAnalysis {
  headline: string;
  summary: string;
  celebrations: Celebration[];
  growthAreas: GrowthArea[];
  recurringThemes: RecurringTheme[];
  encouragement: string;
  stats: GrowthStats;
}

interface GrowthReportProps {
  entries: Entry[];
}

const moodLabels: Record<number, string> = {
  5: "Great",
  4: "Good",
  3: "Okay",
  2: "Low",
  1: "Rough",
};

const trendIcons: Record<string, { icon: string; color: string }> = {
  improving: { icon: "trending_up", color: "text-emerald-500" },
  declining: { icon: "trending_down", color: "text-amber-500" },
  stable: { icon: "trending_flat", color: "text-sky-500" },
  increasing: { icon: "arrow_upward", color: "text-emerald-500" },
  decreasing: { icon: "arrow_downward", color: "text-amber-500" },
};

export function GrowthReport({ entries }: GrowthReportProps) {
  const [analysis, setAnalysis] = useState<GrowthAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/insights/growth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate growth report");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
  };

  if (entries.length < 3) {
    return (
      <div className="rounded-xl border border-border bg-surface/50 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span
            className="material-symbols-outlined text-3xl text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            potted_plant
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Your Growth Journey Awaits</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Keep journaling to unlock your monthly growth report. We need at least 3 entries to identify meaningful patterns in your journey.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          {entries.length} of 3 entries
        </p>
        <div className="w-32 h-2 bg-surface-elevated rounded-full mx-auto mt-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(entries.length / 3) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (!analysis && !isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface/50 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center mb-4">
          <span
            className="material-symbols-outlined text-3xl text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            trending_up
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Ready to See Your Growth?</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Generate your personalized monthly growth report to celebrate your progress and discover patterns in your journaling journey.
        </p>
        <button
          onClick={generateReport}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span
            className="material-symbols-outlined text-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          Generate Growth Report
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface/50 p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary animate-pulse">
                psychology
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 material-symbols-outlined text-lg text-primary animate-spin">
              progress_activity
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Analyzing your journey...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <span className="material-symbols-outlined text-2xl text-destructive mb-2">error</span>
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={generateReport}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 via-surface to-emerald-500/5 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="material-symbols-outlined text-2xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trending_up
              </span>
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Monthly Growth Report
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">{analysis.headline}</h2>
          </div>
          <button
            onClick={generateReport}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-surface/50">
            <p className="text-2xl font-bold text-foreground">{analysis.stats.currentMonth.entryCount}</p>
            <p className="text-xs text-muted-foreground">{analysis.stats.currentMonth.name} entries</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-surface/50">
            {analysis.stats.currentMonth.moodAverage ? (
              <>
                <p className="text-2xl font-bold text-foreground">
                  {analysis.stats.currentMonth.moodAverage.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Avg mood (of 5)</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-muted-foreground">—</p>
                <p className="text-xs text-muted-foreground">No mood data</p>
              </>
            )}
          </div>
          <div className="text-center p-3 rounded-lg bg-surface/50">
            {analysis.stats.moodTrend ? (
              <div className="flex items-center justify-center gap-1">
                <span
                  className={cn(
                    "material-symbols-outlined text-2xl",
                    trendIcons[analysis.stats.moodTrend].color
                  )}
                >
                  {trendIcons[analysis.stats.moodTrend].icon}
                </span>
              </div>
            ) : (
              <p className="text-xl font-bold text-muted-foreground">—</p>
            )}
            <p className="text-xs text-muted-foreground capitalize">
              {analysis.stats.moodTrend || "Trend TBD"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-surface/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">auto_stories</span>
          Your Journey This Month
        </h3>
        <div
          className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(analysis.summary) }}
        />
      </div>

      {/* Celebrations */}
      {analysis.celebrations.length > 0 && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-lg text-emerald-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              celebration
            </span>
            Celebrate Your Wins
          </h3>
          <div className="space-y-3">
            {analysis.celebrations.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-sm text-emerald-500">check</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Growth Areas */}
      {analysis.growthAreas.length > 0 && (
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-lg text-sky-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              potted_plant
            </span>
            Areas for Growth
          </h3>
          <div className="space-y-3">
            {analysis.growthAreas.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-sm text-sky-500">eco</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recurring Themes */}
      {analysis.recurringThemes.length > 0 && (
        <div className="rounded-xl border border-border bg-surface/50 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">category</span>
            Recurring Themes
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {analysis.recurringThemes.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-elevated/50"
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-lg mt-0.5",
                    trendIcons[item.trend]?.color || "text-muted-foreground"
                  )}
                >
                  {trendIcons[item.trend]?.icon || "radio_button_checked"}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.theme}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">A Note of Encouragement</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.encouragement}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
