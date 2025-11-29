"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

interface Entry {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AnalysisData {
  summary: string;
  emergingTheme: { title: string; description: string };
  emotionalPattern: { title: string; description: string };
  thoughtPattern: { title: string; description: string };
  coreTopics: { name: string; color: string }[];
  relevantExcerpts: { text: string; date: string; entryId: number }[];
}

const TOPIC_COLORS = [
  { bg: "bg-blue-100 dark:bg-blue-900/50", text: "text-blue-800 dark:text-blue-300" },
  { bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-800 dark:text-green-300" },
  { bg: "bg-yellow-100 dark:bg-yellow-900/50", text: "text-yellow-800 dark:text-yellow-300" },
  { bg: "bg-purple-100 dark:bg-purple-900/50", text: "text-purple-800 dark:text-purple-300" },
  { bg: "bg-red-100 dark:bg-red-900/50", text: "text-red-800 dark:text-red-300" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/50", text: "text-indigo-800 dark:text-indigo-300" },
  { bg: "bg-pink-100 dark:bg-pink-900/50", text: "text-pink-800 dark:text-pink-300" },
  { bg: "bg-teal-100 dark:bg-teal-900/50", text: "text-teal-800 dark:text-teal-300" },
];

export default function InsightsPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

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
        default:
          return true;
      }
    });
  }, [entries, timeRange]);

  // Generate AI analysis when entries change
  useEffect(() => {
    async function generateAnalysis() {
      if (filteredEntries.length === 0) {
        setAnalysisData(null);
        return;
      }

      setIsAnalyzing(true);
      try {
        const response = await fetch("/api/insights/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entries: filteredEntries.map((e) => ({
              id: e.id,
              title: e.title,
              content: e.content,
              mood: e.mood,
              createdAt: e.createdAt,
            })),
            timeRange,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnalysisData(data);
        }
      } catch (error) {
        console.error("Failed to generate analysis:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }

    generateAnalysis();
  }, [filteredEntries, timeRange]);

  const handleEntryClick = (entryId: number) => {
    router.push(`/entry/${entryId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "week":
        return "This Week's";
      case "month":
        return "This Month's";
      default:
        return "All Time";
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background scrollbar-thin">
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          {/* Header */}
          <header className="animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                  AI Insights & Analysis
                </h1>
                <p className="mt-1 text-base text-muted-foreground">
                  An overview of your recent thoughts and feelings.
                </p>
              </div>

              {/* Time Range Toggle */}
              <div className="flex gap-2">
                {(["week", "month", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      timeRange === range
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface border border-border text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                    }`}
                  >
                    {range === "week" ? "Last 7 Days" : range === "month" ? "Last 30 Days" : "All Time"}
                  </button>
                ))}
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
                  psychology
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No insights yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start journaling to see patterns emerge
              </p>
              <button
                onClick={() => router.push("/entry/new")}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Write your first entry
              </button>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
                psychology
              </span>
              <p className="text-muted-foreground">Analyzing your journal entries...</p>
            </div>
          ) : analysisData ? (
            <>
              {/* AI Summary Card */}
              <div
                className="rounded-xl border border-border bg-surface p-6 animate-fade-up opacity-0"
                style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
              >
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    spark
                  </span>
                  <span>{getTimeRangeLabel()} Summary</span>
                </h2>
                <p className="text-muted-foreground mt-2 mb-4">
                  A high-level overview of your emotional landscape based on your journal entries from the past{" "}
                  {timeRange === "week" ? "7" : timeRange === "month" ? "30" : ""} days.
                </p>
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="whitespace-pre-line leading-relaxed">{analysisData.summary}</p>
                </div>
              </div>

              {/* Three Insight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  className="flex flex-col gap-2 rounded-xl bg-surface p-5 border border-border animate-fade-up opacity-0"
                  style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
                >
                  <p className="text-sm font-medium text-muted-foreground">Emerging Theme</p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {analysisData.emergingTheme.title}
                  </h3>
                  <p className="text-sm text-foreground mt-1">
                    {analysisData.emergingTheme.description}
                  </p>
                </div>

                <div
                  className="flex flex-col gap-2 rounded-xl bg-surface p-5 border border-border animate-fade-up opacity-0"
                  style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
                >
                  <p className="text-sm font-medium text-muted-foreground">Emotional Pattern</p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {analysisData.emotionalPattern.title}
                  </h3>
                  <p className="text-sm text-foreground mt-1">
                    {analysisData.emotionalPattern.description}
                  </p>
                </div>

                <div
                  className="flex flex-col gap-2 rounded-xl bg-surface p-5 border border-border animate-fade-up opacity-0"
                  style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
                >
                  <p className="text-sm font-medium text-muted-foreground">Thought Pattern</p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {analysisData.thoughtPattern.title}
                  </h3>
                  <p className="text-sm text-foreground mt-1">
                    {analysisData.thoughtPattern.description}
                  </p>
                </div>
              </div>

              {/* Core Topics & Relevant Excerpts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core Topics */}
                <div
                  className="lg:col-span-1 bg-surface p-6 rounded-xl border border-border animate-fade-up opacity-0"
                  style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                >
                  <h3 className="text-lg font-bold text-foreground">Core Topics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Words and concepts that appeared most often in your writing.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.coreTopics.map((topic, index) => {
                      const colorSet = TOPIC_COLORS[index % TOPIC_COLORS.length];
                      return (
                        <span
                          key={topic.name}
                          className={`px-3 py-1 text-sm font-medium rounded-full ${colorSet.bg} ${colorSet.text}`}
                        >
                          {topic.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Relevant Excerpts */}
                <div
                  className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border animate-fade-up opacity-0"
                  style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
                >
                  <h3 className="text-lg font-bold text-foreground">Relevant Excerpts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Snippets from your journal that highlight these insights.
                  </p>
                  <div className="space-y-4">
                    {analysisData.relevantExcerpts.map((excerpt, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-background border border-border"
                      >
                        <p className="text-sm italic text-muted-foreground">
                          "{excerpt.text}"
                        </p>
                        <button
                          onClick={() => handleEntryClick(excerpt.entryId)}
                          className="text-xs font-semibold text-primary mt-2 block hover:underline"
                        >
                          See Entry from {formatDate(excerpt.date)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy Footer */}
              <div
                className="text-center py-4 animate-fade-up opacity-0"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Your journal is private and your data is protected.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-surface py-16 text-center animate-fade-up">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface-elevated">
                <span className="material-symbols-outlined text-4xl text-muted-foreground">
                  psychology
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No entries in this time period
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try selecting a different time range or add more entries
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
