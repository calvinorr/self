"use client";

import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/sidebar";
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

type SortOption = "newest" | "oldest" | "title";
type MoodFilter = "all" | string;

const MOODS = [
  "happy", "excited", "grateful", "hopeful", "calm",
  "neutral", "tired", "anxious", "frustrated", "sad"
];

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          stripHtml(entry.content).toLowerCase().includes(query)
      );
    }

    // Mood filter
    if (moodFilter !== "all") {
      result = result.filter((entry) => entry.mood === moodFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [entries, searchQuery, sortBy, moodFilter]);

  // Group entries by month
  const groupedEntries = useMemo(() => {
    const groups = new Map<string, Entry[]>();
    filteredEntries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(entry);
    });
    return Array.from(groups.entries()).map(([key, entries]) => ({
      key,
      label: new Date(entries[0].createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      entries,
    }));
  }, [filteredEntries]);

  const clearFilters = () => {
    setSearchQuery("");
    setMoodFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || moodFilter !== "all" || sortBy !== "newest";

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background scrollbar-thin">
        <div className="mx-auto max-w-4xl p-8">
          {/* Header */}
          <header className="mb-8 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                  All Entries
                </h1>
                <p className="mt-1 text-base text-muted-foreground">
                  {entries.length} {entries.length === 1 ? "entry" : "entries"} in your journal
                </p>
              </div>
              <Link
                href="/entry/new"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New Entry
              </Link>
            </div>
          </header>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4 animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            {/* Search Bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
                search
              </span>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    !
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">By title</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                  Clear filters
                </button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="rounded-xl border border-border bg-surface p-4 animate-fade-up">
                <h3 className="mb-3 text-sm font-medium text-foreground">Filter by mood</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMoodFilter("all")}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      moodFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All moods
                  </button>
                  {MOODS.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setMoodFilter(mood)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                        moodFilter === mood
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-3xl text-muted-foreground animate-spin">
                  progress_activity
                </span>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface py-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface-elevated">
                  <span className="material-symbols-outlined text-4xl text-muted-foreground">
                    {searchQuery || moodFilter !== "all" ? "search_off" : "book_4"}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {searchQuery || moodFilter !== "all" ? "No matching entries" : "No entries yet"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || moodFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start your journaling journey today"}
                </p>
                {!searchQuery && moodFilter === "all" && (
                  <Link
                    href="/entry/new"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Write your first entry
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {groupedEntries.map((group) => (
                  <div key={group.key}>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </h2>
                    <div className="space-y-3">
                      {group.entries.map((entry, index) => (
                        <Link
                          key={entry.id}
                          href={`/entry/${entry.id}`}
                          className="group block rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                          style={{
                            animationDelay: `${0.05 * index}s`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                  {entry.title || "Untitled Entry"}
                                </h3>
                                {entry.aiInsight && (
                                  <span
                                    className="material-symbols-outlined text-sm text-primary/60"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                    title="Has AI insight"
                                  >
                                    psychology
                                  </span>
                                )}
                              </div>
                              <p className="mt-1.5 font-body text-sm leading-relaxed text-muted-foreground line-clamp-2">
                                {stripHtml(entry.content)}
                              </p>
                              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">schedule</span>
                                  {formatRelativeDate(entry.createdAt)}
                                </span>
                                {entry.mood && (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary capitalize">
                                    {entry.mood}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-xl text-muted-foreground group-hover:text-primary transition-colors">
                              arrow_forward
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
