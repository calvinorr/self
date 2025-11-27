# Journal PRD v2.0
## Your AI Companion for Self-Understanding

> *"The unexamined life is not worth living."* — Socrates

---

## Executive Summary

### Vision

Journal evolves from a writing tool into an **AI companion that grows with you**. By combining evidence-based therapeutic techniques with continuous learning about *your* patterns, triggers, and growth areas, Journal becomes the thoughtful friend who remembers everything, judges nothing, and helps you become the person you want to be.

### Core Thesis

Most journaling apps treat entries as isolated documents. Journal treats them as chapters in an ongoing story — connecting themes across time, recognising growth, and offering gentle guidance rooted in what actually works for *you*.

### Target User

You: a reflective individual who:
- Experiences anxiety and depression and wants tools that genuinely help
- Is intellectually curious, a constant reader, always learning
- Values mindfulness and has engaged with counselling/therapy
- Has started journaling before but struggled with consistency
- Wants a tool for personal use that feels genuinely world-class

---

## North Star Metrics

| Metric | Target & Rationale |
|--------|-------------------|
| **Weekly Active Writing** | 2+ meaningful entries per week (quality over quantity) |
| **Return After Lapse** | Resume within 14 days of any gap (the real battle) |
| **Weekly Review Completion** | Complete 3 out of 4 Sunday reviews per month |
| **Learning Integration** | Log 1+ book/article per month with reflection |

---

## Epic Overview

Building on your completed foundation (E1-E2), this PRD introduces three transformative epics:

| Epic | Theme | Core Value | Size |
|------|-------|------------|------|
| **E7** | The Wise Companion | AI that remembers & counsels | XL |
| **E8** | The Learning Loop | Reading → Reflection → Action | L |
| **E9** | The Gentle Return | Staying the race | M |

---

## Epic 7: The Wise Companion

> *An AI that knows your story and helps you write the next chapter*

### Epic Statement

*As someone seeking self-understanding, I want an AI companion that remembers my history, recognises my patterns, and offers gentle therapeutic guidance, so that my journal becomes a space for genuine growth rather than isolated reflections.*

### The Psychology Behind It

This epic draws from evidence-based approaches you've encountered in counselling:

- **Cognitive Behavioural Therapy (CBT)** — Recognising thought patterns, challenging cognitive distortions, building healthier responses
- **Mindfulness-Based Cognitive Therapy (MBCT)** — Present-moment awareness, observing thoughts without judgement
- **The Triune Brain Model** — Understanding the reptilian brain (survival), limbic system (emotion), and neocortex (reason)
- **Neuroplasticity** — The brain changes with practice; patterns can be rewired

### User Stories

| ID | Story | Pri | Points |
|----|-------|-----|--------|
| E7-S1 | As a user, I want the AI to remember themes and patterns from my previous entries so insights feel connected to my ongoing journey | P1 | 8 |
| E7-S2 | As a user experiencing anxiety, I want CBT-style thought reframing prompts to help me examine my worries rationally | P1 | 5 |
| E7-S3 | As a user, I want to have a follow-up conversation about an AI insight so I can explore my thoughts more deeply | P1 | 8 |
| E7-S4 | As a user, I want grounding exercises available before/during writing when I notice I'm anxious | P1 | 3 |
| E7-S5 | As a user, I want the AI to build a "What Works For Me" database of strategies that have helped in the past | P1 | 5 |
| E7-S6 | As a user, I want gratitude/wins logging as a counterbalance to rumination and negativity bias | P2 | 3 |
| E7-S7 | As a user, I want the AI to explain my brain chemistry in context when relevant ("Your amygdala is...") to help me understand my reactions | P2 | 3 |

### Acceptance Criteria

#### E7-S1: Contextual Memory System

**Acceptance Criteria:**
1. AI maintains a "User Profile" that evolves with each entry: key themes, triggers, coping strategies, relationships mentioned, goals
2. New insights reference relevant past entries naturally: "You mentioned feeling this way about work three weeks ago when..."
3. User can view and edit their profile summary ("Here's what I've learned about you")
4. System prompts include condensed context from profile, keeping API costs manageable
5. User can explicitly tell the AI to remember or forget specific things

