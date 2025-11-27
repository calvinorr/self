# Claude Code Project Notes

## PATH Workaround Required

Due to shell environment issues on this machine, npm/node commands may fail with "command not found".

**Always prefix commands with the PATH:**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run dev
PATH="/opt/homebrew/bin:$PATH" npm install <package>
PATH="/opt/homebrew/bin:$PATH" npm run build
PATH="/opt/homebrew/bin:$PATH" git status
PATH="/opt/homebrew/bin:$PATH" git add -A
PATH="/opt/homebrew/bin:$PATH" git commit -m "message"
PATH="/opt/homebrew/bin:$PATH" git push origin main
```

The `~/.claude/settings.json` has the PATH configured but it doesn't persist across sessions.

## Project Structure

- `/journal` - Next.js 15 journal app with AI insights
- Uses SQLite (Turso for production), Drizzle ORM
- AI powered by Google Gemini 2.0 Flash

## Epic Tracking

Project follows the epic storyline in `Docs/EPIC_STORYLINE.md`:
- Epic 1: Foundation ✅
- Epic 2: Enhanced Writing ✅
- Epic 3: Insight & Discovery ✅
- Epic 4: Privacy & Security (next)
- Epic 5: Cross-Platform
- Epic 6: Advanced AI

## API Keys

API keys are stored in `.env.local` (gitignored). Never commit secrets.
