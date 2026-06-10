# Deployment Guide

## Railway (recommended)

SQLite requires a persistent filesystem. Railway supports this natively.

1. Push `conversation-trace` to a **public GitHub repository**
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select the repository
4. Add a **Volume** mounted at `/app/data`
5. Set environment variables:
   - `DATABASE_PATH=/app/data/conversation-trace.db`
   - `OPENAI_API_KEY` (optional)
6. Railway auto-detects the Dockerfile, or set build command: `npm run build` and start: `npm start`
7. Copy the generated URL into README.md under "Live demo"

## Docker (local / any host)

```bash
docker build -t conversation-trace .
docker run -p 3000:3000 -v conversation-trace-data:/app/data conversation-trace
```

## Vercel (not recommended for v1)

SQLite does not persist on Vercel serverless functions. Use Railway, or migrate to Turso/Postgres for Vercel deployment.

## Post-deploy verification

1. Open `/` — demo project appears
2. Open `/projects/proj_acme_onboarding` — project trace dashboard loads
3. Post-call capture extracts items
4. Daily status generates
5. Metric snapshot updates progress bar