**Technical Approach:**
Rather than full RAG (expensive, complex), use a **structured profile extraction** approach: after each entry, extract key entities and themes into a JSON profile. Include this profile in the system prompt for future entries. This gives 80% of the benefit of RAG with 20% of the complexity.

**Data Model:**
```typescript
interface UserProfile {
  themes: {
    name: string;
    frequency: number;
    lastMentioned: Date;
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    relatedEntries: string[]; // entry IDs
  }[];
  triggers: {
    trigger: string;
    context: string;
    copingStrategies: string[];
  }[];
  relationships: {
    name: string;
    relationship: string;
    sentiment: string;
    mentions: number;
  }[];
  goals: {
    goal: string;
    status: 'active' | 'achieved' | 'abandoned';
    relatedEntries: string[];
  }[];
  whatWorksForMe: {
    strategy: string;
    context: string;
    effectivenessRating: number; // 1-5
    timesUsed: number;
  }[];
  recentContext: {
    lastThreeEntriesSummary: string;
    currentMoodTrend: string;
    activeExperiments: string[];
  };
}
```

#### E7-S2: CBT Thought Reframing

**Acceptance Criteria:**
1. "Examine this thought" button appears when AI detects anxious/catastrophic thinking
2. Guided flow asks:
   - What evidence supports this thought?
   - What evidence contradicts it?
   - What would you tell a friend thinking this?
   - What's the most realistic outcome?
3. User's reframed thought is saved alongside the original
4. Common cognitive distortions are named gently when relevant (e.g., "This sounds like catastrophising — a pattern where we imagine the worst...")

**Cognitive Distortions to Detect:**
- Catastrophising ("What if everything goes wrong?")
- All-or-nothing thinking ("I always fail", "Nothing ever works")
- Mind reading ("They probably think I'm...")
- Fortune telling ("This will definitely...")
- Should statements ("I should be...")
- Emotional reasoning ("I feel anxious, so something must be wrong")

**UI Flow:**
```
Entry contains anxious thought
    ↓
AI insight includes: "I notice some worry here. Would you like to examine this thought together?"
    ↓
User clicks "Examine this thought"
    ↓
Step 1: "Let's look at: [extracted thought]. What evidence supports this being true?"
    ↓
Step 2: "Now, what evidence suggests it might not be true, or might be exaggerated?"
    ↓
Step 3: "If a friend told you they were thinking this, what would you say to them?"
    ↓
Step 4: "Given all this, what's a more balanced way to think about this?"
    ↓
Save reframed thought, link to original entry
```

#### E7-S3: Conversational Follow-ups

**Acceptance Criteria:**
1. "Continue this conversation" button on every AI insight
2. Opens a chat-style interface maintaining context of the entry and insight
3. AI remembers the conversation history within the session
4. Conversation is saved and linked to the entry
5. User can return to past conversations

**Technical Notes:**
- Use the same Claude API but with conversation history
- Include entry content + insight + user profile in system prompt
- Store conversation as array of messages linked to entry ID

#### E7-S4: Grounding Exercises

**Acceptance Criteria:**
1. "Ground yourself" button always accessible from entry screen (floating action button or sidebar)
2. Includes three exercises:
   - **5-4-3-2-1 Sensory**: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste
   - **Box Breathing**: 4 seconds in, 4 hold, 4 out, 4 hold (with visual animation)
   - **Body Scan**: Progressive relaxation with audio guidance
3. Exercises are guided with timed animations, not just text instructions
4. Optional: Ask "How do you feel now?" after exercise, track effectiveness over time

**Implementation:**
```typescript
// Box breathing component structure
interface BreathingExercise {
  phase: 'inhale' | 'hold-in' | 'exhale' | 'hold-out';
  duration: 4000; // milliseconds
  cycles: number; // default 4
  visualStyle: 'expanding-circle' | 'rising-bar' | 'gentle-wave';
}

// 5-4-3-2-1 exercise structure
interface SensoryExercise {
  steps: [
    { sense: 'see', count: 5, prompt: "Name 5 things you can see right now" },
    { sense: 'hear', count: 4, prompt: "Name 4 things you can hear" },
    { sense: 'touch', count: 3, prompt: "Name 3 things you can physically feel" },
    { sense: 'smell', count: 2, prompt: "Name 2 things you can smell" },
    { sense: 'taste', count: 1, prompt: "Name 1 thing you can taste" }
  ];
}
```

