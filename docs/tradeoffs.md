# Tradeoffs — Conversation Trace

## 1. Dashboard vs. Chatbot as primary interface

**Decision:** Traceable dashboard with structured forms.

**Alternatives considered:**
- Chatbot-first: "Paste your notes and talk to the agent"
- Notion-like doc editor
- Email-to-ticket ingestion

**Why dashboard won:** This problem requires auditability and traceability. A chatbot hides structure — you can't easily see all open decisions, filter by type, or trace a requirement to a feature ID. Engagement owners need a traceable dashboard, not a conversation.

**What would change my mind:** If the primary user were non-technical and only needed summaries, not traceability. Or if voice capture on mobile were the dominant input method.

---

## 2. AI extraction vs. manual tagging

**Decision:** AI extraction with structured JSON output and rule-based fallback.

**Alternatives considered:**
- Manual tagging only (user picks decision/action/requirement)
- Full automation with no human review
- Hybrid: AI suggests, human confirms each item

**Why AI + fallback:** Speed matters (15 min → 2 min goal). But the system must work without an API key for demo reliability. Rule-based fallback handles prefixed notes (`Decision:`, `Action:`).

**What would change my mind:** If extraction accuracy were consistently below 80% on real transcripts — then hybrid confirmation becomes mandatory.

---

## 3. SQLite vs. PostgreSQL

**Decision:** SQLite via better-sqlite3 for v1.

**Alternatives considered:**
- PostgreSQL (Neon/Supabase)
- Turso (edge SQLite)
- In-memory store

**Why SQLite:** Zero external dependencies for local demo. Single file, easy seed, fast iteration. Railway deployment supports persistent volumes.

**What would change my mind:** Multi-tenant customer portal, concurrent writes at scale, or Vercel-only deployment requirement.

---

## 4. Build Jira integration vs. trace IDs only

**Decision:** Auto-generated `FEAT-XXXX` trace references, no Jira API.

**Alternatives considered:**
- Full Linear/Jira bidirectional sync
- Webhook-based issue creation
- No trace IDs at all

**Why trace IDs only:** Scoping discipline. Integration is high effort and low signal for a challenge demo. Trace IDs prove the *concept* of requirement lineage without OAuth complexity.

**What would change my mind:** Customer already lives in Jira and won't adopt another tool without sync.

---

## 5. Idempotent extraction via content hash

**Decision:** SHA-256 hash of trimmed notes; identical content returns existing engagement.

**Alternatives considered:**
- Allow duplicates (user deletes manually)
- Hash per engagement ID + notes
- Semantic deduplication via embeddings

**Why content hash:** Simple, deterministic, demo-friendly. Re-pasting the same notes during a video walkthrough won't create duplicate items.

**What would change my mind:** Users frequently edit notes slightly and expect re-extraction — then engagement-level re-run with diff logic is needed.
