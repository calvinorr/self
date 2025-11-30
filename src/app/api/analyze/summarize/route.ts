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
    const { title, content, insight, messages } = body;

    if (!messages || messages.length < 2) {
      return NextResponse.json(
        { error: "Need at least one exchange to summarize" },
        { status: 400 }
      );
    }

    // Build conversation for summarization
    const conversationText = messages
      .map((msg: Message) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
      .join("\n\n");

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are a journal insight synthesizer. Your task is to create an enriched insight that combines the original reflection with key takeaways from a follow-up conversation.

Your response should:
- Start with the essence of the original insight
- Seamlessly weave in the most valuable discoveries from the conversation
- Be a cohesive, flowing reflection (not bullet points)
- Be 2-3 paragraphs, slightly longer than the original insight
- Maintain a warm, supportive, and thoughtful tone
- Feel like a complete, standalone insight (not a summary of a conversation)

Do NOT:
- Mention "the conversation" or "our discussion"
- Use phrases like "you asked about" or "we explored"
- Make it feel like a recap - it should read as an enriched original insight`,
      prompt: `Original Journal Entry:
Title: ${title}
Content: ${content}

Original Insight:
${insight}

Follow-up Conversation:
${conversationText}

Please create an enriched insight that incorporates the valuable discoveries from the conversation into a cohesive, standalone reflection.`,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
