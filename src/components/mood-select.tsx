"use client";

import { cn } from "@/lib/utils";

const moods = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "excited", label: "Excited", emoji: "🎉" },
  { value: "grateful", label: "Grateful", emoji: "🙏" },
  { value: "frustrated", label: "Frustrated", emoji: "😤" },
  { value: "hopeful", label: "Hopeful", emoji: "🌟" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
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
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
            "border hover:border-primary hover:bg-accent",
            value === mood.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border"
          )}
        >
          <span>{mood.emoji}</span>
          <span>{mood.label}</span>
        </button>
      ))}
    </div>
  );
}
