"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { MoodSelect } from "@/components/mood-select";
import { AIInsight } from "@/components/ai-insight";
import { useAutosave } from "@/hooks/use-autosave";
import { SaveStatusIndicator } from "@/components/save-status";
import { WritingPrompt } from "@/components/writing-prompt";

export default function NewEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [entryId, setEntryId] = useState<number | null>(null);
  const isCreatingRef = useRef(false);

  const handleAutosave = useCallback(async () => {
    if (!title.trim() || !content.trim()) return false;
    if (isCreatingRef.current) return false;

    try {
      if (entryId) {
        // Update existing draft
        const response = await fetch(`/api/entries/${entryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, aiInsight }),
        });
        return response.ok;
      } else {
        // Create new entry (first autosave)
        isCreatingRef.current = true;
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, aiInsight }),
        });
        if (response.ok) {
          const data = await response.json();
          setEntryId(data.id);
          // Update URL without navigation
          window.history.replaceState(null, "", `/entry/${data.id}`);
        }
        isCreatingRef.current = false;
        return response.ok;
      }
    } catch (error) {
      console.error("Autosave failed:", error);
      isCreatingRef.current = false;
      return false;
    }
  }, [title, content, mood, aiInsight, entryId]);

  const { status, lastSaved } = useAutosave({
    data: { title, content, mood, aiInsight },
    onSave: handleAutosave,
    interval: 30000,
    enabled: !!(title.trim() && content.trim()),
  });

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      if (entryId) {
        const response = await fetch(`/api/entries/${entryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, aiInsight }),
        });
        if (response.ok) {
          router.push("/");
          router.refresh();
        }
      } else {
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, aiInsight }),
        });
        if (response.ok) {
          router.push("/");
          router.refresh();
        }
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
            <SaveStatusIndicator status={status} lastSaved={lastSaved} />
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
            {/* Writing Prompt */}
            {!content.trim() && (
              <WritingPrompt
                onSelectPrompt={(prompt) => {
                  setTitle(prompt);
                  setContent(`<p>${prompt}</p><p></p>`);
                }}
              />
            )}

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
