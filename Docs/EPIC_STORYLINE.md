# Epic Storyline: Journal

> *"The unexamined life is not worth living."* — Socrates

---

## The Hero's Journey

Every user who opens Journal is embarking on a journey of self-discovery. They arrive feeling disconnected from their own thoughts—overwhelmed by the noise of daily life, uncertain of their patterns, and longing for clarity.

**The Call to Adventure**: A moment of reflection. A desire to understand oneself better.

**The Mentor**: An AI companion that listens without judgment and reflects back what it sees.

**The Transformation**: From scattered thoughts to recognized patterns. From confusion to clarity. From writing into a void to engaging in meaningful dialogue with oneself.

**The Return**: A user who understands themselves better, makes more intentional choices, and has a trusted space for ongoing reflection.

---

## Product North Star

**Metric**: 3+ journal entries per week per active user

**Why**: Consistent journaling is the foundation of self-reflection. Users who write 3+ times weekly report the highest satisfaction and demonstrate the deepest engagement with AI insights.

---

## Epic Overview

| Epic | Theme | Status | T-Shirt Size |
|------|-------|--------|--------------|
| E1 | Foundation | ✅ Complete | L |
| E2 | Enhanced Writing | ✅ Complete | M |
| E3 | Insight & Discovery | ✅ Complete | L |
| E4 | Privacy & Security | Planned | M |
| E5 | Cross-Platform | Planned | XL |
| E6 | Advanced AI | Planned | L |

---

## Epic 1: Foundation (The Awakening)

### Epic Statement
*As a person seeking self-understanding, I want a simple, beautiful space to record my thoughts and receive AI-powered insights, so that I can begin my journey of self-reflection.*

### Status: ✅ Complete

### Stories Delivered

| ID | Story | Points |
|----|-------|--------|
| E1-S1 | Create and save journal entries with rich text | 5 |
| E1-S2 | Edit and delete existing entries | 3 |
| E1-S3 | View chronological list of all entries | 2 |
| E1-S4 | Select mood for each entry | 2 |
| E1-S5 | Generate AI insight for any entry | 5 |
| E1-S6 | Deploy to Vercel with cloud database | 3 |

### Acceptance Criteria (All Met)
- [x] User can write entries with formatting (bold, italic, lists, quotes)
- [x] User can select from 10 mood options
- [x] AI generates thoughtful 2-3 paragraph analysis
- [x] All entries persist across sessions
- [x] App loads in under 2 seconds

---

## Epic 2: Enhanced Writing (The Discipline)

### Epic Statement
*As a journaler developing a practice, I want a frictionless and inspiring writing experience, so that I never lose my work and always feel motivated to write.*

### Status: ✅ Complete

### Business Value
- Reduces friction → increases entry frequency
- Prevents data loss → builds trust
- Adds delight → improves retention

### Stories Delivered

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| E2-S1 | As a user, I want my entries to autosave so I never lose my thoughts | P1 | 3 |
| E2-S2 | As a user, I want dark mode so I can write comfortably at night | P1 | 3 |
| E2-S3 | As a user stuck on what to write, I want writing prompts to inspire me | P1 | 5 |


### Acceptance Criteria (All Met)

**E2-S1: Autosave**
- [x] Entry saves automatically every 30 seconds while typing
- [x] Entry saves when user navigates away
- [x] Visual indicator shows save status (Saving... / Saved)
- [x] No data loss if browser closes unexpectedly

**E2-S2: Dark Mode**
- [x] Respects system preference by default
- [x] Manual toggle in sidebar (cycles System → Light → Dark)
- [x] Smooth transition between modes
- [x] All components render correctly in both modes

**E2-S3: Writing Prompts**
- [x] "Need inspiration?" button on new entry page
- [x] Rotates through 60 curated prompts across 6 categories
- [x] Prompt text pre-fills entry title and content (user can modify)
- [ ] Option to generate AI-powered personalized prompts (deferred to E6)

### Dependencies
- None (can start immediately)

### Definition of Done
- All P1 stories complete ✅
- Manual QA passed
- No regressions in existing functionality

---

## Epic 3: Insight & Discovery (The Revelation)

### Epic Statement
*As a reflective journaler, I want to discover patterns and themes across my entries over time, so that I can gain deeper self-understanding.*

### Status: ✅ Complete

### Business Value
- Long-term value → reduces churn
- Unique differentiator → competitive advantage
- Drives engagement → users return to check insights

