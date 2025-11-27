"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Editor } from "@/components/editor";
import { MoodSelect } from "@/components/mood-select";
import { AIInsight } from "@/components/ai-insight";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function NewEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mood, aiInsight }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Entry</h1>
        <div className="flex-1" />
        <Button
          onClick={handleSave}
          disabled={!title.trim() || !content.trim() || isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
      </header>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Input
              placeholder="Entry title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-0 px-0 focus-visible:ring-0"
            />
            <Editor
              content={content}
              onChange={setContent}
              placeholder="What's on your mind today?"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">
                How are you feeling?
              </label>
              <MoodSelect value={mood} onChange={setMood} />
            </div>
          </CardContent>
        </Card>

        {content.trim() && (
          <AIInsight
            title={title}
            content={content}
            onInsightGenerated={setAiInsight}
          />
        )}
      </div>
    </main>
  );
}
