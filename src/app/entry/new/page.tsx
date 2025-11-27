"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { MoodSelect } from "@/components/mood-select";
import { AIInsight } from "@/components/ai-insight";

export default function NewEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
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
            <h1 className="text-xl font-semibold text-foreground">New Entry</h1>
          </div>
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
                Save Entry
              </>
            )}
          </button>
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
