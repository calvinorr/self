import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

interface EntryInput {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  createdAt: string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { entries } = body as { entries: EntryInput[] };

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: "No entries provided" },
        { status: 400 }
      );
    }

    // Sort entries by date (oldest first)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Calculate date boundaries for current and previous month
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Split entries into current and previous periods
    const currentPeriodEntries = sortedEntries.filter(
      (e) => new Date(e.createdAt) >= currentMonthStart
    );
    const previousPeriodEntries = sortedEntries.filter(
      (e) => new Date(e.createdAt) >= previousMonthStart && new Date(e.createdAt) < currentMonthStart
    );

    // Calculate mood statistics
    const moodValues: Record<string, number> = {
      great: 5,
      good: 4,
      okay: 3,
      low: 2,
      rough: 1,
    };

    const getMoodStats = (entries: EntryInput[]) => {
      const moodsWithValues = entries.filter((e) => e.mood && moodValues[e.mood]);
      if (moodsWithValues.length === 0) return null;
      const sum = moodsWithValues.reduce((acc, e) => acc + moodValues[e.mood!], 0);
      return {
        average: sum / moodsWithValues.length,
        count: moodsWithValues.length,
        distribution: Object.entries(
          moodsWithValues.reduce((acc, e) => {
            acc[e.mood!] = (acc[e.mood!] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([mood, count]) => ({ mood, count })),
      };
    };

    const currentMoodStats = getMoodStats(currentPeriodEntries);
    const previousMoodStats = getMoodStats(previousPeriodEntries);

    // Prepare entries for AI analysis (limit content)
    const prepareEntries = (entries: EntryInput[]) =>
      entries.slice(0, 15).map((entry) => ({
        title: entry.title,
        content: entry.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 400),
        mood: entry.mood,
        date: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }));

    const currentForAI = prepareEntries(currentPeriodEntries);
    const previousForAI = prepareEntries(previousPeriodEntries);

    const currentMonthName = now.toLocaleDateString("en-US", { month: "long" });
    const previousMonthName = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleDateString("en-US", { month: "long" });

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `You are a warm, supportive journaling companion who helps users recognize their personal growth. Your role is to celebrate progress and gently acknowledge challenges with compassion.

Your response MUST be valid JSON with this exact structure:
{
  "headline": "A short, encouraging headline (5-10 words) capturing their growth journey this month",
  "summary": "A 2-3 paragraph narrative about their growth journey. Write in second person (you/your). Be warm, specific, and encouraging. Highlight **key themes** in bold. Focus on progress and positive shifts, while gently acknowledging any challenges.",
  "celebrations": [
    {
      "title": "Short title (3-5 words)",
      "description": "1-2 sentences about a positive change or achievement observed"
    }
  ],
  "growthAreas": [
    {
      "title": "Short title (3-5 words)",
      "description": "1-2 sentences about an area where growth is happening or could continue"
    }
  ],
  "recurringThemes": [
    {
      "theme": "Theme name",
      "trend": "stable" | "increasing" | "decreasing",
      "note": "Brief observation about this theme"
    }
  ],
  "encouragement": "A personalized, heartfelt message of encouragement (2-3 sentences). Reference specific things from their entries."
}

Guidelines:
- ALWAYS maintain an encouraging, non-judgmental tone
- Focus on progress and growth, not problems
- If comparing to last month, note positive changes
- Include 2-3 celebrations (things to be proud of)
- Include 1-2 growth areas (framed as opportunities, not weaknesses)
- Identify 2-4 recurring themes with their trends
- Never diagnose or give prescriptive advice
- If there's limited data, work with what's available and be encouraging about starting their journey
- Return ONLY the JSON, no additional text`,
      prompt: `Generate a monthly growth report for this user.

CURRENT MONTH (${currentMonthName}):
${currentForAI.length > 0 ? currentForAI.map((e, i) => `
Entry ${i + 1} (${e.date}):
Title: ${e.title}
Mood: ${e.mood || "not specified"}
Content: ${e.content}
`).join("\n---\n") : "No entries this month yet."}

${currentMoodStats ? `
Current month mood stats:
- Average mood: ${currentMoodStats.average.toFixed(1)}/5
- Entries with mood: ${currentMoodStats.count}
- Distribution: ${currentMoodStats.distribution.map(d => `${d.mood}: ${d.count}`).join(", ")}
` : ""}

PREVIOUS MONTH (${previousMonthName}) for comparison:
${previousForAI.length > 0 ? previousForAI.map((e, i) => `
Entry ${i + 1} (${e.date}):
Title: ${e.title}
Mood: ${e.mood || "not specified"}
Content: ${e.content}
`).join("\n---\n") : "No entries from previous month."}

${previousMoodStats ? `
Previous month mood stats:
- Average mood: ${previousMoodStats.average.toFixed(1)}/5
- Entries with mood: ${previousMoodStats.count}
` : ""}

Total entries all time: ${entries.length}`,
    });

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Add stats to the response
    return NextResponse.json({
      ...analysis,
      stats: {
        currentMonth: {
          name: currentMonthName,
          entryCount: currentPeriodEntries.length,
          moodAverage: currentMoodStats?.average || null,
        },
        previousMonth: {
          name: previousMonthName,
          entryCount: previousPeriodEntries.length,
          moodAverage: previousMoodStats?.average || null,
        },
        totalEntries: entries.length,
        moodTrend: currentMoodStats && previousMoodStats
          ? currentMoodStats.average > previousMoodStats.average
            ? "improving"
            : currentMoodStats.average < previousMoodStats.average
            ? "declining"
            : "stable"
          : null,
      },
    });
  } catch (error) {
    console.error("Growth analysis API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate growth report" },
      { status: 500 }
    );
  }
}
