import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getEntriesForUser } from "@/lib/queries";
import { isDevMode } from "@/lib/env";

export async function GET() {
  try {
    const session = await auth();

    // Allow dev bypass for testing
    const userId = session?.user?.id || (isDevMode() ? "dev-user" : null);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's recent entries
    const entries = await getEntriesForUser(userId);

    // If user has few entries, return generic personalized prompts
    if (entries.length < 3) {
      return NextResponse.json({
        prompts: [
          "What brought you to start journaling? What do you hope to discover?",
          "Describe a moment from today that made you pause and think.",
          "What's something you've been meaning to reflect on?",
        ],
        isPersonalized: false,
        message: "Write a few more entries to unlock personalized prompts based on your themes.",
      });
    }

    // Prepare recent entries for analysis (last 20)
    const recentEntries = entries.slice(0, 20).map((entry) => ({
      title: entry.title,
      content: entry.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300),
      mood: entry.mood,
    }));

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are a thoughtful journaling companion who creates personalized writing prompts.

Your task is to analyze the user's journal entries and generate 3 unique, personalized prompts that:
1. Connect to themes, interests, or patterns you notice in their writing
2. Encourage deeper reflection on topics they care about
3. Feel relevant and meaningful, not generic

Your response MUST be valid JSON with this exact structure:
{
  "themes": ["theme1", "theme2", "theme3"],
  "prompts": [
    "First personalized prompt question?",
    "Second personalized prompt question?",
    "Third personalized prompt question?"
  ]
}

Guidelines:
- Each prompt should be a single, thoughtful question
- Reference their actual interests/themes subtly (don't say "I noticed you write about X")
- Prompts should feel natural, not clinical
- Vary the depth: one lighter reflection, one deeper exploration, one forward-looking
- Keep prompts concise (under 20 words each)
- Return ONLY the JSON, no additional text`,
      prompt: `Based on these journal entries, identify key themes and generate 3 personalized prompts:

${recentEntries.map((e, i) => `
Entry ${i + 1}:
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

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      prompts: result.prompts,
      themes: result.themes,
      isPersonalized: true,
    });
  } catch (error) {
    console.error("Personalized prompts API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate prompts" },
      { status: 500 }
    );
  }
}
