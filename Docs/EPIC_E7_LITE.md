# Epic 7-Lite: The Thoughtful Companion

> *"The unexamined life is not worth living."* — Socrates

**Branch:** `epic/e7-lite-companion`
**Status:** In Progress
**Total Points:** 31
**Estimated Duration:** 6-8 weeks

---

## Epic Statement

*As someone seeking self-understanding, I want my journal to remember my patterns, recognize cognitive distortions, and offer gentle support when needed, so that journaling becomes a tool for genuine self-knowledge across the full spectrum of life — joys, memories, struggles, and everything in between.*

---

## Core Philosophy

> AI as a **thoughtful companion**, not a therapist. It reflects patterns back to you, celebrates joys, names cognitive patterns when present, and occasionally offers gentle, simple suggestions (meditation, nature, presence) when you're struggling. The goal is **self-knowledge**, not self-improvement.

### Guiding Principles

1. **Full Spectrum**: The journal captures happy thoughts, ramblings, memories, AND difficult moments
2. **Observation Over Direction**: Name patterns, don't prescribe fixes
3. **Gentle Support**: Simple coping suggestions (meditation, nature, gardening) only when clearly struggling
4. **Self-Knowledge**: Understanding yourself is the goal, not changing yourself
5. **Warm, Not Clinical**: A thoughtful friend, not a therapist

---

## Stories Overview

| ID | Story | Points | Status | Notes |
|----|-------|--------|--------|-------|
| E7L-S1 | Conversational Follow-ups | 8 | Pending | Explore insights deeper through dialogue |
| E7L-S2 | Profile Extraction System | 8 | Pending | AI builds evolving understanding of patterns |
| E7L-S3 | CBT Pattern Recognition | 5 | Pending | Name cognitive distortions observationally |
| E7L-S4 | Welcome Back Flow | 5 | Pending | Shame-free re-engagement after gaps |
| E7L-S5 | Monthly Reflection Report | 5 | Pending | Month-end review with gentle support |

**Total: 31 points**

---

## Story Details

### E7L-S2: Profile Extraction System (FOUNDATION - DO FIRST)

**Priority:** P0 - Foundation for all other stories

**What:** After each entry, AI extracts key patterns into a structured profile that evolves over time. This profile provides context for future insights.

**Acceptance Criteria:**
- [ ] Background extraction runs after saving any entry
- [ ] Profile captures: themes, joys, triggers, relationships, cognitive patterns, what helps
- [ ] Profile is condensed (~500-800 tokens) and included in insight system prompts
- [ ] User can view their profile ("Here's what I've noticed about your patterns")
- [ ] User can edit/delete items from their profile
- [ ] Profile merges new data with existing (frequency tracking, recency)

**Data Model:**
```typescript
interface UserProfile {
  themes: { name: string; frequency: number; lastMentioned: Date; sentiment: string }[];
  joys: { activity: string; frequency: number; context: string }[];
  triggers: { trigger: string; context: string; frequency: number }[];
  relationships: { name: string; relationship: string; sentiment: string; mentionCount: number }[];
  cognitivePatterns: { pattern: string; frequency: number; recentExamples: string[] }[];
  whatHelps: { strategy: string; mentionedIn: string[] }[];
  moodTrend: { recent: string; dominantMood: string };
  updatedAt: Date;
}
```

**Technical Tasks:**
- [ ] Add `user_profiles` table to schema
- [ ] Create `/api/profile/extract` endpoint
- [ ] Create `/api/profile` GET/PUT endpoints
- [ ] Create profile extraction service
- [ ] Create profile merge logic
- [ ] Build ProfileView component
- [ ] Add `/profile` page
- [ ] Integrate extraction into entry save flow
- [ ] Update insight generation to include profile context

---

### E7L-S3: CBT Pattern Recognition

**Priority:** P1 - Builds on profile

**What:** When generating insights, AI names cognitive distortions it observes — without offering to fix them.

**Acceptance Criteria:**
- [ ] Insight generation detects cognitive distortions from entry content
- [ ] Distortions named gently with brief explanation
- [ ] NO reframing prompts, NO actions offered
- [ ] Patterns logged to profile for tracking
- [ ] User can see frequent patterns in profile view

**Cognitive Distortions to Detect:**
- Catastrophizing
- All-or-nothing thinking
- Mind reading
- Fortune telling
- Should statements
- Emotional reasoning
- Overgeneralization
- Discounting positives

**Technical Tasks:**
- [ ] Update insight generation system prompt
- [ ] Add cognitive pattern extraction to profile extraction
- [ ] Display pattern history in profile view

---

### E7L-S1: Conversational Follow-ups

**Priority:** P1 - Core feature

**What:** "Continue this conversation" button on AI insights opens a chat interface for deeper exploration.

