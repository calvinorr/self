# Product Requirements Document: Journal

## Executive Summary

Journal is a personal journaling application that combines the therapeutic benefits of reflective writing with AI-powered insights. The app provides a clean, distraction-free writing environment where users can record their thoughts, track their emotional state, and receive meaningful analysis of their entries from an AI assistant.

**Vision**: To be the most thoughtful digital journaling companion—one that helps users understand themselves better through the combination of intentional writing and intelligent reflection.

---

## Problem Statement

### The Problem

Traditional journaling apps fall into two categories:
1. **Basic note-taking apps** - Offer no guidance, analysis, or support for self-reflection
2. **Over-engineered wellness apps** - Cluttered with features, gamification, and social elements that distract from authentic introspection

Additionally, users who journal consistently often struggle to:
- Identify patterns in their thoughts and emotions over time
- Gain objective perspective on their experiences
- Maintain motivation without feedback or acknowledgment

### The Opportunity

AI has matured to the point where it can provide genuinely helpful, empathetic analysis of personal writing. Combined with a minimalist interface, this creates an opportunity to build a journaling tool that:
- Respects the sacred nature of personal reflection
- Provides meaningful insights without being intrusive
- Helps users develop self-awareness over time

---

## Target Users

### Primary Persona: The Reflective Professional

**Demographics**:
- Age 25-45
- Knowledge worker or creative professional
- Comfortable with technology
- Values personal growth and self-improvement

**Behaviors**:
- Has tried journaling before but struggled to maintain the habit
- Uses productivity and wellness apps
- Values privacy and data ownership
- Prefers clean, minimal interfaces over feature-heavy apps

**Goals**:
- Process daily experiences and emotions
- Develop greater self-awareness
- Track personal growth over time
- Find patterns in mood and behavior

**Pain Points**:
- Journaling feels like writing into a void
- Difficult to gain perspective on own thoughts
- Existing apps are either too simple or too complex
- Concerns about privacy with cloud-based services

### Secondary Persona: The Wellness-Focused Individual

**Demographics**:
- Age 30-55
- May be in therapy or coaching
- Actively working on mental health
- Willing to invest time in self-care practices

**Goals**:
- Complement therapy or coaching with regular reflection
- Track emotional patterns for health purposes
- Create a personal record of growth and challenges

---

## Product Goals & Success Metrics

### Goals

| Priority | Goal | Rationale |
|----------|------|-----------|
| P0 | Create a frictionless writing experience | Users won't journal if the app gets in the way |
| P0 | Deliver genuinely helpful AI insights | This is our key differentiator |
| P1 | Ensure complete data privacy | Trust is essential for personal writing |
| P1 | Enable emotional awareness through mood tracking | Concrete data supports self-reflection |
| P2 | Surface patterns over time | Long-term value keeps users engaged |
| P2 | Support multiple platforms | Users should journal wherever they are |

### Success Metrics

**Engagement**:
- Weekly active users (WAU)
- Entries per user per week
- AI insight generation rate (% of entries with insights)
- Return rate (users who come back within 7 days)

**Quality**:
- Average entry length (proxy for engagement depth)
- Time spent writing per session
- Insight helpfulness rating (if we add feedback)

**Retention**:
- 7-day retention
- 30-day retention
- 90-day retention

**North Star Metric**: Weekly entries per active user
- Target: 3+ entries per week for engaged users

---

## Current State (MVP)

### Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| Rich text editor | ✅ Complete | Tiptap-based with formatting toolbar |
| Create/edit/delete entries | ✅ Complete | Full CRUD operations |
| Mood tracking | ✅ Complete | 10 mood options with emoji |
| AI insight generation | ✅ Complete | Gemini Flash integration |
| Entry list with previews | ✅ Complete | Chronological display |
| Local database | ✅ Complete | SQLite with Drizzle ORM |
| Vercel deployment ready | ✅ Complete | Turso integration for cloud |

### Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Editor**: Tiptap (ProseMirror-based)
- **Database**: SQLite (local) / Turso (cloud)
- **ORM**: Drizzle
- **AI**: Google Gemini 2.0 Flash via Vercel AI SDK

---

## Feature Roadmap

### Phase 1: Foundation (Current)
*Goal: Establish core journaling experience*