#### E7-S5: "What Works For Me" Database

**Acceptance Criteria:**
1. AI automatically extracts coping strategies mentioned in entries ("Going for a walk helped", "Talking to Sarah made me feel better")
2. User can manually add strategies
3. When user is struggling, AI can suggest: "In the past, you've found [strategy] helpful when feeling like this"
4. Track effectiveness: After suggesting a strategy, ask "Did this help?" to refine recommendations
5. View all strategies in a dedicated "What Works" page

**Data Model:**
```typescript
interface CopingStrategy {
  id: string;
  strategy: string;
  category: 'physical' | 'social' | 'cognitive' | 'creative' | 'spiritual' | 'other';
  context: string; // When does this help?
  source: 'extracted' | 'manual';
  sourceEntryId?: string;
  effectivenessRatings: {
    date: Date;
    rating: 1 | 2 | 3 | 4 | 5;
    context?: string;
  }[];
  timesRecommended: number;
  timesTried: number;
}
```

### AI Companion Personality

The AI should feel like a wise, warm counsellor — not a chatbot. Key characteristics:

- **Non-judgmental curiosity**: "Tell me more about that" rather than evaluation
- **Gentle challenge**: Asks questions that prompt reflection without lecturing
- **Grounded in your history**: References past patterns, growth, recurring themes
- **Psychoeducational when helpful**: Explains brain chemistry, cognitive patterns — things you've learned in counselling
- **Never prescriptive**: Suggests, invites, wonders — never tells you what to do
- **Celebrates small wins**: Notices and acknowledges progress, however incremental

### System Prompt Template

```
You are a thoughtful AI companion for {{userName}}'s personal journal. Your role is to listen deeply, reflect back patterns you notice, ask questions that invite reflection, and offer gentle psychoeducational context when it might help.

## Your Approach
- Be warm, curious, and non-judgmental
- Reference their history naturally when relevant
- Ask one thoughtful question at a time (don't overwhelm)
- Name cognitive patterns gently when you notice them
- Celebrate progress and small wins
- Never diagnose, prescribe, or tell them what to do
- Use "I notice...", "I wonder...", "It sounds like..." framing

## User Profile
{{userProfile}}

## Recent Context
Last 3 entries summary: {{recentEntriesSummary}}
Current mood trend: {{moodTrend}}
Active experiments: {{activeExperiments}}

## Therapeutic Frameworks
{{userName}} has experience with CBT and mindfulness. You can reference these naturally:
- Cognitive distortions (catastrophising, all-or-nothing thinking, etc.)
- The observing self vs. the thinking self
- Thoughts as weather that passes
- The amygdala/threat response and how to calm it
- Neuroplasticity and the ability to change patterns

## Current Entry
{{entryContent}}

Generate an insight that:
1. Acknowledges what they're experiencing
2. Connects to relevant patterns from their history (if applicable)
3. Offers one gentle observation or reflection
4. Ends with an invitation to explore further (not a demand)

Keep your response to 2-3 paragraphs. Be genuine, not performatively empathetic.
```

---

## Epic 8: The Learning Loop

> *Turn passive reading into active growth*

### Epic Statement

*As a constant reader and learner, I want to capture what I'm learning and connect it to my life through reflection, so that knowledge becomes wisdom and reading leads to action.*

### The Problem

You read constantly. Books, articles, podcasts. But how much actually changes your behaviour? Research shows we retain only 10-20% of what we passively consume. The Learning Loop closes that gap through **structured reflection** and **action prompts**.

### User Stories

| ID | Story | Pri | Points |
|----|-------|-----|--------|
| E8-S1 | As a reader, I want to log books and articles I'm reading with key takeaways | P1 | 5 |
| E8-S2 | As a learner, I want AI to prompt reflection after finishing something: "You finished X. What's one thing you might try?" | P1 | 3 |
| E8-S3 | As a user, I want to set "experiments" — small actions to try based on what I've learned | P1 | 5 |
| E8-S4 | As a user, I want to track experiment results: Did it work? What did I learn? | P1 | 3 |
| E8-S5 | As a user, I want AI to connect learning to my patterns: "This relates to the anxiety pattern you've noticed..." | P2 | 5 |

