"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

interface Entry {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  aiInsight: string | null;
  createdAt: string;
}

interface EntrySearchProps {
  entries: Entry[];
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function EntrySearch({ entries }: EntrySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return entries
      .filter((entry) => {
        const titleMatch = entry.title.toLowerCase().includes(lowerQuery);
        const contentMatch = stripHtml(entry.content).toLowerCase().includes(lowerQuery);
        const insightMatch = entry.aiInsight?.toLowerCase().includes(lowerQuery);
        return titleMatch || contentMatch || insightMatch;
      })
      .slice(0, 10)
      .map((entry) => {
        const plainContent = stripHtml(entry.content);
        const lowerContent = plainContent.toLowerCase();
        const matchIndex = lowerContent.indexOf(lowerQuery);

        let snippet = "";
        if (matchIndex >= 0) {
          const start = Math.max(0, matchIndex - 40);
          const end = Math.min(plainContent.length, matchIndex + query.length + 60);
          snippet =
            (start > 0 ? "..." : "") +
            plainContent.slice(start, end) +
            (end < plainContent.length ? "..." : "");
        } else {
          snippet = plainContent.slice(0, 100) + (plainContent.length > 100 ? "..." : "");
        }

        return { ...entry, snippet };
      });
  }, [entries, query]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
          search
        </span>
        <input
          type="text"
          placeholder="Search entries..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
        {query && (
          <button
            onClick={handleClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={handleClose}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-lg border border-border bg-surface shadow-lg max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <span className="material-symbols-outlined text-2xl mb-2 block">search_off</span>
                <p className="text-sm">No entries found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                <div className="px-3 py-2 text-xs text-muted-foreground bg-surface-elevated">
                  {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                </div>
                {searchResults.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/entry/${entry.id}`}
                    onClick={handleClose}
                    className="block p-3 hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground text-sm">
                        {highlightText(entry.title, query)}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {highlightText(entry.snippet, query)}
                    </p>
                    {entry.mood && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-muted-foreground capitalize">
                        <span className="material-symbols-outlined text-sm">mood</span>
                        {entry.mood}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
