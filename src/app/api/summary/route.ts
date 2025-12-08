import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entries, period } = body;

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: "No entries to summarize" },
        { status: 400 }
      );
    }

    const periodLabel = period === "week" ? "weekly" : "monthly";

    // Prepare entries for analysis
    const entrySummaries = entries.map((entry: {
      title: string;
      content: string;
      mood: string | null;
      createdAt: string;
    }) => ({
      title: entry.title,
      content: entry.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300),
      mood: entry.mood,
      date: new Date(entry.createdAt).toLocaleDateString(),
    }));

    // Calculate mood stats
    const moodCounts: Record<string, number> = {};
    entries.forEach((e: { mood: string | null }) => {
      if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `You are a warm, supportive journal companion providing ${periodLabel} reflection summaries.

Your response MUST be valid JSON with this exact structure:
{
  "headline": "A brief, encouraging headline for the period",
  "summary": "2-3 paragraph summary of the journaling period",
  "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3"],
  "moodInsight": "Brief insight about emotional patterns",
  "notableQuote": "A meaningful phrase or thought from one of the entries (or null)",
  "encouragement": "A brief, personalized encouragement for the coming period"
}

Guidelines:
- Be warm and supportive, like a wise friend
- Celebrate wins and progress
- Acknowledge challenges with compassion
- Focus on growth and self-awareness
- Keep the tone encouraging, never judgmental
- Return ONLY the JSON, no additional text`,
      prompt: `Create a ${periodLabel} summary for these ${entries.length} journal entries:

Most common mood: ${topMood || "varied"}

Entries:
${entrySummaries.map((e: { date: string; title: string; mood: string | null; content: string }, i: number) => `
${e.date}: "${e.title}"
Mood: ${e.mood || "not specified"}
${e.content}
`).join("\n---\n")}`,
    });

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const summary = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      ...summary,
      entryCount: entries.length,
      topMood,
      period,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate summary" },
      { status: 500 }
    );
  }
}
