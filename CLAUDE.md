# Claude Code Project Notes

## ACTIVE EPIC: E7-Lite - The Thoughtful Companion

**Branch:** `epic/e7-lite-companion`
**Epic Doc:** `Docs/EPIC_E7_LITE.md`
**Status:** In Progress

### Current Story: E7L-S2 - Profile Extraction System (NEXT UP)

### Session Protocol

At the START of each session:
1. Remind user of current epic status
2. Show which story is in progress and what remains
3. Stay on plan unless user explicitly insists otherwise
4. Resist scope creep - finish what's started

### Stories Overview

| ID | Story | Points | Status |
|----|-------|--------|--------|
| E7L-S2 | Profile Extraction System | 8 | **Next** |
| E7L-S3 | CBT Pattern Recognition | 5 | Pending |
| E7L-S1 | Conversational Follow-ups | 8 | Pending |
| E7L-S4 | Welcome Back Flow | 5 | Pending |
| E7L-S5 | Monthly Reflection Report | 5 | Pending |

**Total: 31 points | Completed: 0 | Remaining: 31**

---

## PATH Workaround Required

Due to shell environment issues on this machine, npm/node commands may fail with "command not found".

**Always prefix commands with the PATH:**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run dev
PATH="/opt/homebrew/bin:$PATH" npm install <package>
PATH="/opt/homebrew/bin:$PATH" npm run build
PATH="/opt/homebrew/bin:$PATH" npx drizzle-kit generate
PATH="/opt/homebrew/bin:$PATH" npx drizzle-kit push
PATH="/opt/homebrew/bin:$PATH" git status
PATH="/opt/homebrew/bin:$PATH" git add -A
PATH="/opt/homebrew/bin:$PATH" git commit -m "message"
PATH="/opt/homebrew/bin:$PATH" git push origin <branch>
```

---

## Project Structure

- Next.js 15 journal app with AI insights
- SQLite (Turso for production), Drizzle ORM
- AI powered by Google Gemini 2.0 Flash
- Auth via Auth.js with GitHub/Google OAuth

## Key Files

- `src/db/schema.ts` - Database schema (Drizzle)
- `src/app/api/analyze/route.ts` - AI insight generation
- `src/components/ai-insight.tsx` - Insight display component
- `Docs/EPIC_E7_LITE.md` - Current epic details

## Epic History

- Epic 1: Foundation ✅
- Epic 2: Enhanced Writing ✅
- Epic 3: Insight & Discovery ✅
- Epic 4: Privacy & Security ✅
- Epic 5: Deployment ✅
- **Epic 7-Lite: Thoughtful Companion** 🔄 IN PROGRESS

## API Keys

API keys are stored in `.env.local` (gitignored). Never commit secrets.

## Context Management

- Use sub-agents (Task tool) for codebase exploration
- Use frontend-design skill for UI components
- Keep file reads targeted
- Summarize findings, don't paste everything
