# Personal Journal

A clean, minimal journal app with AI-powered insights using Gemini Flash.

## Features

- Rich text editor for journal entries
- Mood tracking
- AI-powered entry analysis (Gemini Flash)
- Local SQLite database (or Turso for deployment)

## Tech Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS + shadcn/ui
- **Editor**: Tiptap
- **Database**: SQLite (Drizzle ORM)
- **AI**: Google Gemini Flash

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your Gemini API key (get one at https://aistudio.google.com/apikey):

```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
DATABASE_URL=file:./journal.db
```

### 3. Set up the database

```bash
npm run db:migrate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start journaling.

## Deploying to Vercel

For Vercel deployment, use Turso (free hosted SQLite):

1. Create a Turso account at https://turso.tech
2. Create a database: `turso db create journal`
3. Get the URL: `turso db show journal --url`
4. Create a token: `turso db tokens create journal`
5. Add to Vercel environment variables:
   - `DATABASE_URL`: Your Turso database URL
   - `DATABASE_AUTH_TOKEN`: Your Turso auth token
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key

Then update `src/db/index.ts` to include the auth token:

```typescript
const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
```

## License

MIT