- [x] Basic entry creation and editing
- [x] Rich text formatting
- [x] Mood selection
- [x] AI-powered entry analysis
- [x] Entry list and navigation

### Phase 2: Enhanced Writing Experience
*Goal: Make writing more enjoyable and intuitive*

| Feature | Priority | Description |
|---------|----------|-------------|
| Writing prompts | P1 | AI-generated or curated prompts to inspire writing |
| Autosave | P1 | Prevent data loss with automatic saving |
| Keyboard shortcuts | P2 | Power user efficiency (Cmd+S, Cmd+B, etc.) |
| Word count | P2 | Track writing volume |
| Dark mode | P1 | Reduce eye strain, respect system preferences |
| Full-screen mode | P2 | Distraction-free writing environment |
| Markdown support | P2 | Import/export in standard format |

### Phase 3: Insight & Discovery
*Goal: Help users gain deeper self-understanding*

| Feature | Priority | Description |
|---------|----------|-------------|
| Mood trends | P1 | Visualize mood patterns over time (weekly/monthly charts) |
| AI themes | P1 | Identify recurring themes across entries |
| Search | P1 | Full-text search across all entries |
| Tags/categories | P2 | User-defined organization system |
| Calendar view | P2 | Visual timeline of journaling activity |
| Weekly/monthly summaries | P1 | AI-generated reflections on patterns |
| "On this day" | P3 | Surface past entries from same date |

### Phase 4: Privacy & Security
*Goal: Build trust through robust data protection*

| Feature | Priority | Description |
|---------|----------|-------------|
| Passcode/biometric lock | P1 | Protect app access |
| End-to-end encryption | P1 | Encrypt entries at rest |
| Local-only mode | P2 | Option to never sync to cloud |
| Data export | P1 | Download all data in JSON/Markdown |
| Account deletion | P1 | Complete data removal |
| Encryption key management | P2 | User-controlled encryption keys |

### Phase 5: Cross-Platform
*Goal: Enable journaling anywhere*

| Feature | Priority | Description |
|---------|----------|-------------|
| Progressive Web App (PWA) | P1 | Installable on mobile/desktop |
| Offline support | P1 | Write without internet connection |
| Cloud sync | P2 | Sync across devices (with E2E encryption) |
| Native iOS app | P3 | Dedicated mobile experience |
| Native Android app | P3 | Dedicated mobile experience |

### Phase 6: Advanced AI Features
*Goal: Maximize the value of AI assistance*

| Feature | Priority | Description |
|---------|----------|-------------|
| Conversational insights | P2 | Ask follow-up questions about entries |
| Sentiment tracking | P2 | Automatic mood detection from writing |
| Growth tracking | P2 | AI identifies positive changes over time |
| Personalized prompts | P2 | Prompts based on user's themes/interests |
| Therapist-style questions | P3 | Gentle probing questions for deeper reflection |
| Pattern alerts | P3 | Notify when concerning patterns emerge |

---

## User Experience Principles

### 1. Simplicity First
- Every feature must justify its existence
- When in doubt, leave it out
- The writing area should dominate the interface
- Reduce clicks to accomplish common tasks

### 2. Calm Technology
- No notifications pushing users to write
- No streaks, badges, or gamification
- No social features or sharing
- Respect the user's attention and time

### 3. Thoughtful AI
- AI should feel like a wise friend, not a therapist
- Insights should be optional, never forced
- AI should acknowledge uncertainty
- Never be preachy or prescriptive

### 4. Privacy as Default
- Assume everything is sensitive
- Minimize data collection
- Be transparent about what's stored and where
- Give users control over their data

### 5. Accessibility
- Support screen readers
- Ensure sufficient color contrast
- Allow keyboard-only navigation
- Support reduced motion preferences

---

## Technical Requirements

### Performance
- Time to interactive: < 2 seconds
- Editor input latency: < 50ms
- AI insight generation: < 5 seconds
- Database queries: < 100ms

### Reliability
- 99.9% uptime for cloud deployment
- Zero data loss (autosave + backups)
- Graceful degradation when offline

### Security
- HTTPS everywhere
- Secure API key management
- Input sanitization to prevent XSS
- Rate limiting on API endpoints
- CORS configuration

### Scalability (Future)
- Support 10,000+ entries per user
- Handle 1,000+ concurrent users
- Efficient database indexing
- CDN for static assets

