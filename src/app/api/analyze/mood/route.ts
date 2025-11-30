import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { auth } from "@/auth";

const VALID_MOODS = ["great", "good", "okay", "low", "rough"] as const;
type Mood = (typeof VALID_MOODS)[number];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content || content.trim().length < 20) {
      return NextResponse.json(
        { error: "Content too short for mood analysis" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are a mood analyzer for a journaling app. Your task is to detect the emotional tone of journal entries.

Analyze the text and respond with ONLY ONE of these exact mood values:
- "great" - Very positive, joyful, excited, grateful, accomplished
- "good" - Generally positive, content, satisfied, hopeful
- "okay" - Neutral, mixed feelings, routine, neither good nor bad
- "low" - Somewhat negative, tired, stressed, disappointed, worried
- "rough" - Very negative, sad, anxious, frustrated, overwhelmed

Consider:
- The overall emotional tone, not just individual words
- The context and what the person is describing
- Both explicit emotions ("I feel happy") and implicit ones (describing positive events)

Respond with ONLY the mood word, nothing else. No punctuation, no explanation.`,
      prompt: `Analyze this journal entry and determine the mood:

${content}`,
    });

    // Validate the response is one of our valid moods
    const suggestedMood = text.trim().toLowerCase() as Mood;

    if (!VALID_MOODS.includes(suggestedMood)) {
      // If AI returned something unexpected, default to "okay"
      console.warn(`Unexpected mood response: "${text}", defaulting to "okay"`);
      return NextResponse.json({ mood: "okay", confidence: "low" });
    }

    return NextResponse.json({ mood: suggestedMood, confidence: "high" });
  } catch (error) {
    console.error("Failed to analyze mood:", error);
    return NextResponse.json(
      { error: "Failed to analyze mood" },
      { status: 500 }
    );
  }
}
