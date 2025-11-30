"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const moods = [
  { value: "great", icon: "sentiment_very_satisfied", label: "Great", color: "text-emerald-400", bg: "bg-emerald-400/15 border-emerald-400/40 hover:bg-emerald-400/25" },
  { value: "good", icon: "sentiment_satisfied", label: "Good", color: "text-sky-400", bg: "bg-sky-400/15 border-sky-400/40 hover:bg-sky-400/25" },
  { value: "okay", icon: "sentiment_neutral", label: "Okay", color: "text-amber-400", bg: "bg-amber-400/15 border-amber-400/40 hover:bg-amber-400/25" },
  { value: "low", icon: "sentiment_dissatisfied", label: "Low", color: "text-orange-400", bg: "bg-orange-400/15 border-orange-400/40 hover:bg-orange-400/25" },
  { value: "rough", icon: "sentiment_sad", label: "Rough", color: "text-rose-400", bg: "bg-rose-400/15 border-rose-400/40 hover:bg-rose-400/25" },
] as const;

type MoodValue = (typeof moods)[number]["value"];

interface MoodPickerProps {
  value: string | null;
  onChange: (mood: string | null) => void;
  content: string;
  /** If true, user has explicitly selected a mood - don't auto-suggest */
  userHasSelected?: boolean;
  onUserSelect?: () => void;
}

export function MoodPicker({
  value,
  onChange,
  content,
  userHasSelected = false,
  onUserSelect,
}: MoodPickerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<MoodValue | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleMoodClick = (moodValue: string) => {
    // User explicitly selecting - clear any suggestion
    setSuggestion(null);
    setShowSuggestion(false);
    onChange(value === moodValue ? null : moodValue);
    onUserSelect?.();
  };

  const handleSuggestMood = async () => {
    if (!content || content.trim().length < 20) return;

    setIsAnalyzing(true);
    setSuggestion(null);

    try {
      const response = await fetch("/api/analyze/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestion(data.mood);
        setShowSuggestion(true);
      }
    } catch (error) {
      console.error("Failed to analyze mood:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onChange(suggestion);
      onUserSelect?.();
    }
    setShowSuggestion(false);
    setSuggestion(null);
  };

  const handleDismissSuggestion = () => {
    setShowSuggestion(false);
    setSuggestion(null);
  };

  const suggestedMoodData = suggestion
    ? moods.find((m) => m.value === suggestion)
    : null;

  const hasEnoughContent = content && content.trim().length >= 20;

  return (
    <div className="flex items-center gap-2">
      {/* Mood buttons */}
      <div className="flex items-center gap-1.5">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => handleMoodClick(m.value)}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200",
              value === m.value
                ? `${m.bg} ${m.color} border-current`
                : suggestion === m.value && showSuggestion
                ? `${m.bg} ${m.color} border-current animate-pulse`
                : `border-transparent hover:border-border hover:bg-surface-elevated/50`
            )}
            title={m.label}
          >
            <span
              className={cn("material-symbols-outlined text-xl", m.color)}
              style={{
                fontVariationSettings:
                  value === m.value
                    ? "'FILL' 1, 'wght' 500"
                    : "'FILL' 0, 'wght' 400",
              }}
            >
              {m.icon}
            </span>
          </button>
        ))}
      </div>

      {/* AI Suggest button - only show if no mood selected and not already showing suggestion */}
      {!value && !showSuggestion && (
        <button
          onClick={handleSuggestMood}
          disabled={isAnalyzing || !hasEnoughContent}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            hasEnoughContent
              ? "text-primary hover:bg-primary/10 border border-primary/20"
              : "text-muted-foreground cursor-not-allowed"
          )}
          title={
            hasEnoughContent
              ? "AI will suggest a mood based on your writing"
              : "Write a bit more for AI to suggest a mood"
          }
        >
          {isAnalyzing ? (
            <>
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
              Analyzing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">
                auto_awesome
              </span>
              Suggest
            </>
          )}
        </button>
      )}

      {/* Suggestion UI */}
      {showSuggestion && suggestedMoodData && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-xs text-muted-foreground">AI suggests:</span>
          <span
            className={cn(
              "material-symbols-outlined text-lg",
              suggestedMoodData.color
            )}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {suggestedMoodData.icon}
          </span>
          <span className={cn("text-sm font-medium", suggestedMoodData.color)}>
            {suggestedMoodData.label}
          </span>
          <button
            onClick={handleAcceptSuggestion}
            className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Accept suggestion"
          >
            <span className="material-symbols-outlined text-sm">check</span>
          </button>
          <button
            onClick={handleDismissSuggestion}
            className="flex items-center justify-center w-6 h-6 rounded bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Dismiss"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
