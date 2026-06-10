# Video Script — Build at Damco Submission

**Target length:** 8–10 minutes  
**Format:** Screen recording with voiceover (Loom or YouTube unlisted)

---

## Section 1: Problem Framing (2–3 min)

**Say:**

> "I picked a problem I've personally felt owning client delivery work. After every customer call, decisions and requirements scatter — my head, Slack, random docs. By go-live, nobody can trace a feature back to the conversation where it was agreed. Daily status is manual. Success gets measured by 'shipped,' not whether the business metric moved.
>
> This isn't a script problem — it's a systems problem. You need ingestion, extraction, traceability, daily rhythm, and outcome measurement working together.
>
> I scoped v1 to three flows: post-call capture with AI extraction, one-click daily status, and an outcome dashboard with baseline-to-target tracking. I explicitly cut Jira integration, multi-tenant auth, and automated KPI ingestion — those are month-two problems."

**Show:** Home page → open Acme demo project.

---

## Section 2: System Design + Live Demo (5–6 min)

**Say:**

> "The primary interface is a traceable dashboard, not a chatbot. This problem needs auditability — you need to see every open decision, action, and requirement with trace IDs back to source engagements.
>
> Architecture: Next.js full-stack, SQLite for structured data, OpenAI for extraction and status drafting with rule-based fallbacks when the API isn't available."

**Demo happy path:**

1. Show outcome dashboard — baseline 45, current 38, target 15 minutes
2. Show conviction statement and open items from kickoff call
3. Open Post-Call Capture — paste new messy notes:

```
Mike: Can we add email notifications for stuck users?
Decision: Email alerts for users stuck >24h on any step.
Action: Design notification templates by Friday.
Something about GDPR — not sure what Sarah meant.
```

4. Click Extract & Save — show new items appear
5. Click "Generate Today's Update" — show drafted status
6. Record a metric snapshot (e.g., 32) — show progress bar update

**Walk code briefly:**

- `src/lib/ai/extract.ts` — structured JSON extraction + fallback
- `src/app/api/engagements/route.ts` — idempotent hash check
- `src/lib/db/schema.ts` — data model

---

## Section 3: Tradeoffs (2–3 min)

**Say:**

> "Dashboard over chatbot — because traceability beats conversational convenience.
>
> AI extraction over manual tagging — because the goal is under 2 minutes from call end to structured items. But I kept a fallback parser so the demo works without an API key.
>
> SQLite over Postgres for v1 — zero dependencies, ships fast. I'd move to Postgres or Turso for multi-tenant production.
>
> Trace IDs instead of Jira sync — proves lineage concept without OAuth complexity. I'd add Linear integration in month two if the customer lives there."

---

## Section 4: Failure Modes + Edge Case Demo (2 min)

**Demo edge case — idempotent re-submission:**

1. Re-paste the exact same notes from step 3
2. Show message: "Identical notes already processed — returning existing extraction"
3. Confirm no duplicate items in the list

**Say:**

> "When the LLM gets ambiguous input, items are prefixed UNCLEAR — like the GDPR note — so nothing silently disappears.
>
> Without an API key, the rule-based fallback still parses prefixed notes. The system degrades, it doesn't crash.
>
> What's broken in v1: no auth, no Jira sync, metrics are manually entered not auto-ingested. With more time I'd add customer portal access, webhook integrations, and conviction statement auto-checks against metric trends."

---

## Section 5: Close (30 sec)

**Say:**

> "I built the tool I'd use on day one owning client delivery — because owning the outcome means owning the plumbing that makes outcomes visible. Thanks for watching."

---

## Pre-recording checklist

- [ ] `npm run dev` running at http://localhost:3000
- [ ] Demo project seeded (auto-seeds on first load)
- [ ] Optional: `OPENAI_API_KEY` in `.env.local` for better extraction demo
- [ ] Browser zoom at 100%, close unrelated tabs
- [ ] Test microphone and screen capture
