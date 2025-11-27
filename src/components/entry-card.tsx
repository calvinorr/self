"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Entry } from "@/db/schema";

interface EntryCardProps {
  entry: Entry;
  index?: number;
}

export function EntryCard({ entry, index = 0 }: EntryCardProps) {
  const stripHtml = (html: string) => {
    const tmp = html.replace(/<[^>]*>/g, " ");
    return tmp.replace(/\s+/g, " ").trim();
  };

  const preview = stripHtml(entry.content).slice(0, 200);

  return (
    <Link href={`/entry/${entry.id}`}>
      <article
        className="group rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:border-border/80 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 animate-fade-up opacity-0"
        style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-2">
              {formatDate(new Date(entry.createdAt))}
            </p>
            <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {entry.title}
            </h3>
            <p className="mt-3 font-body text-base leading-relaxed text-muted-foreground line-clamp-3">
              {preview}
              {stripHtml(entry.content).length > 200 && "..."}
            </p>
          </div>
          {entry.aiInsight && (
            <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <span
                className="material-symbols-outlined text-primary text-base"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
              >
                psychology
              </span>
              <span className="text-xs font-medium text-primary">AI</span>
            </div>
          )}
        </div>
        {entry.mood && (
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
              {entry.mood}
            </span>
          </div>
        )}
      </article>
    </Link>
  );
}
