"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
}

function Toggle({ enabled, onToggle, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-surface-elevated"
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  // Settings state (would be persisted in a real app)
  const [autosave, setAutosave] = useState(true);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [showWordCount, setShowWordCount] = useState(true);
  const [compactView, setCompactView] = useState(false);

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/entries");
      if (response.ok) {
        const entries = await response.json();
        const blob = new Blob([JSON.stringify(entries, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `journal-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background scrollbar-thin">
        <div className="mx-auto max-w-2xl p-8">
          {/* Header */}
          <header className="mb-8 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              Customize your journaling experience.
            </p>
          </header>

          <div className="space-y-6">
            {/* Writing Settings */}
            <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <SettingsSection
                title="Writing"
                description="Configure your writing experience"
              >
                <div className="divide-y divide-border">
                  <Toggle
                    enabled={autosave}
                    onToggle={() => setAutosave(!autosave)}
                    label="Autosave"
                    description="Automatically save entries while you write"
                  />
                  <Toggle
                    enabled={showWordCount}
                    onToggle={() => setShowWordCount(!showWordCount)}
                    label="Show word count"
                    description="Display word count while writing"
                  />
                </div>
              </SettingsSection>
            </div>

            {/* AI Settings */}
            <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
              <SettingsSection
                title="AI Insights"
                description="Configure AI-powered features"
              >
                <div className="divide-y divide-border">
                  <Toggle
                    enabled={autoAnalyze}
                    onToggle={() => setAutoAnalyze(!autoAnalyze)}
                    label="Auto-analyze entries"
                    description="Automatically generate AI insights when you save"
                  />
                </div>
                <div className="mt-4 rounded-lg bg-surface-elevated p-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">
                      info
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        About AI Insights
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        AI insights are powered by Google Gemini. Your entries are sent to
                        the AI for analysis but are not stored by the AI service.
                      </p>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </div>

            {/* Appearance */}
            <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <SettingsSection
                title="Appearance"
                description="Customize how the app looks"
              >
                <div className="divide-y divide-border">
                  <Toggle
                    enabled={compactView}
                    onToggle={() => setCompactView(!compactView)}
                    label="Compact view"
                    description="Show more entries on the dashboard"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground mb-3">Theme</p>
                  <div className="flex gap-3">
                    <button className="flex-1 rounded-lg border-2 border-primary bg-surface-elevated p-4 text-center">
                      <div className="mx-auto h-8 w-8 rounded-full bg-zinc-900 border border-zinc-700" />
                      <p className="mt-2 text-sm font-medium text-foreground">Dark</p>
                    </button>
                    <button className="flex-1 rounded-lg border border-border bg-surface p-4 text-center opacity-50 cursor-not-allowed">
                      <div className="mx-auto h-8 w-8 rounded-full bg-white border border-zinc-200" />
                      <p className="mt-2 text-sm font-medium text-muted-foreground">Light</p>
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    </button>
                    <button className="flex-1 rounded-lg border border-border bg-surface p-4 text-center opacity-50 cursor-not-allowed">
                      <div className="mx-auto h-8 w-8 rounded-full bg-gradient-to-br from-white to-zinc-900 border border-zinc-400" />
                      <p className="mt-2 text-sm font-medium text-muted-foreground">System</p>
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    </button>
                  </div>
                </div>
              </SettingsSection>
            </div>

            {/* Data */}
            <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
              <SettingsSection
                title="Data"
                description="Manage your journal data"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Export data</p>
                      <p className="text-sm text-muted-foreground">
                        Download all your entries as JSON
                      </p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Delete all data</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all entries and insights
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      onClick={() => {
                        if (window.confirm("Are you sure? This cannot be undone.")) {
                          // Would implement actual deletion
                          alert("Feature not implemented yet");
                        }
                      }}
                    >
                      <span className="material-symbols-outlined text-lg">delete_forever</span>
                      Delete
                    </button>
                  </div>
                </div>
              </SettingsSection>
            </div>

            {/* About */}
            <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <SettingsSection
                title="About"
                description="Information about the app"
              >
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span className="text-foreground">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Built with</span>
                    <span className="text-foreground">Next.js, SQLite, Gemini AI</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <a
                    href="https://github.com/calvinorr/self"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </SettingsSection>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