### Acceptance Criteria

#### E8-S1: Reading Log

**Acceptance Criteria:**
1. "What I'm Learning" section in navigation
2. Add item with: Title, Type (Book/Article/Podcast/Course), Status (Reading/Finished), Key Takeaways (rich text)
3. Items display in a clean list/card view
4. When marking as "Finished", automatically prompt for reflection (E8-S2)
5. Optional: Add author, link, date started/finished

**Data Model:**
```typescript
interface LearningItem {
  id: string;
  title: string;
  type: 'book' | 'article' | 'podcast' | 'course' | 'video' | 'other';
  author?: string;
  link?: string;
  status: 'reading' | 'finished' | 'abandoned';
  dateStarted?: Date;
  dateFinished?: Date;
  keyTakeaways: string; // rich text
  reflection?: string; // post-completion reflection
  experiments: string[]; // linked experiment IDs
  rating?: 1 | 2 | 3 | 4 | 5;
}
```

#### E8-S2: Post-Completion Reflection

**Acceptance Criteria:**
1. When user marks item as "Finished", trigger reflection prompt
2. Prompt includes:
   - "What's the one idea that stuck with you most?"
   - "How does this connect to something you're working on?"
   - "What's one small thing you could try based on this?"
3. Responses saved to the learning item
4. AI can reference these in future insights

#### E8-S3: Experiments

**Acceptance Criteria:**
1. Create an "experiment" from any learning item or journal insight
2. Experiment includes:
   - What I'm trying
   - Why (linked to learning/entry)
   - Duration (1 week, 2 weeks, 1 month, ongoing)
   - Success criteria (how will I know if it worked?)
3. Active experiments visible on dashboard
4. Reminder to review experiment at end of duration
5. Successful experiments feed into "What Works For Me" database (E7-S5)

**Data Model:**
```typescript
interface Experiment {
  id: string;
  title: string;
  description: string;
  hypothesis: string; // What I expect to happen
  successCriteria: string;
  duration: '1-week' | '2-weeks' | '1-month' | 'ongoing';
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'abandoned';
  source: {
    type: 'learning' | 'entry' | 'insight' | 'manual';
    id?: string;
  };
  checkIns: {
    date: Date;
    notes: string;
    progress: 'on-track' | 'struggling' | 'exceeded';
  }[];
  result?: {
    outcome: 'success' | 'partial' | 'failed' | 'inconclusive';
    learnings: string;
    addToWhatWorks: boolean;
  };
}
```

#### E8-S4: Experiment Tracking

**Acceptance Criteria:**
1. Weekly check-in prompt for active experiments
2. End-of-experiment review:
   - Did it work? (Success/Partial/Failed/Inconclusive)
   - What did I learn?
   - Would I recommend this strategy? (feeds into What Works)
3. View experiment history with outcomes
4. AI references experiment results in future insights

---

## Epic 9: The Gentle Return

> *Staying the race when motivation fades*

### Epic Statement

*As someone who starts strong but struggles with consistency, I want the app to support my return after gaps rather than make me feel guilty, so that lapses become pauses rather than endings.*

### The Psychology

The "What the Hell Effect" (real psychology term!) describes how one slip leads to giving up entirely. Journal combats this with **shame-free re-engagement** and **low-friction options** for difficult days.

### User Stories

| ID | Story | Pri | Points |
|----|-------|-----|--------|
| E9-S1 | As a user returning after a gap, I want a "Welcome Back" flow that acknowledges the lapse without guilt | P1 | 5 |
| E9-S2 | As a user on a low-energy day, I want micro-journaling options (mood only, one sentence, voice note) | P1 | 5 |
| E9-S3 | As a user, I want a structured Weekly Review ritual that surfaces themes, celebrates wins, and sets one intention | P1 | 8 |
| E9-S4 | As a user, I want gentle streak tracking that celebrates consistency without punishing gaps | P2 | 3 |
| E9-S5 | As a user, I want voice journaling for times when typing feels like too much effort | P2 | 5 |

### Acceptance Criteria

#### E9-S1: Welcome Back Flow

**Acceptance Criteria:**
1. Triggers after 7+ days of inactivity
2. Warm, non-judgmental greeting: "It's good to see you. No need to explain — life happens."
3. Offers choice:
   - Quick check-in (mood + one sentence)
   - Full entry
   - "Just browsing"
