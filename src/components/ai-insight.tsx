"use client";

import { useState } from "react";

interface AIInsightProps {
  title: string;
  content: string;
  existingInsight?: string | null;
  onInsightGenerated: (insight: string) => void;
}

export function AIInsight({
  title,
  content,
  existingInsight,
  onInsightGenerated,
}: AIInsightProps) {
  const [insight, setInsight] = useState(existingInsight || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setError(null);
    setIsLoading(true);

    const stripHtml = (html: string) => {
      return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: stripHtml(content) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setInsight(data.text);
      onInsightGenerated(data.text);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("AI Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayText = insight;

  if (!displayText && !isLoading) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span
                className="material-symbols-outlined text-xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
              >
                psychology
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Insight</h3>
              <p className="text-sm text-muted-foreground">Get personalized reflections on your entry</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!content.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Generate Insight
          </button>
        </div>
        {error && (
          <p className="mt-4 text-sm text-destructive flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <span
              className="material-symbols-outlined text-xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
            >
              psychology
            </span>
          </div>
          <h3 className="font-semibold text-foreground">AI Insight</h3>
        </div>
        {!isLoading && (
          <button
            onClick={handleAnalyze}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
            title="Regenerate insight"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        )}
      </div>
      <div className="mt-4 pl-[52px]">
        {isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
            <span className="text-sm">Analyzing your entry...</span>
          </div>
        ) : (
          <p className="font-body text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {displayText}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-destructive flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
