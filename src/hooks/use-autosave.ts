"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions {
  data: Record<string, unknown>;
  onSave: () => Promise<boolean>;
  interval?: number; // ms, default 30000 (30 seconds)
  enabled?: boolean;
}

export function useAutosave({
  data,
  onSave,
  interval = 30000,
  enabled = true,
}: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const previousDataRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const currentDataString = JSON.stringify(data);

  const save = useCallback(async () => {
    if (!isMountedRef.current) return;

    setStatus("saving");
    try {
      const success = await onSave();
      if (isMountedRef.current) {
        if (success) {
          setStatus("saved");
          setLastSaved(new Date());
          previousDataRef.current = currentDataString;
          // Reset to idle after 2 seconds
          setTimeout(() => {
            if (isMountedRef.current) setStatus("idle");
          }, 2000);
        } else {
          setStatus("error");
        }
      }
    } catch {
      if (isMountedRef.current) {
        setStatus("error");
      }
    }
  }, [onSave, currentDataString]);

  // Autosave on interval when data changes
  useEffect(() => {
    if (!enabled) return;

    const hasChanges = currentDataString !== previousDataRef.current;

    if (hasChanges && previousDataRef.current !== "") {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        save();
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentDataString, enabled, interval, save]);

  // Initialize previous data on first render
  useEffect(() => {
    if (previousDataRef.current === "") {
      previousDataRef.current = currentDataString;
    }
  }, [currentDataString]);

  // Save on unmount/navigation if there are changes
  useEffect(() => {
    isMountedRef.current = true;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentDataString !== previousDataRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Save on unmount if there are unsaved changes
      if (currentDataString !== previousDataRef.current && enabled) {
        // Use sendBeacon for reliable save on page unload
        const hasTitle = (data as { title?: string }).title?.trim();
        const hasContent = (data as { content?: string }).content?.trim();
        if (hasTitle && hasContent) {
          save();
        }
      }
    };
  }, [currentDataString, data, enabled, save]);

  const hasUnsavedChanges = currentDataString !== previousDataRef.current;

  return {
    status,
    lastSaved,
    hasUnsavedChanges,
    save,
  };
}
