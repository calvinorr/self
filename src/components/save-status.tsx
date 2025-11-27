"use client";

import { SaveStatus } from "@/hooks/use-autosave";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
}

export function SaveStatusIndicator({ status, lastSaved }: SaveStatusIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "saving" && (
        <>
          <span className="material-symbols-outlined text-base animate-spin text-muted-foreground">
            progress_activity
          </span>
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <span className="material-symbols-outlined text-base text-green-500">
            check_circle
          </span>
          <span className="text-green-500">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <span className="material-symbols-outlined text-base text-destructive">
            error
          </span>
          <span className="text-destructive">Save failed</span>
        </>
      )}
      {status === "idle" && lastSaved && (
        <span className="text-muted-foreground">
          Last saved {formatTime(lastSaved)}
        </span>
      )}
    </div>
  );
}
