"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";
import type { Entry } from "@/db/schema";
import { BookOpen, Sparkles } from "lucide-react";

interface EntryCardProps {
  entry: Entry;
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  calm: "😌",
  excited: "🎉",
  grateful: "🙏",
  frustrated: "😤",
  hopeful: "🌟",
  tired: "😴",
  neutral: "😐",
};

export function EntryCard({ entry }: EntryCardProps) {
  const stripHtml = (html: string) => {
    const tmp = html.replace(/<[^>]*>/g, " ");
    return tmp.replace(/\s+/g, " ").trim();
  };

  const preview = stripHtml(entry.content).slice(0, 150);

  return (
    <Link href={`/entry/${entry.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span className="truncate">{entry.title}</span>
                {entry.mood && (
                  <span className="text-lg" title={entry.mood}>
                    {moodEmojis[entry.mood] || "📝"}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {formatRelativeDate(new Date(entry.createdAt))}
              </CardDescription>
            </div>
            {entry.aiInsight && (
              <div className="shrink-0" title="Has AI insight">
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {preview}
            {stripHtml(entry.content).length > 150 && "..."}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
