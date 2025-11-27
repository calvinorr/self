"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { MoodSelect } from "@/components/mood-select";
import { AIInsight } from "@/components/ai-insight";
import type { Entry } from "@/db/schema";

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
        }
      } catch (error) {
        console.error("Failed to fetch entry:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntry();
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
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
        <main className="flex-1 flex items-center justify-center">
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

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Edit Entry</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">delete</span>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isSaving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-6 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            {/* Title & Content Card */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <input
                type="text"
                placeholder="Entry title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-2xl font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="mt-4 border-t border-border pt-4">
                <Editor
                  content={content}
                  onChange={setContent}
                  placeholder="What's on your mind today?"
                />
              </div>
            </div>

            {/* Mood Card */}
            <div className="rounded-lg border border-border bg-surface p-6 animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
              <h3 className="text-sm font-medium text-foreground mb-4">
                How are you feeling?
              </h3>
              <MoodSelect value={mood} onChange={setMood} />
            </div>

            {/* AI Insight */}
            {content.trim() && (
              <div className="animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: "forwards" }}>
                <AIInsight
                  title={title}
                  content={content}
                  existingInsight={aiInsight}
                  onInsightGenerated={setAiInsight}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
