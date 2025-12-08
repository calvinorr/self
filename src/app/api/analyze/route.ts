import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // useCompletion sends { prompt: "..." } - parse the JSON string we sent
    let title = "";
    let content = "";

    if (body.prompt) {
      try {
        const parsed = JSON.parse(body.prompt);
        title = parsed.title || "";
        content = parsed.content || "";
      } catch {
        content = body.prompt;
      }
    } else {
      title = body.title || "";
      content = body.content || "";
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `You are a thoughtful journal assistant. Analyze journal entries with empathy and provide meaningful insights.

Your analysis should:
- Identify key themes and emotions in the entry
- Offer gentle observations about patterns or feelings expressed
- Provide supportive, non-judgmental reflections
- Suggest potential areas for self-reflection if appropriate
- Keep your response concise (2-3 paragraphs max)

Be warm and supportive, like a wise friend who listens carefully.`,
      prompt: `Please analyze this journal entry:

Title: ${title}

Entry:
${content}`,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
