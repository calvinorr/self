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
- Epic 4: Privacy & Security ✅
- Epic 5: Deployment ✅
- Epic 6: UI/UX Polish ✅
- Epic 7: Advanced AI (current)

## Git & Deployment Workflow

### Branch Strategy
- `main` - Production branch, auto-deploys to Vercel production
- `claude/*` or `epic/*` - Feature branches, trigger Vercel preview builds

### Development Workflow
1. **Create feature branch** from main (or use Claude Code worktree)
2. **Develop & test locally** at `localhost:3000`
3. **Commit & push** to trigger Vercel preview build
4. **Test on Preview URL** - Uses dev login (OAuth won't work on dynamic URLs)
5. **Create PR** to main when ready
6. **Merge** - Auto-deploys to production

### Worktree Notes
- Git worktrees share `.git` but NOT ignored files
- Copy `.env.local` from main repo to each worktree:
  ```bash
  cp /Users/calvinorr/Dev/Projects/Self/journal/.env.local .
  ```

### Authentication
- **Production**: GitHub OAuth (callback configured for production URL)
- **Preview builds**: Dev login (Credentials provider enabled via `VERCEL_ENV=preview`)
- **Local dev**: Dev login (Credentials provider enabled via `NODE_ENV=development`)

## API Keys

API keys are stored in `.env.local` (gitignored). Never commit secrets.
