"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const getIcon = () => {
    if (theme === "system") {
      return "computer";
    } else if (theme === "light") {
      return "light_mode";
    } else {
      return "dark_mode";
    }
  };

  const getLabel = () => {
    if (theme === "system") {
      return "System";
    } else if (theme === "light") {
      return "Light";
    } else {
      return "Dark";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors w-full"
      title={`Theme: ${getLabel()} (click to change)`}
    >
      <span className="material-symbols-outlined text-lg">{getIcon()}</span>
      <span className="flex-1 text-left">{getLabel()}</span>
      <span className="material-symbols-outlined text-base opacity-50">
        {resolvedTheme === "dark" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
