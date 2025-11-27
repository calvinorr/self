"use client";

import { useState } from "react";
import Link from "next/link";

interface Entry {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  aiInsight: string | null;
  createdAt: string;
}

interface Theme {
  name: string;
  description: string;
  frequency: "high" | "medium" | "low";
  sentiment: "positive" | "neutral" | "challenging";
  relatedEntries: string[];
}

interface ThemeData {
  themes: Theme[];
  overallTone: string;
  growthAreas: string[];
  strengths: string[];
}

interface AIThemesProps {
  entries: Entry[];
}

const FREQUENCY_COLORS = {
  high: "bg-primary text-primary-foreground",
  medium: "bg-primary/60 text-primary-foreground",
  low: "bg-primary/30 text-foreground",
};

const SENTIMENT_ICONS = {
  positive: "sentiment_satisfied",
  neutral: "sentiment_neutral",
  challenging: "psychology_alt",
};

const SENTIMENT_COLORS = {
  positive: "text-emerald-500",
  neutral: "text-slate-500",
  challenging: "text-amber-500",
};

export function AIThemes({ entries }: AIThemesProps) {
  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  const handleDiscover = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to discover themes");
      }

      const data = await response.json();
      setThemeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const findEntryByTitle = (title: string) => {
    return entries.find(
      (e) => e.title.toLowerCase().includes(title.toLowerCase()) ||
             title.toLowerCase().includes(e.title.toLowerCase())
    );
  };

  if (entries.length < 3) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-xl text-primary">
              category
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Themes</h2>
            <p className="text-sm text-muted-foreground">
              Discover patterns across your entries
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-surface-elevated p-4 text-center">
          <span className="material-symbols-outlined text-3xl text-muted-foreground mb-2 block">
            edit_note
          </span>
          <p className="text-sm text-muted-foreground">
            Write at least 3 entries to discover themes
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You have {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>
      </div>
    );
  }

  if (!themeData && !isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-xl text-primary">
                category
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Themes</h2>
              <p className="text-sm text-muted-foreground">
                Discover patterns across your {entries.length} entries
              </p>
            </div>
          </div>
          <button
            onClick={handleDiscover}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Discover Themes
          </button>
        </div>
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
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
            <h2 className="text-lg font-semibold text-foreground">Analyzing Themes...</h2>
            <p className="text-sm text-muted-foreground">
              Our AI is finding patterns in your journal
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-elevated animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-xl text-primary">
              category
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Your Themes</h2>
            <p className="text-sm text-muted-foreground">{themeData!.overallTone}</p>
          </div>
        </div>
        <button
          onClick={handleDiscover}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
          title="Refresh themes"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
        </button>
      </div>

      {/* Themes List */}
      <div className="space-y-3 mb-6">
        {themeData!.themes.map((theme) => (
          <div
            key={theme.name}
            className="rounded-lg border border-border bg-surface-elevated overflow-hidden"
          >
            <button
              onClick={() => setExpandedTheme(expandedTheme === theme.name ? null : theme.name)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-surface transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-lg ${SENTIMENT_COLORS[theme.sentiment]}`}>
                  {SENTIMENT_ICONS[theme.sentiment]}
                </span>
                <div>
                  <h3 className="font-medium text-foreground">{theme.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {theme.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${FREQUENCY_COLORS[theme.frequency]}`}>
                  {theme.frequency}
                </span>
                <span className="material-symbols-outlined text-muted-foreground text-lg">
                  {expandedTheme === theme.name ? "expand_less" : "expand_more"}
                </span>
              </div>
            </button>

            {expandedTheme === theme.name && (
              <div className="px-3 pb-3 border-t border-border pt-3">
                <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
                {theme.relatedEntries.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">Related entries:</p>
                    <div className="flex flex-wrap gap-2">
                      {theme.relatedEntries.map((title) => {
                        const entry = findEntryByTitle(title);
                        return entry ? (
                          <Link
                            key={title}
                            href={`/entry/${entry.id}`}
                            className="text-xs px-2 py-1 rounded bg-surface border border-border hover:border-primary hover:text-primary transition-colors"
                          >
                            {entry.title}
                          </Link>
                        ) : (
                          <span key={title} className="text-xs px-2 py-1 rounded bg-surface text-muted-foreground">
                            {title}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strengths & Growth */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-emerald-500/10 p-4">
          <h4 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">thumb_up</span>
            Strengths
          </h4>
          <ul className="space-y-1">
            {themeData!.strengths.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-amber-500/10 p-4">
          <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">trending_up</span>
            Growth Areas
          </h4>
          <ul className="space-y-1">
            {themeData!.growthAreas.map((g, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {g}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