4. Optional: "What brought you back?" — captures re-engagement triggers for learning
5. Shows last entry summary to provide continuity

**UI Flow:**
```
User opens app after 7+ days
    ↓
Welcome Back modal:
"Welcome back 👋

It's been a little while — and that's okay. 
Life has its rhythms.

Last time you were here, you wrote about [summary].

How would you like to reconnect?"

[Quick Check-in] [Full Entry] [Just Browse]

Optional footer: "What brought you back today?" [text input]
```

#### E9-S2: Micro-Journaling

**Acceptance Criteria:**
1. "Quick entry" option always available from main screen
2. Three micro-journaling modes:
   - **Mood only**: Just select mood + optional one-word tag
   - **One sentence**: Single text field, no pressure for more
   - **Voice note**: Record a voice memo (transcribed optionally)
3. Micro-entries count toward activity but are visually distinct
4. AI can still generate insights from patterns in micro-entries
5. No judgment or prompts to "write more"

**Data Model:**
```typescript
interface MicroEntry {
  id: string;
  type: 'mood-only' | 'one-sentence' | 'voice-note';
  date: Date;
  mood?: Mood;
  tag?: string; // single word
  content?: string; // for one-sentence
  voiceUrl?: string; // for voice-note
  transcript?: string; // optional transcription
}
```

#### E9-S3: Weekly Review Ritual

**Acceptance Criteria:**
1. Prompted every Sunday (configurable day/time)
2. Structured flow (5-10 minutes):
   - **Review mood trends**: Visual of the week's moods
   - **Surface themes**: AI-identified patterns from the week
   - **Celebrate one win**: What went well? (even small things)
   - **Review experiments**: Check in on active experiments
   - **Set one intention**: What's one thing to focus on next week?
3. Generates a "Week in Review" summary saved as a special entry type
4. Archive of past reviews accessible ("On this week, last year...")
5. Can skip or postpone without guilt

**UI Flow:**
```
Sunday notification: "Ready for your weekly review? It only takes 5 minutes."
    ↓
Step 1: Mood Review
"Here's your week at a glance:"
[Mood chart for the week]
"Any patterns you notice?"
[Optional text input]
    ↓
Step 2: Themes
"This week, I noticed these themes in your writing:"
[AI-generated theme cards]
"Does this resonate?"
    ↓
Step 3: Win
"What's one thing that went well this week? (Even tiny wins count)"
[Text input]
    ↓
Step 4: Experiments (if any active)
"You're currently experimenting with [X]. How's it going?"
[Progress selector: On track / Struggling / Exceeded expectations]
[Optional notes]
    ↓
Step 5: Intention
"What's one thing you'd like to focus on this week?"
[Text input]
    ↓
Summary: "Week in Review" saved
"Nice work. See you next Sunday — or sooner if you feel like writing."
```

#### E9-S4: Gentle Streak Tracking

**Acceptance Criteria:**
1. Track "current streak" (consecutive days with any entry)
2. Track "longest streak" for motivation
3. **No punishment for breaks**: Instead of "streak lost", show "You've written X times this month"
4. Celebrate milestones (7 days, 30 days, etc.) with genuine warmth, not gamification
5. Show "consistency score" (entries per week average) rather than just streaks

**Philosophy:**
- Streaks are motivating but can become anxiety-inducing
- Focus on "you came back" not "you broke your streak"
- Celebrate patterns of consistency, not perfection

#### E9-S5: Voice Journaling

**Acceptance Criteria:**
1. "Speak instead" option on entry screen
2. Records voice with visual feedback (waveform or pulsing dot)
3. Saves audio file linked to entry
4. Optional transcription (using Web Speech API initially)
5. AI can generate insights from transcribed voice entries
6. Voice entries appear in timeline with audio player

**Technical Approach:**
- Start with Web Speech API (free, browser-native)
- Audio files stored in your existing storage solution
- Transcription can be optional (some may prefer audio-only)
- Future: Whisper API for better accuracy if needed

---

## Implementation Roadmap

### Phase 1: The Companion Awakens (6-8 weeks)
**Focus:** Make the AI feel personal