---

## AI Integration Guidelines

### Prompt Engineering Principles

The AI assistant should:

1. **Be warm and empathetic**
   - Use language that feels supportive, not clinical
   - Acknowledge emotions without judgment
   - Celebrate wins, however small

2. **Provide actionable insights**
   - Identify specific themes or patterns
   - Suggest areas for reflection
   - Connect current entry to broader life context

3. **Respect boundaries**
   - Never diagnose or prescribe
   - Acknowledge limitations of AI understanding
   - Encourage professional help when appropriate

4. **Be concise**
   - 2-3 paragraphs maximum
   - Focus on most salient observations
   - Avoid generic platitudes

### Example AI Response Qualities

**Good**: "I notice you mentioned feeling overwhelmed by work deadlines three times this week. You also wrote about finding peace during your morning walks. There might be an opportunity to build on what's working—perhaps scheduling more moments of calm during busy periods."

**Bad**: "You seem stressed. You should try meditation and exercise more. Remember to practice self-care!"

---

## Competitive Analysis

| App | Strengths | Weaknesses | Our Differentiation |
|-----|-----------|------------|---------------------|
| Day One | Beautiful design, rich media | No AI insights, expensive | AI-powered reflection |
| Journey | Cross-platform, templates | Cluttered UI, generic | Minimalist focus |
| Reflectly | AI chat interface | Overly gamified, shallow AI | Deeper, thoughtful analysis |
| Notion | Flexible, powerful | Not purpose-built for journaling | Dedicated experience |
| Apple Notes | Simple, private | No journaling features | Purpose-built with AI |

**Our Position**: The intersection of minimalist design and meaningful AI assistance, with a strong commitment to privacy.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI generates unhelpful/harmful content | Medium | High | Careful prompt engineering, content filtering, user feedback mechanism |
| Users don't trust AI with personal thoughts | Medium | High | Transparency about data handling, local-only option, encryption |
| AI API costs become prohibitive | Low | Medium | Usage limits, caching, cheaper model options |
| Low user retention | Medium | High | Focus on habit-forming UX, valuable insights, reminders (opt-in) |
| Data breach | Low | Critical | Encryption, security audits, minimal data collection |
| Competitor with more resources | High | Medium | Focus on quality and trust over features |

---

## Open Questions

1. **Monetization**: Should this remain a free personal project, or pursue a sustainable business model? Options include:
   - Freemium (basic free, AI features paid)
   - One-time purchase
   - Subscription
   - Open source with hosted option

2. **AI Provider**: Should we offer multiple AI providers (Claude, GPT, local models) for user choice and redundancy?

3. **Social Features**: Should we ever add any social elements (shared journals, community prompts), or remain strictly personal?

4. **Integration**: Should we integrate with other apps (Apple Health, calendar, habit trackers)?

5. **Therapist Mode**: Should we build features specifically for therapy homework or coaching integration?

---

## Appendix

### A. User Research Questions

For future user interviews:

1. How often do you currently journal, and what tools do you use?
2. What motivates you to journal? What prevents you from journaling more?
3. How would you feel about an AI reading and analyzing your journal entries?
4. What would make AI-generated insights valuable to you?
5. How important is privacy in a journaling app? What would make you trust an app with your thoughts?
6. Would you pay for a journaling app? How much?

### B. Technical Debt Tracking

| Item | Severity | Description |
|------|----------|-------------|
| No autosave | Medium | Users could lose work if browser closes |
| No error boundaries | Low | App crashes on unexpected errors |
| No loading states | Low | Some operations lack feedback |
| No input validation | Medium | API accepts any input without validation |
| No rate limiting | Medium | AI endpoint could be abused |

### C. Design System Notes

**Colors** (Current):
- Background: White / Dark gray
- Primary: Near-black / White
- Accent: Amber (for AI insights)
- Moods: Emoji-based (no color coding)

**Typography**:
- Font: Inter (system default)
- Sizes: Standard scale (sm, base, lg, xl, 2xl, 3xl)

**Components**:
- Using shadcn/ui as foundation
- Custom: Editor toolbar, mood selector, AI insight card

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-11-27 | Calvin Orr / Claude | Initial PRD |

---

*This document is a living artifact and should be updated as the product evolves.*