**Acceptance Criteria:**
- [ ] "Ask more" button appears on every AI insight
- [ ] Opens chat-style interface with entry + insight as context
- [ ] Conversation history maintained within session
- [ ] Conversations saved and linked to entry
- [ ] Can return to past conversations
- [ ] System prompt emphasizes exploration, not direction

**Technical Tasks:**
- [ ] Add `conversations` table to schema
- [ ] Create `/api/conversations` endpoint
- [ ] Build InsightChat component
- [ ] Integrate into entry view
- [ ] Style chat interface

---

### E7L-S4: Welcome Back Flow

**Priority:** P2 - Polish

**What:** Warm, non-judgmental re-engagement after 7+ days of inactivity.

**Acceptance Criteria:**
- [ ] Triggers after 7+ days since last entry
- [ ] Non-judgmental greeting: "It's good to see you. Life happens."
- [ ] Shows last entry summary for continuity
- [ ] Offers choice: Full entry / Just browse
- [ ] Optional: "What brought you back?"

**Technical Tasks:**
- [ ] Create WelcomeBack component
- [ ] Add last-seen tracking (localStorage)
- [ ] Integrate into app layout/entry point

---

### E7L-S5: Monthly Reflection Report

**Priority:** P2 - Capstone feature

**What:** On-demand monthly report reviewing emotional landscape, themes, and offering gentle support where appropriate.

**Acceptance Criteria:**
- [ ] Available from Insights page ("Generate Monthly Reflection")
- [ ] Reviews all entries from selected month
- [ ] Covers full spectrum: joys, memories, challenges, patterns
- [ ] If struggles present, offers gentle coping suggestions (meditation, nature, simplicity)
- [ ] Celebrates growth, happy moments, meaningful reflections
- [ ] Tracks cognitive patterns over time

**Report Sections:**
1. How You Felt (mood distribution, highs/lows)
2. What You Explored (themes, questions, memories)
3. Patterns I Noticed (cognitive patterns, triggers, joys)
4. Gentle Thoughts (simple suggestions IF needed)
5. Celebrating (wins, growth, gratitude)

**Technical Tasks:**
- [ ] Create `/api/monthly-report` endpoint
- [ ] Build MonthlyReflection component
- [ ] Add to Insights page
- [ ] Style report output

---

## Implementation Order

| Phase | Week | Stories | Focus |
|-------|------|---------|-------|
| 1 | 1-2 | E7L-S2 | Profile Extraction (Foundation) |
| 2 | 3-4 | E7L-S3 | CBT Pattern Recognition |
| 3 | 5 | E7L-S1 | Conversational Follow-ups |
| 4 | 6 | E7L-S4 | Welcome Back Flow |
| 5 | 7-8 | E7L-S5 | Monthly Reflection Report |

---

## Database Schema Additions

```sql
-- User Profile (stores extracted patterns)
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  profile_data TEXT NOT NULL, -- JSON
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Conversations (for follow-up chats)
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  entry_id TEXT,
  messages TEXT NOT NULL, -- JSON array [{role, content, timestamp}]
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

---

## Files to Create

### New Components
- `src/components/chat/InsightChat.tsx`
- `src/components/profile/ProfileView.tsx`
- `src/components/welcome/WelcomeBack.tsx`
- `src/components/insights/MonthlyReflection.tsx`

### New Pages
- `src/app/profile/page.tsx`

### New API Routes
- `src/app/api/profile/route.ts` (GET/PUT)
- `src/app/api/profile/extract/route.ts` (POST)
- `src/app/api/conversations/route.ts` (GET/POST)
- `src/app/api/monthly-report/route.ts` (POST)

### New Services
- `src/lib/profile-extraction.ts`
- `src/lib/profile-merge.ts`

### Modified Files
- `src/db/schema.ts` - Add new tables
- `src/app/api/analyze/route.ts` - Include profile in prompt
- `src/components/ai-insight.tsx` - Add conversation button

---

## Session Checklist

At the start of each session, Claude should:

1. **Remind user of current status** - Which story is in progress, what's done
2. **Show remaining work** - Stories left, estimated effort
3. **Stay on plan** - Unless user insists otherwise, continue the current story
4. **Track progress** - Update this document as stories complete
5. **Manage context** - Use sub-agents for complex searches, be efficient

---

## Progress Log

| Date | Session | Progress | Notes |
|------|---------|----------|-------|
| 2024-11-30 | 1 | Epic defined | Branch created, docs written |

---

## Definition of Done

Epic is complete when:
- [ ] All 5 stories marked complete
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged to main
- [ ] Production deployment verified
- [ ] EPIC_STORYLINE.md updated

---

*Stay the course. Resist scope creep. Ship it.*
