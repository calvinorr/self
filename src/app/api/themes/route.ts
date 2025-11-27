import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entries } = body;

    if (!entries || entries.length < 3) {
      return NextResponse.json(
        { error: "Need at least 3 entries to discover themes" },
        { status: 400 }
      );
    }

    // Prepare entries for analysis (limit to prevent token overflow)
    const entrySummaries = entries.slice(0, 30).map((entry: {
      title: string;
      content: string;
      mood: string | null;
      createdAt: string;
    }) => ({
      title: entry.title,
      content: entry.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500),
      mood: entry.mood,
      date: new Date(entry.createdAt).toLocaleDateString(),
    }));

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an insightful journal analyst. Your task is to identify recurring themes and patterns across multiple journal entries.

Your response MUST be valid JSON with this exact structure:
{
  "themes": [
    {
      "name": "Theme Name",
      "description": "Brief description of this theme",
      "frequency": "high|medium|low",
      "sentiment": "positive|neutral|challenging",
      "relatedEntries": ["Entry title 1", "Entry title 2"]
    }
  ],
  "overallTone": "Brief summary of the overall emotional tone",
  "growthAreas": ["Area 1", "Area 2"],
  "strengths": ["Strength 1", "Strength 2"]
}

Guidelines:
- Identify 5-7 meaningful themes
- Be insightful but not clinical
- Focus on patterns that could promote self-awareness
- Be supportive and non-judgmental
- Return ONLY the JSON, no additional text`,
      prompt: `Analyze these journal entries and identify recurring themes:

${entrySummaries.map((e: { date: string; title: string; mood: string | null; content: string }, i: number) => `
Entry ${i + 1} (${e.date}):
Title: ${e.title}
Mood: ${e.mood || "not specified"}
Content: ${e.content}
`).join("\n---\n")}`,
    });

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const themes = JSON.parse(jsonMatch[0]);
    return NextResponse.json(themes);
  } catch (error) {
    console.error("Themes API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze themes" },
      { status: 500 }
    );
  }
}
