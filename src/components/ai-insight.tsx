"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";

interface AIInsightProps {
  title: string;
  content: string;
  existingInsight?: string | null;
  onInsightGenerated: (insight: string) => void;
}

export function AIInsight({
  title,
  content,
  existingInsight,
  onInsightGenerated,
}: AIInsightProps) {
  const [insight, setInsight] = useState(existingInsight || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setError(null);
    setIsLoading(true);

    const stripHtml = (html: string) => {
      return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: stripHtml(content) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setInsight(data.text);
      onInsightGenerated(data.text);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("AI Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayText = insight;

  if (!displayText && !isLoading) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={handleAnalyze}
          disabled={!content.trim()}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Get AI Insight
        </Button>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Sparkles className="h-4 w-4" />
          AI Insight
          {!isLoading && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={handleAnalyze}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing your entry...
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{displayText}</p>
        )}
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
