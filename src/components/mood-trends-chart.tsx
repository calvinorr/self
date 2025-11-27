"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface Entry {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  aiInsight: string | null;
  createdAt: string;
}

interface MoodTrendsChartProps {
  entries: Entry[];
  timeRange: "week" | "month" | "quarter";
  onEntryClick?: (entryId: number) => void;
}

const MOOD_SCORES: Record<string, number> = {
  happy: 5,
  excited: 5,
  grateful: 4.5,
  hopeful: 4,
  calm: 4,
  neutral: 3,
  tired: 2.5,
  anxious: 2,
  frustrated: 1.5,
  sad: 1,
};

const MOOD_COLORS: Record<string, string> = {
  happy: "#10b981",
  excited: "#f59e0b",
  grateful: "#ec4899",
  hopeful: "#0ea5e9",
  calm: "#14b8a6",
  neutral: "#64748b",
  tired: "#a855f7",
  anxious: "#f97316",
  frustrated: "#ef4444",
  sad: "#3b82f6",
};

export function MoodTrendsChart({ entries, timeRange, onEntryClick }: MoodTrendsChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    let daysBack: number;
    let dateFormat: "short" | "day";

    switch (timeRange) {
      case "week":
        daysBack = 7;
        dateFormat = "day";
        break;
      case "month":
        daysBack = 30;
        dateFormat = "short";
        break;
      case "quarter":
        daysBack = 90;
        dateFormat = "short";
        break;
    }

    // Create array of dates
    const dates: { date: Date; label: string; entries: Entry[] }[] = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const label =
        dateFormat === "day"
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      dates.push({ date, label, entries: [] });
    }

    // Map entries to dates
    entries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt);
      const dateItem = dates.find(
        (d) => d.date.toDateString() === entryDate.toDateString()
      );
      if (dateItem) {
        dateItem.entries.push(entry);
      }
    });

    // Calculate average mood score per day
    return dates.map((d) => {
      const moodEntries = d.entries.filter((e) => e.mood && MOOD_SCORES[e.mood]);
      const avgScore =
        moodEntries.length > 0
          ? moodEntries.reduce((sum, e) => sum + (MOOD_SCORES[e.mood!] || 3), 0) /
            moodEntries.length
          : null;

      return {
        label: d.label,
        date: d.date.toISOString(),
        score: avgScore,
        entries: d.entries,
        entriesWithMood: moodEntries,
        entryCount: d.entries.length,
        primaryMood: moodEntries[0]?.mood || null,
      };
    });
  }, [entries, timeRange]);

  const averageScore = useMemo(() => {
    const validScores = chartData.filter((d) => d.score !== null);
    if (validScores.length === 0) return null;
    return (
      validScores.reduce((sum, d) => sum + d.score!, 0) / validScores.length
    ).toFixed(1);
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    if (!data.score) {
      return (
        <div className="rounded-lg border border-border bg-surface p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data.label}</p>
          <p className="text-xs text-muted-foreground">No entries</p>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-border bg-surface p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{data.label}</p>
        <p className="text-xs text-muted-foreground">
          {data.entryCount} {data.entryCount === 1 ? "entry" : "entries"}
        </p>
        {data.primaryMood && (
          <p className="mt-1 text-sm capitalize" style={{ color: MOOD_COLORS[data.primaryMood] }}>
            {data.primaryMood}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Mood score: {data.score.toFixed(1)}/5
        </p>
      </div>
    );
  };

  const handleClick = (data: typeof chartData[0]) => {
    if (data.entries.length > 0 && onEntryClick) {
      onEntryClick(data.entries[0].id);
    }
  };

  // For sparse data, filter to only days with entries for display
  const displayData = timeRange === "quarter"
    ? chartData.filter((_, i) => i % 3 === 0 || chartData[i].score !== null)
    : chartData;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Average Mood Score
          </h3>
          <p className="text-2xl font-bold text-foreground">
            {averageScore ? `${averageScore}/5` : "—"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500" /> Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Challenging
          </span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              interval={timeRange === "week" ? 0 : "preserveStartEnd"}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              ticks={[1, 2, 3, 4, 5]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#moodGradient)"
              connectNulls
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!payload.score) return null;
                const color = MOOD_COLORS[payload.primaryMood] || "hsl(var(--primary))";
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={color}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    style={{ cursor: payload.entries.length > 0 ? "pointer" : "default" }}
                    onClick={() => handleClick(payload)}
                  />
                );
              }}
              activeDot={{
                r: 6,
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
