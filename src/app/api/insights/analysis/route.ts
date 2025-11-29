import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

interface EntryInput {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  createdAt: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entries, timeRange } = body as { entries: EntryInput[]; timeRange: string };

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: "No entries provided" },
        { status: 400 }
      );
    }

    // Prepare entries for analysis (limit content length to prevent token overflow)
    const entrySummaries = entries.slice(0, 30).map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500),
      mood: entry.mood,
      date: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: entry.createdAt,
    }));

    const timeRangeLabel = timeRange === "week" ? "7 days" : timeRange === "month" ? "30 days" : "all time";

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an empathetic journal analyst. Your task is to provide meaningful insights from journal entries.

Your response MUST be valid JSON with this exact structure:
{
  "summary": "A 2-3 paragraph narrative summary of the user's emotional landscape, themes, and patterns. Write in second person (you/your). Highlight key themes in **bold**. Be warm, insightful, and supportive.",
  "emergingTheme": {
    "title": "Short title (3-5 words)",
    "description": "1-2 sentences describing this emerging theme in their writing"
  },
  "emotionalPattern": {
    "title": "Short title (3-5 words)",
    "description": "1-2 sentences about emotional patterns observed"
  },
  "thoughtPattern": {
    "title": "Short title (3-5 words)",
    "description": "1-2 sentences about thought patterns or mindset observed"
  },
  "coreTopics": [
    { "name": "Topic Name" }
  ],
  "relevantExcerpts": [
    {
      "text": "A meaningful excerpt from an entry (keep brief, ~20-40 words)",
      "entryId": 123,
      "date": "2024-01-15T..."
    }
  ]
}

Guidelines:
- Write the summary as engaging prose, not bullet points
- Use **bold** for key themes in the summary
- Identify 4-6 core topics (single words or short phrases like "Work", "Family", "Personal Growth")
- Select 2-3 most relevant excerpts that illustrate the insights
- Keep excerpt texts brief but meaningful
- Be supportive and non-judgmental
- Return ONLY the JSON, no additional text`,
      prompt: `Analyze these ${entries.length} journal entries from the past ${timeRangeLabel} and provide insights:

${entrySummaries.map((e, i) => `
Entry ${i + 1} (${e.date}, ID: ${e.id}):
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

    const analysis = JSON.parse(jsonMatch[0]);

    // Ensure relevantExcerpts have proper dates from the original entries
    if (analysis.relevantExcerpts) {
      analysis.relevantExcerpts = analysis.relevantExcerpts.map((excerpt: { entryId: number; date?: string; text: string }) => {
        const originalEntry = entrySummaries.find(e => e.id === excerpt.entryId);
        return {
          ...excerpt,
          date: originalEntry?.fullDate || excerpt.date || new Date().toISOString(),
        };
      });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
