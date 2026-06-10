# Conversation Trace

Trace customer conversations to business outcomes — not just shipped features.

## The problem

After every customer call, decisions and requirements scatter across heads, Slack, and ad-hoc docs. By go-live, nobody can trace a feature back to the conversation where it was agreed. Daily status is manual. Success is measured by "shipped," not whether the business metric moved.

## Business outcome

Reduce time from call end to structured action items from ~15 minutes to under 2 minutes — while keeping 100% of requirements traceable to a source engagement.

## What it does

| Flow | Description |
|---|---|
| **Post-call capture** | Paste notes → AI extracts decisions, actions, requirements with trace IDs |
| **Daily status** | One-click draft from open items, recent engagements, and metrics |
| **Outcome dashboard** | Baseline → current → target with conviction statement and progress |

## Live demo

> Deploy to Railway (see [Deploy](#deploy)) and add your URL here before submission.

Local: [http://localhost:3000](http://localhost:3000)

## Quick start

```bash
cd conversation-trace
npm install
cp .env.example .env.local   # optional — add OPENAI_API_KEY for AI extraction
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — demo project auto-seeds on first load.

### Demo walkthrough

1. Click **Open Project** on the Acme Corp project
2. Review outcome metric (45 → 38 → 15 min) and conviction statement
3. **Post-Call Capture** — paste call notes, click Extract & Save
4. **Generate Today's Update** — one-click daily status
5. **Record Snapshot** — update metric and watch progress bar move
6. **Edge case** — re-paste identical notes → idempotent response, no duplicates

## Tech stack

- **Next.js 16** (App Router) + TypeScript + Tailwind
- **SQLite** (better-sqlite3) — structured, zero-dependency local DB
- **OpenAI** (optional) — extraction and status drafting with rule-based fallbacks
- **Zod** — API input validation

## Project structure

```
src/
  app/              # Pages and API routes
  components/       # Trace dashboard UI
  lib/
    ai/             # Extraction, status generation, prompts
    db/             # Schema, connection, seed data
docs/
  architecture.md   # System design and data flows
  tradeoffs.md      # Key decisions and alternatives
  failure-modes.md  # What breaks and degraded behavior
  VIDEO_SCRIPT.md   # Submission video outline
conviction.md       # Pre-launch conviction + post-build check
```

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/projects` | List projects (auto-seeds demo) |
| GET | `/api/projects/:id` | Full project with items, engagements, metrics |
| POST | `/api/engagements` | Capture call notes + extract items |
| POST | `/api/projects/:id/daily-status` | Generate daily update |
| POST | `/api/projects/:id/metrics` | Record metric snapshot |
| PATCH | `/api/items/:id` | Update item status (open/done/blocked) |

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | No | Enables AI extraction and status drafting |
| `OPENAI_MODEL` | No | Default: `gpt-4o-mini` |
| `DATABASE_PATH` | No | Default: `./data/conversation-trace.db` |

Works without `OPENAI_API_KEY` using rule-based fallback (prefix notes with `Decision:`, `Action:`, `Requirement:`).

## Scoped out (v1)

- Linear/Jira integration
- Customer portal with auth / multi-tenancy
- Automated KPI ingestion from production systems
- Voice agents, mobile apps

## Deploy

### Railway (recommended — SQLite needs persistent disk)

1. Push repo to GitHub
2. Create new Railway project → Deploy from GitHub
3. Add persistent volume mounted at `/app/data`
4. Set env: `DATABASE_PATH=/app/data/conversation-trace.db`
5. Optional: `OPENAI_API_KEY`

### Local production

```bash
npm run build
npm start
```

## Submission

1. Public GitHub repo
2. Live deployed URL (or local demo with README instructions)
3. 5–10 min video — see [docs/VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md)
4. Submit via Damco challenge page

## License

MIT
