# Journal App Setup Guide

A personal journal with AI-powered insights using Gemini Flash.

---

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
cd journal
npm install
```

### 2. Get a Gemini API Key (Free)

1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### 3. Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_key_here
DATABASE_URL=file:./journal.db
```

### 4. Initialize the Database

```bash
npm run db:migrate
```

This creates a local `journal.db` SQLite file.

### 5. Start the App

```bash
npm run dev
```

Open http://localhost:3000

---

## Usage

### Writing Entries
1. Click "New Entry"
2. Add a title and write your thoughts
3. Select your mood (optional)
4. Click "Get AI Insight" for analysis
5. Save when done

### Features
- **Rich Text Editor**: Bold, italic, lists, quotes, headings
- **Mood Tracking**: 10 mood options with emoji
- **AI Insights**: Gemini analyzes your entry for themes and reflections
- **Edit/Delete**: Click any entry to modify or remove it

---

## Deploying to Vercel

For cloud deployment, you'll need Turso (free hosted SQLite).

### 1. Create a Turso Account

```bash
# Install Turso CLI
brew install tursodatabase/tap/turso

# Sign up
turso auth signup

# Create database
turso db create journal

# Get connection info
turso db show journal --url
turso db tokens create journal
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Add Environment Variables in Vercel

Go to your project settings → Environment Variables and add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `libsql://your-db.turso.io` |
| `DATABASE_AUTH_TOKEN` | Your Turso token |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Gemini key |

### 4. Run Migration on Turso

```bash
# Push schema to Turso
turso db shell journal < drizzle/0000_init.sql
```

---

## Data Privacy

Your data is safe:

- **Local mode**: Everything stored in `journal.db` on your machine
- **API keys**: Never committed (in `.gitignore`)
- **Database files**: Never committed (in `.gitignore`)
- **Gemini API**: Google doesn't train on API data (per their terms)

---

## Costs

| Service | Cost |
|---------|------|
| Gemini Flash API | ~$0.075/1M tokens (pennies for personal use) |
| Turso Free Tier | 9GB storage, unlimited databases |
| Vercel Free Tier | Hobby projects, 100GB bandwidth |

**Estimated monthly cost for personal use: $0-2**

---

## Troubleshooting

### "Database not found"
Run `npm run db:migrate` to create the database.

### "API key invalid"
Check your `.env.local` has the correct Gemini key without quotes.

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### View database contents
```bash
npm run db:studio
```

---

## Project Structure

```
journal/
├── src/
│   ├── app/
│   │   ├── api/analyze/       # AI analysis endpoint
│   │   ├── api/entries/       # Journal CRUD API
│   │   ├── entry/new/         # New entry page
│   │   ├── entry/[id]/        # Edit entry page
│   │   └── page.tsx           # Home (entry list)
│   ├── components/
│   │   ├── ai-insight.tsx     # AI insight card
│   │   ├── editor.tsx         # Tiptap rich text
│   │   ├── entry-card.tsx     # Entry preview card
│   │   ├── mood-select.tsx    # Mood picker
│   │   └── ui/                # shadcn components
│   ├── db/
│   │   ├── index.ts           # Database client
│   │   └── schema.ts          # Drizzle schema
│   └── lib/
│       └── utils.ts           # Helper functions
├── drizzle/                   # Migration files
├── .env.example               # Environment template
├── .env.local                 # Your actual config (not committed)
└── journal.db                 # Your data (not committed)
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Open Drizzle Studio (DB viewer) |
| `npm run lint` | Run ESLint |
