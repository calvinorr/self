"use client";

import type { Entry } from "@/db/schema";

interface InsightsPanelProps {
  entries: Entry[];
}

export function InsightsPanel({ entries }: InsightsPanelProps) {
  // Calculate mood distribution from entries
  const moodCounts = entries.reduce(
    (acc, entry) => {
      if (entry.mood) {
        const mood = entry.mood.toLowerCase();
        if (["happy", "excited", "grateful", "hopeful", "calm"].includes(mood)) {
          acc.positive++;
        } else if (["sad", "anxious", "frustrated", "tired"].includes(mood)) {
          acc.negative++;
        } else {
          acc.neutral++;
        }
      }
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const total = moodCounts.positive + moodCounts.neutral + moodCounts.negative || 1;
  const positivePercent = Math.round((moodCounts.positive / total) * 100);
  const neutralPercent = Math.round((moodCounts.neutral / total) * 100);
  const negativePercent = Math.round((moodCounts.negative / total) * 100);

  // Extract themes from AI insights (simple keyword extraction)
  const themes = extractThemes(entries);

  // Get a reflection prompt
  const prompt = getReflectionPrompt(entries);

  return (
    <aside className="w-full max-w-sm flex-shrink-0 space-y-6">
      <h2 className="text-lg font-medium text-muted-foreground px-2">
        Your AI Insights
      </h2>

      {/* Mood Analysis Card */}
      <div className="rounded-lg border border-border bg-surface p-5 animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-foreground">Mood Analysis</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Predominant feelings in your recent entries
        </p>
        <div className="mt-4 space-y-3">
          <MoodBar
            icon="sentiment_satisfied"
            label="Positive"
            percent={positivePercent}
            color="positive"
          />
          <MoodBar
            icon="sentiment_neutral"
            label="Neutral"
            percent={neutralPercent}
            color="neutral"
          />
          <MoodBar
            icon="sentiment_dissatisfied"
            label="Negative"
            percent={negativePercent}
            color="negative"
          />
        </div>
      </div>

      {/* Key Themes Card */}
      <div className="rounded-lg border border-border bg-surface p-5 animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-foreground">Key Themes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Common topics from your entries
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {themes.length > 0 ? (
            themes.map((theme) => (
              <span
                key={theme}
                className="rounded-md bg-surface-elevated px-3 py-1 text-sm font-medium text-muted-foreground capitalize"
              >
                {theme}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Write more entries to discover themes
            </span>
          )}
        </div>
      </div>

      {/* Reflection Prompt Card */}
      <div className="rounded-lg border border-border bg-surface p-5 animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-foreground">Reflection Prompt</h3>
        <p className="mt-3 font-body text-base italic leading-relaxed text-muted-foreground">
          "{prompt}"
        </p>
      </div>
    </aside>
  );
}

function MoodBar({
  icon,
  label,
  percent,
  color,
}: {
  icon: string;
  label: string;
  percent: number;
  color: "positive" | "neutral" | "negative";
}) {
  const colorClasses = {
    positive: "text-emerald-500 bg-emerald-500",
    neutral: "text-amber-500 bg-amber-500",
    negative: "text-rose-500 bg-rose-500",
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`material-symbols-outlined ${colorClasses[color].split(" ")[0]}`}>
        {icon}
      </span>
      <div className="w-full">
        <p className="text-sm font-medium text-foreground">
          {label}
          <span className="float-right text-muted-foreground">{percent}%</span>
        </p>
        <div className="mt-1 h-1.5 w-full rounded-full bg-surface-elevated">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${colorClasses[color].split(" ")[1]}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function extractThemes(entries: Entry[]): string[] {
  // Simple theme extraction based on common words in titles
  const words: Record<string, number> = {};
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "it", "my", "i", "me", "was", "had",
    "have", "has", "been", "this", "that", "about", "today", "day"
  ]);

  entries.forEach((entry) => {
    const titleWords = entry.title.toLowerCase().split(/\s+/);
    titleWords.forEach((word) => {
      const clean = word.replace(/[^a-z]/g, "");
      if (clean.length > 3 && !stopWords.has(clean)) {
        words[clean] = (words[clean] || 0) + 1;
      }
    });
  });

  return Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function getReflectionPrompt(entries: Entry[]): string {
  const prompts = [
    "What small step could you take today towards a goal that matters to you?",
    "What are you grateful for right now that you haven't acknowledged recently?",
    "If you could give advice to yourself a year ago, what would it be?",
    "What patterns do you notice in your recent thoughts and feelings?",
    "What would make today meaningful?",
    "What have you learned about yourself this week?",
    "What's something you've been avoiding that deserves your attention?",
  ];

  // Use entry count to pseudo-randomly select a prompt
  const index = entries.length % prompts.length;
  return prompts[index];
}
