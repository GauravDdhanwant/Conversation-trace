# Conviction Statement — Conversation Trace

## Pre-launch conviction

**Problem:** After every customer call, decisions and requirements scatter across my head, Slack threads, and ad-hoc docs. By go-live, nobody can trace a feature back to the conversation where it was agreed. Daily status updates are written manually from scratch. Success is measured by "shipped" — not whether the business metric moved.

**Who feels this:** Anyone owning client-facing software delivery end-to-end — engagement leads, founders doing services, and fractional CTOs.

**What we believe:** A traceable dashboard with structured capture and AI-assisted extraction beats a chatbot interface because this problem requires auditability, traceability, and repeatable daily rhythm — not conversational convenience.

**Success metric (primary):** Reduce time from call end to structured action items from ~15 minutes (manual) to under 2 minutes.

**Success metric (secondary):** 100% of open requirements traceable to a source engagement within the system.

**Business outcome:** The engagement owner spends less time on administrative reconstruction and more time steering outcomes — with a daily status draft generated in one click and KPI progress visible at a glance.

## Explicitly out of scope (v1)

- Full Linear/Jira integration
- Customer portal with auth / multi-tenancy
- Automated KPI ingestion from production systems
- Voice agents or mobile apps
- Real-time collaboration / WebSockets

## Post-build check

| Conviction | Status | Evidence |
|---|---|---|
| Post-call extraction works on messy notes | Pass | Rule-based fallback + OpenAI extraction with UNCLEAR prefix for ambiguity |
| Re-extraction is idempotent (no duplicates) | Pass | SHA-256 hash of notes; identical notes return existing engagement |
| Daily status draft reflects project state | Pass | Generated from open items, recent engagements, and metric snapshots |
| Outcome dashboard shows baseline → current | Pass | MetricCard with progress bar and snapshot history |
| System degrades gracefully without API key | Pass | Fallback extraction and status generation without OpenAI |
