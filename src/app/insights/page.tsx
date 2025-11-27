"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { EntrySearch } from "@/components/entry-search";
import { MoodTrendsChart } from "@/components/mood-trends-chart";
import { AIThemes } from "@/components/ai-themes";
import { PeriodSummary } from "@/components/period-summary";
import Link from "next/link";

interface Entry {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MoodCount {
  mood: string;
  count: number;
  percentage: number;
}

const MOOD_CATEGORIES = {
  positive: ["happy", "excited", "grateful", "hopeful", "calm"],
  neutral: ["neutral", "tired"],
  negative: ["anxious", "frustrated", "sad"],
};

const MOOD_COLORS: Record<string, string> = {
  happy: "bg-emerald-500",
  excited: "bg-amber-500",
  grateful: "bg-pink-500",
  hopeful: "bg-sky-500",
  calm: "bg-teal-500",
  neutral: "bg-slate-500",
  tired: "bg-purple-500",
  anxious: "bg-orange-500",
  frustrated: "bg-red-500",
  sad: "bg-blue-500",
};

export default function InsightsPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "all">("month");
  const [moodChartRange, setMoodChartRange] = useState<"week" | "month" | "quarter">("month");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/entries");
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntries();
  }, []);

  // Filter entries by time range
  const filteredEntries = useMemo(() => {
    const now = new Date();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      switch (timeRange) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return entryDate >= monthAgo;
        case "year":
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return entryDate >= yearAgo;
        default:
          return true;
      }
    });
  }, [entries, timeRange]);

  // Calculate mood statistics
  const moodStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEntries.forEach((entry) => {
      if (entry.mood) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const stats: MoodCount[] = Object.entries(counts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return stats;
  }, [filteredEntries]);

  // Calculate category percentages
  const categoryStats = useMemo(() => {
    let positive = 0, neutral = 0, negative = 0;
    filteredEntries.forEach((entry) => {
      if (!entry.mood) return;
      if (MOOD_CATEGORIES.positive.includes(entry.mood)) positive++;
      else if (MOOD_CATEGORIES.neutral.includes(entry.mood)) neutral++;
      else if (MOOD_CATEGORIES.negative.includes(entry.mood)) negative++;
    });
    const total = positive + neutral + negative;
    return {
      positive: total > 0 ? Math.round((positive / total) * 100) : 0,
      neutral: total > 0 ? Math.round((neutral / total) * 100) : 0,
      negative: total > 0 ? Math.round((negative / total) * 100) : 0,
    };
  }, [filteredEntries]);

  // Calculate writing streak
  const writingStreak = useMemo(() => {
    if (entries.length === 0) return 0;

    const sortedDates = entries
      .map((e) => new Date(e.createdAt).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0;
    }

    for (let i = 0; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i]);
      const expected = new Date(Date.now() - i * 86400000);

      if (current.toDateString() === expected.toDateString()) {
        streak++;
      } else if (i === 0 && sortedDates[0] === yesterday) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [entries]);

  // Activity heatmap data (last 12 weeks)
  const activityData = useMemo(() => {
    const weeks: { week: number; days: number[] }[] = [];
    const now = new Date();

    for (let w = 11; w >= 0; w--) {
      const weekStart = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);
      const days: number[] = [];

      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart.getTime() + d * 24 * 60 * 60 * 1000);
        const count = entries.filter(
          (e) => new Date(e.createdAt).toDateString() === day.toDateString()
        ).length;
        days.push(count);
      }

      weeks.push({ week: 12 - w, days });
    }

    return weeks;
  }, [entries]);

  const entriesWithInsights = filteredEntries.filter((e) => e.aiInsight).length;

  const handleEntryClick = (entryId: number) => {
    router.push(`/entry/${entryId}`);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background scrollbar-thin">
        <div className="p-8">
          {/* Header */}
          <header className="mb-8 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                  Insights
                </h1>
                <p className="mt-1 text-base text-muted-foreground">
                  Discover patterns in your journaling journey.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="w-64">
                  <EntrySearch entries={entries} />
                </div>

                {/* Time Range Toggle */}
                <div className="flex h-10 items-center rounded-lg bg-surface p-1">
                  {(["week", "month", "year", "all"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                        timeRange === range
                          ? "bg-background text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {range === "all" ? "All time" : `This ${range}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined text-3xl text-muted-foreground animate-spin">
                progress_activity
              </span>
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface py-16 text-center animate-fade-up">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface-elevated">
                <span className="material-symbols-outlined text-4xl text-muted-foreground">
                  insights
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No insights yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start journaling to see patterns emerge
              </p>
              <Link
                href="/entry/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Write your first entry
              </Link>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                  {
                    label: "Total Entries",
                    value: filteredEntries.length,
                    icon: "book_4",
                    color: "text-primary",
                  },
                  {
                    label: "Writing Streak",
                    value: `${writingStreak} days`,
                    icon: "local_fire_department",
                    color: "text-orange-500",
                  },
                  {
                    label: "AI Insights",
                    value: entriesWithInsights,
                    icon: "psychology",
                    color: "text-purple-500",
                  },
                  {
                    label: "Top Mood",
                    value: moodStats[0]?.mood || "—",
                    icon: "mood",
                    color: "text-emerald-500",
                    capitalize: true,
                  },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-surface p-5 animate-fade-up opacity-0"
                    style={{ animationDelay: `${0.1 + index * 0.05}s`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                      <span className={`material-symbols-outlined text-xl ${stat.color}`}>
                        {stat.icon}
                      </span>
                    </div>
                    <p className={`mt-2 text-2xl font-bold text-foreground ${stat.capitalize ? "capitalize" : ""}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mood Trends Chart - NEW */}
              <div
                className="rounded-xl border border-border bg-surface p-6 mb-8 animate-fade-up opacity-0"
                style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Mood Trends</h2>
                  <div className="flex h-9 items-center rounded-lg bg-surface-elevated p-1">
                    {(["week", "month", "quarter"] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setMoodChartRange(range)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                          moodChartRange === range
                            ? "bg-background text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {range === "quarter" ? "90 days" : range === "month" ? "30 days" : "7 days"}
                      </button>
                    ))}
                  </div>
                </div>
                <MoodTrendsChart
                  entries={entries}
                  timeRange={moodChartRange}
                  onEntryClick={handleEntryClick}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
                {/* Mood Distribution */}
                <div
                  className="rounded-xl border border-border bg-surface p-6 animate-fade-up opacity-0"
                  style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Mood Distribution
                  </h2>

                  {/* Category Summary */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 rounded-lg bg-emerald-500/10 p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-500">{categoryStats.positive}%</p>
                      <p className="text-xs text-muted-foreground">Positive</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-slate-500/10 p-3 text-center">
                      <p className="text-2xl font-bold text-slate-400">{categoryStats.neutral}%</p>
                      <p className="text-xs text-muted-foreground">Neutral</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-rose-500/10 p-3 text-center">
                      <p className="text-2xl font-bold text-rose-500">{categoryStats.negative}%</p>
                      <p className="text-xs text-muted-foreground">Challenging</p>
                    </div>
                  </div>

                  {/* Individual Moods */}
                  <div className="space-y-3">
                    {moodStats.slice(0, 6).map((stat) => (
                      <div key={stat.mood} className="flex items-center gap-3">
                        <span className="w-20 text-sm capitalize text-muted-foreground">
                          {stat.mood}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-surface-elevated overflow-hidden">
                          <div
                            className={`h-full rounded-full ${MOOD_COLORS[stat.mood] || "bg-primary"} transition-all duration-500`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm font-medium text-foreground">
                          {stat.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly/Monthly Summary - NEW */}
                <div
                  className="animate-fade-up opacity-0"
                  style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
                >
                  <PeriodSummary entries={entries} />
                </div>
              </div>

              {/* AI Themes - NEW */}
              <div
                className="mb-8 animate-fade-up opacity-0"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <AIThemes entries={entries} />
              </div>

              {/* Activity Heatmap */}
              <div
                className="rounded-xl border border-border bg-surface p-6 animate-fade-up opacity-0"
                style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Writing Activity
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Last 12 weeks
                </p>
                <div className="flex gap-1">
                  {activityData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.days.map((count, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`h-4 w-4 rounded-sm transition-colors ${
                            count === 0
                              ? "bg-surface-elevated"
                              : count === 1
                              ? "bg-primary/30"
                              : count === 2
                              ? "bg-primary/60"
                              : "bg-primary"
                          }`}
                          title={`${count} ${count === 1 ? "entry" : "entries"}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded-sm bg-surface-elevated" />
                    <div className="h-3 w-3 rounded-sm bg-primary/30" />
                    <div className="h-3 w-3 rounded-sm bg-primary/60" />
                    <div className="h-3 w-3 rounded-sm bg-primary" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
