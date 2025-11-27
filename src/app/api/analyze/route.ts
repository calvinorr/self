import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { content, title } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash-exp"),
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

  return result.toDataStreamResponse();
}
