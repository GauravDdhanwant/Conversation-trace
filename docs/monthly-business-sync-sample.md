# Monthly Business Sync — Acme Corp (Sample)

**Date:** June 2026  
**Attendees:** Sarah (VP Ops), Mike (CTO), Engagement Owner

---

## 1. Are the KPIs moving?

**Metric:** Time to first successful onboarding

| | Value |
|---|---|
| Baseline (kickoff) | 45 min |
| Current | 32 min |
| Target | 15 min |
| Progress | 59% toward target |

**Data source:** Staging environment measurements after upload UX improvements.

**Verdict:** Needle is moving. 13-minute improvement from baseline. Not yet at target — document upload step still accounts for 60% of remaining time.

---

## 2. Is the pain resolved? What new pain surfaced?

**Original pain:** Users abandon onboarding at document upload. No visibility into where users get stuck.

**Resolved:**
- Admin dashboard shows per-step status (FEAT-102 shipped to staging)
- Drag-and-drop upload reduced friction

**New pain surfaced:**
- Compliance requirements still unclear (GDPR scope from Sarah's kickoff comment)
- Email notification for stuck users requested but not yet scoped

---

## 3. Build-to-spec check

**Conviction statement (pre-launch):** "If we reduce onboarding time from 45 to 15 minutes, Acme's activation rate will increase."

**Current evidence:** Onboarding time down 29%. Activation rate data pending — Sarah to share by next sync.

**Recommendation:** Prioritize compliance discovery call before building notification system. Regulatory constraints may affect data retention in the admin dashboard.

---

## Next month

1. Compliance discovery with Sarah (blocked on FEAT-103)
2. Email notification design (Mike's request)
3. Production deploy of upload flow after compliance sign-off
