"use client";

import { useState, useCallback } from "react";
import { getRandomPrompt } from "@/lib/prompts";

interface WritingPromptProps {
  onSelectPrompt: (prompt: string) => void;
}

export function WritingPrompt({ onSelectPrompt }: WritingPromptProps) {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const generatePrompt = useCallback(() => {
    const prompt = getRandomPrompt();
    setCurrentPrompt(prompt);
    setIsVisible(true);
  }, []);

  const usePrompt = useCallback(() => {
    if (currentPrompt) {
      onSelectPrompt(currentPrompt);
      setIsVisible(false);
      setCurrentPrompt(null);
    }
  }, [currentPrompt, onSelectPrompt]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setCurrentPrompt(null);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={generatePrompt}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="material-symbols-outlined text-lg">lightbulb</span>
        <span>Need inspiration?</span>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <span className="material-symbols-outlined text-lg text-primary">
            lightbulb
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">
            Writing Prompt
          </p>
          <p className="text-base text-muted-foreground font-body italic">
            "{currentPrompt}"
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pl-11">
        <button
          onClick={usePrompt}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-base">check</span>
          Use this
        </button>
        <button
          onClick={generatePrompt}
          className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Another
        </button>
        <button
          onClick={dismiss}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
