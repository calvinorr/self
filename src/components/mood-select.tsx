"use client";

import { cn } from "@/lib/utils";

const moods = [
  { value: "happy", label: "Happy", icon: "sentiment_very_satisfied" },
  { value: "excited", label: "Excited", icon: "celebration" },
  { value: "grateful", label: "Grateful", icon: "favorite" },
  { value: "hopeful", label: "Hopeful", icon: "wb_sunny" },
  { value: "calm", label: "Calm", icon: "spa" },
  { value: "neutral", label: "Neutral", icon: "sentiment_neutral" },
  { value: "tired", label: "Tired", icon: "bedtime" },
  { value: "anxious", label: "Anxious", icon: "psychology_alt" },
  { value: "frustrated", label: "Frustrated", icon: "sentiment_stressed" },
  { value: "sad", label: "Sad", icon: "sentiment_sad" },
];

interface MoodSelectProps {
  value: string | null;
  onChange: (mood: string) => void;
}

export function MoodSelect({ value, onChange }: MoodSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "border hover:border-primary/50 hover:bg-primary/5",
            value === mood.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "material-symbols-outlined text-lg",
              value === mood.value && "text-primary"
            )}
            style={{ fontVariationSettings: value === mood.value ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
          >
            {mood.icon}
          </span>
          <span>{mood.label}</span>
        </button>
      ))}
    </div>
  );
}