| Story | Points |
|-------|--------|
| E7-S1: Contextual Memory System | 8 |
| E7-S3: Conversational Follow-ups | 8 |
| E9-S2: Micro-journaling options | 5 |
| **Total** | **21** |

**Key Deliverables:**
- User Profile data model and extraction logic
- System prompt with profile injection
- Chat-style follow-up interface
- Micro-entry UI components

### Phase 2: The Therapeutic Toolkit (4-6 weeks)
**Focus:** Evidence-based mental health support

| Story | Points |
|-------|--------|
| E7-S2: CBT Thought Reframing | 5 |
| E7-S4: Grounding Exercises | 3 |
| E7-S5: "What Works For Me" database | 5 |
| E7-S6: Gratitude/Wins logging | 3 |
| **Total** | **16** |

**Key Deliverables:**
- CBT reframing flow UI
- Animated grounding exercise components
- Coping strategy extraction and storage
- Gratitude entry type

### Phase 3: The Learning Engine (4-6 weeks)
**Focus:** Reading → Reflection → Action loop

| Story | Points |
|-------|--------|
| E8-S1: Reading Log | 5 |
| E8-S2: Post-completion reflection prompts | 3 |
| E8-S3: Experiments | 5 |
| E8-S4: Experiment tracking | 3 |
| **Total** | **16** |

**Key Deliverables:**
- Learning items CRUD
- Experiment system with reminders
- Dashboard showing active experiments
- Connection between learning and entries

### Phase 4: The Sustainable Practice (4-6 weeks)
**Focus:** Long-term consistency

| Story | Points |
|-------|--------|
| E9-S1: Welcome Back flow | 5 |
| E9-S3: Weekly Review Ritual | 8 |
| E9-S4: Gentle streak tracking | 3 |
| E9-S5: Voice journaling | 5 |
| **Total** | **21** |

**Key Deliverables:**
- Welcome back modal and logic
- Weekly review multi-step flow
- Streak tracking with positive framing
- Voice recording and playback

---

## Technical Notes

### AI Memory Architecture (Budget-Friendly)

Instead of expensive RAG systems, use a **Profile Extraction** approach:

1. **After each entry:** Extract key entities (people, places, themes) and sentiment into structured JSON
2. **Store a "User Profile" document:** Themes (with frequency), Triggers (with context), Relationships (with sentiment), Goals (with status), Coping strategies (with effectiveness ratings)
3. **System prompt construction:** Include condensed profile (500-1000 tokens) + last 3 entry summaries
4. **Profile updates:** Run extraction after each entry, merge into existing profile

**Estimated API Costs:**
- Profile extraction: ~500 tokens per entry ≈ $0.001 per entry
- Insight generation with context: ~2000 tokens ≈ $0.01 per insight
- Monthly cost for active user (20 entries + insights): ~$0.25

### Profile Extraction Prompt

```
Analyze this journal entry and extract structured information.

Entry:
{{entryContent}}

Extract and return as JSON:
{
  "themes": ["theme1", "theme2"], // Main topics/emotions discussed
  "mood": "anxious|calm|happy|sad|frustrated|hopeful|mixed",
  "people": [{"name": "X", "relationship": "friend|family|colleague|other", "sentiment": "positive|negative|neutral"}],
  "triggers": ["trigger1"], // Things that caused emotional reactions
  "copingStrategies": ["strategy1"], // Things that helped or the user tried
  "goals": ["goal1"], // Goals or intentions mentioned
  "cognitivePatterns": ["catastrophising|all-or-nothing|etc"], // If detected
  "keyInsight": "One sentence summary of the most important thing in this entry"
}

Only include fields where you found relevant content. Be concise.
```

### Voice Journaling

- Use Web Speech API (free, browser-native) for real-time transcription
- For better accuracy, consider Whisper API (~$0.006/minute) as future enhancement
- Start with Web Speech API and add Whisper as optional if needed

### Grounding Exercises

These are largely front-end components:
- Box breathing: CSS animations for visual guide
- 5-4-3-2-1: Stepped form component
- Body scan: Simple audio player with custom controls
- No external dependencies needed

### Database Schema Additions