### Stories Delivered

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| E3-S1 | As a user, I want to see my mood trends over time in a visual chart | P1 | 5 |
| E3-S2 | As a user, I want AI to identify recurring themes across my entries | P1 | 8 |
| E3-S3 | As a user, I want to search all my entries by keyword | P1 | 3 |
| E3-S4 | As a user, I want weekly/monthly AI summaries of my journaling | P1 | 5 |
| E3-S5 | As a user, I want to organize entries with tags | P2 | 3 |
| E3-S6 | As a user, I want to see my entries in a calendar view | P2 | 3 |
| E3-S7 | As a user, I want "On this day" to surface past entries from the same date | P3 | 2 |

### Acceptance Criteria (All P1 Met)

**E3-S1: Mood Trends**
- [x] Line/bar chart showing mood distribution over 7/30/90 days
- [x] Tappable data points link to corresponding entries
- [x] Shows average mood score
- [x] Empty state for new users

**E3-S2: AI Themes**
- [x] "Discover Themes" section on Insights page analyzing all entries
- [x] Identifies top 5-7 recurring themes with sentiment analysis
- [x] Each theme links to relevant entries
- [x] Refresh on-demand button available

**E3-S3: Search**
- [x] Search bar on Insights page
- [x] Searches title, content, and AI insights
- [x] Highlights matching text in results
- [x] Click to navigate to entry

**E3-S4: Weekly/Monthly Summaries**
- [x] On-demand generation for weekly or monthly periods
- [x] Highlights: entry count, mood trends, key themes, notable quotes
- [x] Encouraging personalized message
- [x] Delivered in-app with regenerate option

### Dependencies
- E1 complete (MVP) ✅
- Sufficient entries for meaningful analysis (suggest 3+ for themes)

### Definition of Done
- All P1 stories complete ✅
- Charts render correctly on mobile and desktop ✅
- AI analysis completes in under 10 seconds ✅

---

## Epic 4: Privacy & Security (The Sanctuary)

### Epic Statement
*As a person sharing my deepest thoughts, I want complete confidence that my data is secure and private, so that I can write freely without fear.*

### Business Value
- Trust is table stakes for personal journaling
- Differentiator vs. competitors with weaker privacy
- Enables premium positioning

### User Stories

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| E4-S1 | As a user, I want to lock the app with a passcode or biometrics | P1 | 5 |
| E4-S2 | As a user, I want my entries encrypted so no one can read them | P1 | 8 |
| E4-S3 | As a user, I want to export all my data in a standard format | P1 | 3 |
| E4-S4 | As a user, I want to permanently delete my account and all data | P1 | 3 |
| E4-S5 | As a privacy-conscious user, I want a local-only mode with no cloud sync | P2 | 5 |
| E4-S6 | As an advanced user, I want to manage my own encryption keys | P2 | 5 |

### Acceptance Criteria

**E4-S1: App Lock**
- [ ] Enable/disable in settings
- [ ] Supports PIN (4-6 digits) and biometrics (Face ID / Touch ID)
- [ ] Locks after 1 minute of inactivity (configurable)
- [ ] Failed attempts show countdown before retry

**E4-S2: Encryption**
- [ ] All entries encrypted at rest using AES-256
- [ ] Encryption key derived from user password
- [ ] Decryption happens client-side only
- [ ] Clear documentation of security model

**E4-S3: Data Export**
- [ ] Export as JSON (complete data)
- [ ] Export as Markdown (human-readable)
- [ ] Includes all entries, moods, AI insights
- [ ] Download as ZIP file

### Dependencies
- E1 complete (MVP)

### Definition of Done
- Security audit by qualified reviewer
- No plaintext entries visible in database
- Export includes all user data

---

## Epic 5: Cross-Platform (The Expansion)

### Epic Statement
*As a user who lives across devices, I want to journal from anywhere and have my entries sync seamlessly, so that reflection fits into my life wherever I am.*

### Business Value
- Mobile is primary journaling context for many users
- Sync drives multi-device engagement
- PWA provides app-like experience without app store friction

### User Stories

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| E5-S1 | As a mobile user, I want to install the app on my home screen (PWA) | P1 | 5 |
| E5-S2 | As a user without internet, I want to write entries offline | P1 | 8 |
| E5-S3 | As a multi-device user, I want my entries to sync across all devices | P2 | 13 |
| E5-S4 | As an iOS user, I want a native app for the best mobile experience | P3 | 21 |
| E5-S5 | As an Android user, I want a native app for the best mobile experience | P3 | 21 |

### Acceptance Criteria

