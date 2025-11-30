import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, insight, messages, question } = body;

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Build conversation context from previous messages
    const conversationHistory = (messages || [])
      .map((msg: Message) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n");

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are a thoughtful journal assistant having a conversation about a journal entry. You've already provided an initial insight, and now the user wants to explore deeper.

Your responses should:
- Build on the context of the entry and previous conversation
- Be warm, supportive, and non-judgmental
- Offer deeper reflections when asked
- Ask gentle clarifying questions if it helps understanding
- Keep responses concise (1-2 paragraphs typically)
- Never diagnose or prescribe - you're a reflective companion, not a therapist

Remember the full context of the journal entry and your previous analysis.`,
      prompt: `Journal Entry Context:
Title: ${title}
Content: ${content}

Initial Insight You Provided:
${insight}

${conversationHistory ? `Previous Conversation:\n${conversationHistory}\n\n` : ""}User's New Question: ${question}

Please respond thoughtfully to the user's question, maintaining the warm and supportive tone.`,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Conversation API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