```sql
-- User Profile (JSON document or separate table)
CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,
  profile_data JSONB,
  updated_at TIMESTAMP
);

-- Learning Items
CREATE TABLE learning_items (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('book', 'article', 'podcast', 'course', 'video', 'other')),
  author TEXT,
  link TEXT,
  status TEXT CHECK (status IN ('reading', 'finished', 'abandoned')),
  date_started DATE,
  date_finished DATE,
  key_takeaways TEXT,
  reflection TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Experiments
CREATE TABLE experiments (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  hypothesis TEXT,
  success_criteria TEXT,
  duration TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT CHECK (status IN ('active', 'completed', 'abandoned')),
  source_type TEXT,
  source_id TEXT,
  result_outcome TEXT,
  result_learnings TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Experiment Check-ins
CREATE TABLE experiment_checkins (
  id TEXT PRIMARY KEY,
  experiment_id TEXT REFERENCES experiments(id),
  date DATE,
  notes TEXT,
  progress TEXT CHECK (progress IN ('on-track', 'struggling', 'exceeded'))
);

-- Coping Strategies (What Works For Me)
CREATE TABLE coping_strategies (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  strategy TEXT NOT NULL,
  category TEXT,
  context TEXT,
  source TEXT CHECK (source IN ('extracted', 'manual')),
  source_entry_id TEXT,
  times_recommended INTEGER DEFAULT 0,
  times_tried INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Strategy Effectiveness Ratings
CREATE TABLE strategy_ratings (
  id TEXT PRIMARY KEY,
  strategy_id TEXT REFERENCES coping_strategies(id),
  date DATE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  context TEXT
);

-- Weekly Reviews
CREATE TABLE weekly_reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  week_start DATE,
  mood_summary TEXT,
  themes JSONB,
  win TEXT,
  intention TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations (for follow-up chats)
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  entry_id TEXT REFERENCES entries(id),
  messages JSONB, -- Array of {role: 'user'|'assistant', content: string}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

---

## Success Metrics by Epic

| Epic | Key Metric | Target |
|------|-----------|--------|
| E7 | Insight engagement rate | 60%+ entries receive follow-up conversation |
| E7 | CBT completion rate | 80%+ started reframes completed |
| E8 | Learning integration | 1+ experiment created per month |
| E9 | Return after lapse | Resume within 14 days of any gap |
| E9 | Weekly Review completion | 3 out of 4 Sundays per month |

---

## Files to Create/Modify

### New Components
- `components/grounding/BoxBreathing.tsx`
- `components/grounding/SensoryExercise.tsx`
- `components/grounding/GroundingModal.tsx`
- `components/cbt/ThoughtReframe.tsx`
- `components/learning/ReadingLog.tsx`
- `components/learning/ExperimentCard.tsx`
- `components/learning/ExperimentForm.tsx`
- `components/review/WeeklyReview.tsx`
- `components/entry/MicroEntry.tsx`
- `components/entry/VoiceRecorder.tsx`
- `components/chat/InsightChat.tsx`
- `components/welcome/WelcomeBack.tsx`
- `components/profile/UserProfileView.tsx`
- `components/whatworks/StrategyList.tsx`

### New Pages/Routes
- `/learning` - Reading log and experiments
- `/weekly-review` - Weekly review flow
- `/what-works` - Coping strategies database
- `/profile` - User profile summary

### API Routes
- `POST /api/profile/extract` - Extract profile from entry
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/conversations` - Create/continue conversation
- `GET /api/conversations/:entryId` - Get conversation for entry
- CRUD routes for learning items, experiments, strategies

### Services
- `services/profileExtraction.ts` - Profile extraction logic
- `services/insightGeneration.ts` - Updated with profile context
- `services/experimentReminders.ts` - Experiment reminder logic
- `services/weeklyReview.ts` - Weekly review generation

---

## Appendix: Story Point Reference

| Size | Points | Description |
|------|--------|-------------|
| XS | 1 | Trivial change, < 1 hour |
| S | 2 | Simple, well-understood, < 1 day |
| M | 3-5 | Moderate complexity, 1-3 days |
| L | 8 | Significant work, ~1 week |
| XL | 13 | Large scope, needs breakdown, ~2 weeks |
| XXL | 21 | Epic-level, definitely needs breakdown |

---

*This PRD is a living document. Update as you build and learn.*

**Last Updated:** November 2024
**Total New Story Points:** 74 points across 3 epics
