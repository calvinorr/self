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

type ViewMode = "month" | "week" | "year";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function CalendarPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [isLoading, setIsLoading] = useState(true);

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

  // Map entries by date for quick lookup
  const entriesByDate = useMemo(() => {
    const map = new Map<string, Entry[]>();
    entries.forEach((entry) => {
      const dateKey = new Date(entry.createdAt).toDateString();
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, entry]);
    });
    return map;
  }, [entries]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Get selected date's entries
  const selectedEntries = selectedDate
    ? entriesByDate.get(selectedDate.toDateString()) || []
    : [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const hasEntry = (day: number) => {
    const dateKey = new Date(year, month, day).toDateString();
    return entriesByDate.has(dateKey);
  };

  // Generate calendar grid
  const calendarDays = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background scrollbar-thin">
        <div className="p-8">
          {/* Header */}
          <header className="mb-8 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Calendar View
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              Navigate your journal entries by date.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              {/* Month Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined text-2xl">chevron_left</span>
                  </button>
                  <h2 className="px-3 text-lg font-semibold text-foreground min-w-[180px] text-center">
                    {MONTHS[month]} {year}
                  </h2>
                  <button
                    onClick={handleNextMonth}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined text-2xl">chevron_right</span>
                  </button>
                </div>

                {/* View Toggle */}
                <div className="flex h-9 items-center rounded-lg bg-surface p-1">
                  {(["month", "week", "year"] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                        viewMode === mode
                          ? "bg-background text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="rounded-xl border border-border bg-surface p-5">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="flex h-10 items-center justify-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && handleDateSelect(day)}
                      disabled={!day}
                      className={`relative flex h-14 w-full items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        !day
                          ? "cursor-default"
                          : isSelected(day)
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : isToday(day)
                          ? "bg-primary/20 text-primary ring-1 ring-primary/50"
                          : "text-foreground hover:bg-surface-elevated"
                      }`}
                    >
                      {day && (
                        <>
                          <span className="z-10">{day}</span>
                          {hasEntry(day) && !isSelected(day) && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/60" />
                  <span>Has entry</span>
                </div>
              </div>
            </div>

            {/* Selected Date Panel */}
            <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <div className="sticky top-8 rounded-xl border border-border bg-surface p-6">
                {selectedDate ? (
                  <>
                    <header className="mb-4">
                      <h2 className="text-xl font-semibold text-foreground">
                        {selectedDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h2>
                      {selectedEntries.length > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground italic">
                          {selectedEntries.length} {selectedEntries.length === 1 ? "entry" : "entries"}
                        </p>
                      )}
                    </header>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <span className="material-symbols-outlined text-2xl text-muted-foreground animate-spin">
                          progress_activity
                        </span>
                      </div>
                    ) : selectedEntries.length > 0 ? (
                      <div className="space-y-4">
                        {selectedEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30"
                          >
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {entry.title || "Untitled Entry"}
                            </h3>
                            <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {stripHtml(entry.content)}
                            </p>

                            {/* AI Insights Preview */}
                            {entry.aiInsight && (
                              <div className="mt-3 rounded-md bg-primary/5 border border-primary/10 p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className="material-symbols-outlined text-sm text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                  >
                                    psychology
                                  </span>
                                  <span className="text-xs font-medium text-primary">AI Insight</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {entry.aiInsight}
                                </p>
                              </div>
                            )}

                            {entry.mood && (
                              <div className="mt-3 flex items-center gap-2">
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                                  {entry.mood}
                                </span>
                              </div>
                            )}

                            <Link
                              href={`/entry/${entry.id}`}
                              className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              View full entry
                              <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated">
                          <span className="material-symbols-outlined text-3xl text-muted-foreground">
                            edit_note
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          No entries for this date
                        </p>
                        <Link
                          href="/entry/new"
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">add</span>
                          Write an entry
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-muted-foreground">
                      calendar_month
                    </span>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Select a date to view entries
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
