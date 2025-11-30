"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { MoodPicker } from "@/components/mood-picker";
import { useAutosave } from "@/hooks/use-autosave";
import { SaveStatusIndicator } from "@/components/save-status";
import { getRandomPrompt } from "@/lib/prompts";

export default function NewEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [entryId, setEntryId] = useState<number | null>(null);
  const [showInspiration, setShowInspiration] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [personalizedPrompts, setPersonalizedPrompts] = useState<string[]>([]);
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(false);
  const [promptType, setPromptType] = useState<"random" | "personalized">("random");
  const isCreatingRef = useRef(false);

  const handleAutosave = useCallback(async () => {
    if (!title.trim() || !content.trim()) return false;
    if (isCreatingRef.current) return false;

    try {
      if (entryId) {
        const response = await fetch(`/api/entries/${entryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, aiInsight }),
        });
        return response.ok;
      } else {
        isCreatingRef.current = true;
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, aiInsight }),
        });
        if (response.ok) {
          const data = await response.json();
          setEntryId(data.id);
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

  const handleAnalyze = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setShowAiPanel(true);
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: stripHtml(content) }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiInsight(data.text);
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePrompt = () => {
    setCurrentPrompt(getRandomPrompt());
    setPromptType("random");
    setShowInspiration(true);
  };

  const fetchPersonalizedPrompts = async () => {
    setIsLoadingPersonalized(true);
    setShowInspiration(true);
    setPromptType("personalized");

    try {
      const response = await fetch("/api/prompts/personalized");
      const data = await response.json();

      if (response.ok && data.prompts?.length > 0) {
        setPersonalizedPrompts(data.prompts);
        setCurrentPrompt(data.prompts[0]);
      } else {
        // Fallback to random if personalized fails
        setCurrentPrompt(getRandomPrompt());
        setPromptType("random");
      }
    } catch (err) {
      console.error("Failed to fetch personalized prompts:", err);
      setCurrentPrompt(getRandomPrompt());
      setPromptType("random");
    } finally {
      setIsLoadingPersonalized(false);
    }
  };

  const nextPersonalizedPrompt = () => {
    if (personalizedPrompts.length > 0) {
      const currentIndex = personalizedPrompts.indexOf(currentPrompt || "");
      const nextIndex = (currentIndex + 1) % personalizedPrompts.length;
      setCurrentPrompt(personalizedPrompts[nextIndex]);
    }
  };

  const usePrompt = () => {
    if (currentPrompt) {
      setTitle(currentPrompt);
      setContent(`<p></p>`);
      setShowInspiration(false);
    }
  };

  const wordCount = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean).length;

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
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
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
            {/* Inspiration Buttons */}
            {!content.trim() && !showInspiration && (
              <div className="mb-4 flex items-center gap-4">
                <button
                  onClick={generatePrompt}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-lg group-hover:animate-pulse"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shuffle
                  </span>
                  <span>Random prompt</span>
                </button>
                <span className="text-muted-foreground/30">or</span>
                <button
                  onClick={fetchPersonalizedPrompts}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-lg group-hover:animate-pulse"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  <span>Personalized for you</span>
                </button>
              </div>
            )}

            {/* Inspiration Card */}
            {showInspiration && (
              <div className="mb-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-5">
                {isLoadingPersonalized ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <span className="material-symbols-outlined text-lg text-primary animate-spin">
                        progress_activity
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                        Personalizing...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Creating prompts based on your journal themes
                      </p>
                    </div>
                  </div>
                ) : currentPrompt ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <span
                          className="material-symbols-outlined text-lg text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {promptType === "personalized" ? "auto_awesome" : "shuffle"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                          {promptType === "personalized" ? "Personalized Prompt" : "Writing Prompt"}
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          {currentPrompt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 ml-12">
                      <button
                        onClick={usePrompt}
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                        Use this
                      </button>
                      <button
                        onClick={promptType === "personalized" ? nextPersonalizedPrompt : generatePrompt}
                        className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Another
                      </button>
                      {promptType === "personalized" && (
                        <button
                          onClick={generatePrompt}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">shuffle</span>
                          Random
                        </button>
                      )}
                      {promptType === "random" && (
                        <button
                          onClick={fetchPersonalizedPrompts}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">auto_awesome</span>
                          Personalize
                        </button>
                      )}
                      <button
                        onClick={() => setShowInspiration(false)}
                        className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {/* Title Row with Mood */}
            <div className="flex items-start gap-6 mb-4">
              <input
                type="text"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />

              {/* Mood Picker with AI suggestion */}
              <div className="shrink-0">
                <MoodPicker
                  value={mood}
                  onChange={setMood}
                  content={content}
                />
              </div>
            </div>

            {/* Editor - Larger */}
            <div className="min-h-[300px]">
              <Editor
                content={content}
                onChange={setContent}
                placeholder="Start writing... Let your thoughts flow freely."
                className="min-h-[300px]"
              />
            </div>

            {/* AI Reflection Panel */}
            <div className="mt-8">
              <div className="rounded-xl border border-border bg-surface/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-xl text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      psychology
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      AI Reflection
                    </p>
                  </div>
                  {!isAnalyzing && (
                    <button
                      onClick={handleAnalyze}
                      disabled={!content.trim()}
                      className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        auto_awesome
                      </span>
                      {aiInsight ? "Regenerate" : "Generate Insight"}
                    </button>
                  )}
                </div>

                {!aiInsight && !isAnalyzing && !showAiPanel && (
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered reflections on your writing to gain deeper insights into your thoughts.
                  </p>
                )}

                {isAnalyzing && (
                  <div className="flex items-center gap-3 text-muted-foreground py-4">
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    <span className="text-sm">Analyzing your thoughts...</span>
                  </div>
                )}

                {aiInsight && !isAnalyzing && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {aiInsight}
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