**E5-S1: PWA**
- [ ] Installable on iOS Safari, Android Chrome, desktop browsers
- [ ] App icon and splash screen
- [ ] Runs in standalone window (no browser chrome)
- [ ] Push notification capability (for future use)

**E5-S2: Offline Support**
- [ ] Create and edit entries without internet connection
- [ ] Entries queue for sync when connection restored
- [ ] Clear visual indicator of offline status
- [ ] No data loss during offline periods

**E5-S3: Cloud Sync**
- [ ] Bi-directional sync with conflict resolution
- [ ] Sync within 5 seconds of reconnection
- [ ] End-to-end encrypted (ties to E4)
- [ ] Works across web, PWA, and future native apps

### Dependencies
- E4-S2 (Encryption) should be complete before cloud sync
- Database must support sync (Turso with replication)

### Definition of Done
- PWA scores 90+ on Lighthouse
- Offline creates sync correctly in 100% of test cases
- Sync handles conflicts without data loss

---

## Epic 6: Advanced AI (The Wisdom)

### Epic Statement
*As a long-term journaler, I want my AI companion to grow with me—understanding my history, tracking my growth, and engaging in deeper dialogue, so that insights become increasingly valuable over time.*

### Business Value
- Deepest differentiator
- Increases switching costs
- Enables premium pricing

### User Stories

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| E6-S1 | As a user, I want to ask follow-up questions about my AI insights | P2 | 8 |
| E6-S2 | As a user, I want AI to automatically detect my mood from my writing | P2 | 5 |
| E6-S3 | As a user, I want AI to notice and celebrate my growth over time | P2 | 5 |
| E6-S4 | As a user, I want personalized prompts based on my themes and interests | P2 | 5 |
| E6-S5 | As a user, I want gentle therapeutic questions to deepen reflection | P3 | 5 |
| E6-S6 | As a user, I want to be notified if AI detects concerning patterns | P3 | 8 |

### Acceptance Criteria

**E6-S1: Conversational Insights**
- [ ] "Ask more" button on AI insight card
- [ ] Maintains context of current entry
- [ ] Remembers previous questions in session
- [ ] Clear conversation history per entry

**E6-S2: Sentiment Detection**
- [ ] AI suggests mood based on entry content
- [ ] User can accept or override
- [ ] Accuracy target: 80%+ match with user selection
- [ ] Never overrides explicit user choice

**E6-S3: Growth Tracking**
- [ ] Quarterly "growth report" comparing themes/sentiment over time
- [ ] Highlights positive changes
- [ ] Gently notes recurring challenges
- [ ] Encouraging, never judgmental tone

### Dependencies
- E3 (Insight & Discovery) for historical analysis
- Significant entry history (suggest 50+ entries for growth tracking)

### Definition of Done
- AI responses maintain warm, supportive tone
- No diagnoses or prescriptive advice
- User feedback on insight quality is positive (if measured)

---

## Release Milestones

### Release 1.0 — Foundation ✅
*The MVP. Users can journal and receive AI insights.*

- Epic 1: Complete

### Release 2.0 — Delightful Writing
*Focus on the daily writing experience.*

- Epic 2: Enhanced Writing Experience
- Estimated duration: 4-6 weeks

### Release 3.0 — Self-Discovery
*The "aha moment" release. Users discover patterns.*

- Epic 3: Insight & Discovery
- Estimated duration: 6-8 weeks

### Release 4.0 — Trusted Vault
*Privacy as a feature. Users feel safe.*

- Epic 4: Privacy & Security
- Estimated duration: 4-6 weeks

### Release 5.0 — Journal Everywhere
*Mobile-first experience with offline support.*

- Epic 5: Cross-Platform (P1 stories)
- Estimated duration: 6-8 weeks

### Release 6.0 — Wise Companion
*AI that grows with you.*

- Epic 6: Advanced AI
- Estimated duration: 8-10 weeks

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

## Appendix: Persona Quick Reference

### Maya — The Reflective Professional
- 32, UX Designer
- Journals sporadically, wants consistency
- Values: simplicity, privacy, actionable insights
- Device: iPhone primary, MacBook secondary
- Willingness to pay: $5-10/month for valuable app

### David — The Wellness-Focused Individual
- 45, recovering from burnout
- Therapist recommended journaling
- Values: emotional safety, pattern recognition, progress tracking
- Device: Android phone, rarely uses desktop
- Willingness to pay: $10-15/month, expense it through HSA

---

*This epic storyline is a living document. Update as priorities shift and learnings emerge.*

**Last Updated**: November 2024
**Owner**: Product Team
