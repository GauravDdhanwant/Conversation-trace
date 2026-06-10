# Failure Modes — Conversation Trace

## 1. OpenAI API unavailable or missing key

**Symptom:** Extraction returns fewer items or generic UNCLEAR entries.

**Behavior:** System falls back to rule-based parser (`lib/ai/extract.ts`). Notes with prefixes (`Decision:`, `Action:`, `Requirement:`) still parse correctly. Daily status uses template generator.

**User impact:** Reduced extraction quality on unstructured prose. Demo remains functional.

**Mitigation:** Set `OPENAI_API_KEY` in `.env.local`. Prompts versioned in `lib/ai/prompts.ts`.

---

## 2. Malformed LLM JSON response

**Symptom:** OpenAI returns invalid JSON or schema mismatch.

**Behavior:** Zod validation fails → fallback parser runs. No partial corrupt data saved.

**User impact:** Brief delay, then fallback results displayed.

**Mitigation:** `response_format: { type: "json_object" }` and strict schema validation.

---

## 3. Duplicate extraction on identical notes

**Symptom:** User pastes same notes twice.

**Behavior:** SHA-256 hash match returns existing engagement with `idempotent: true` message. No duplicate items created.

**User impact:** Positive — intentional deduplication.

**Edge case:** Slightly edited notes create new engagement (by design).

---

## 4. Ambiguous call notes

**Symptom:** Notes like "Sarah mentioned compliance stuff" with no clear action.

**Behavior:** AI marks as `UNCLEAR:` prefixed requirement. Surfaces in open items for follow-up.

**User impact:** Forces explicit follow-up rather than silent omission.

---

## 5. Missing metric snapshots

**Symptom:** No snapshots recorded yet.

**Behavior:** MetricCard shows "—" for current value. Progress bar at 0%. Daily status notes "no snapshot recorded yet."

**User impact:** Dashboard still usable; outcome section prompts user to record first snapshot.

---

## 6. SQLite file corruption or disk full

**Symptom:** Database write fails.

**Behavior:** API returns 500. No partial writes (SQLite transactions).

**Mitigation:** WAL mode enabled. Railway persistent volume recommended for production.

---

## 7. Oversized note input

**Symptom:** User pastes 50,000+ character transcript.

**Behavior:** Zod validation rejects at 20,000 char limit with 400 error.

**User impact:** Clear validation message. Prevents LLM token overflow.

---

## 8. Stale daily status

**Symptom:** Status generated yesterday, project changed since.

**Behavior:** Each generation creates new update from current state. Old updates preserved in history.

**User impact:** User must click generate again — by design (status reflects point-in-time).

---

## Degraded mode summary

| Failure | System state | User action |
|---|---|---|
| No API key | Fallback extraction + template status | Use prefixed notes or add API key |
| Bad LLM output | Fallback parser | Review UNCLEAR items |
| Duplicate notes | Idempotent return | None needed |
| No metrics | Dashboard minus current value | Record snapshot |
| DB error | 500 on mutations | Check disk/volume |
