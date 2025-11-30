"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { AIInsight } from "@/components/ai-insight";
import { useAutosave } from "@/hooks/use-autosave";
import { SaveStatusIndicator } from "@/components/save-status";
import { cn } from "@/lib/utils";
import type { Entry } from "@/db/schema";

// Mood options with distinct colors always visible
const moods = [
  { value: "great", icon: "sentiment_very_satisfied", label: "Great", color: "text-emerald-400", bg: "bg-emerald-400/15 border-emerald-400/40 hover:bg-emerald-400/25" },
  { value: "good", icon: "sentiment_satisfied", label: "Good", color: "text-sky-400", bg: "bg-sky-400/15 border-sky-400/40 hover:bg-sky-400/25" },
  { value: "okay", icon: "sentiment_neutral", label: "Okay", color: "text-amber-400", bg: "bg-amber-400/15 border-amber-400/40 hover:bg-amber-400/25" },
  { value: "low", icon: "sentiment_dissatisfied", label: "Low", color: "text-orange-400", bg: "bg-orange-400/15 border-orange-400/40 hover:bg-orange-400/25" },
  { value: "rough", icon: "sentiment_sad", label: "Rough", color: "text-rose-400", bg: "bg-rose-400/15 border-rose-400/40 hover:bg-rose-400/25" },
];

export default function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const response = await fetch(`/api/entries/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEntry(data);
          setTitle(data.title);
          setContent(data.content);
          setMood(data.mood);
          setAiInsight(data.aiInsight);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error("Failed to fetch entry:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntry();
  }, [id]);

  const handleAutosave = useCallback(async () => {
    if (!title.trim() || !content.trim()) return false;

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mood, aiInsight }),
      });
      return response.ok;
    } catch (error) {
      console.error("Autosave failed:", error);
      return false;
    }
  }, [id, title, content, mood, aiInsight]);

  const { status, lastSaved } = useAutosave({
    data: { title, content, mood, aiInsight },
    onSave: handleAutosave,
    interval: 30000,
    enabled: isDataLoaded && !!(title.trim() && content.trim()),
  });

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mood, aiInsight }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete entry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const wordCount = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
            <span>Loading entry...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-muted-foreground">error</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Entry not found</h2>
            <p className="text-muted-foreground mb-6">This entry may have been deleted.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              Go back home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const createdDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <header className="shrink-0 flex items-center justify-between border-b border-border bg-surface/50 backdrop-blur-sm px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Link>
            <div className="h-5 w-px bg-border" />
            <SaveStatusIndicator status={status} lastSaved={lastSaved} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
              title="Delete entry"
            >
              {isDeleting ? (
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-base">delete</span>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isSaving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  Done
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Writing Area - Full Width */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-5xl mx-auto px-8 pt-8 pb-16">
            {/* Date Badge */}
            <span className="text-xs text-muted-foreground mb-4 block">{createdDate}</span>

            {/* Title Row with Mood */}
            <div className="flex items-start gap-6 mb-4">
              <input
                type="text"
                placeholder="Entry title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />

              {/* Mood Tracker - Compact inline */}
              <div className="flex items-center gap-1.5 shrink-0">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(mood === m.value ? null : m.value)}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200",
                      mood === m.value
                        ? `${m.bg} ${m.color} border-current`
                        : `border-transparent hover:border-border hover:bg-surface-elevated/50`
                    )}
                    title={m.label}
                  >
                    <span
                      className={cn("material-symbols-outlined text-xl", m.color)}
                      style={{ fontVariationSettings: mood === m.value ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
                    >
                      {m.icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor - Larger */}
            <div className="min-h-[300px]">
              <Editor
                content={content}
                onChange={setContent}
                placeholder="What's on your mind?"
                className="min-h-[300px]"
              />
            </div>

            {/* AI Insight with Conversation */}
            <div className="mt-8">
              <AIInsight
                title={title}
                content={content}
                existingInsight={aiInsight}
                onInsightGenerated={setAiInsight}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
