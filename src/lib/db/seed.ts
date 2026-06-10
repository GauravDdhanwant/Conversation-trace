import { eq } from "drizzle-orm";
import { getDb } from "./index";
import {
  projects,
  engagements,
  extractedItems,
  dailyUpdates,
  metricSnapshots,
} from "./schema";

const DEMO_PROJECT_ID = "proj_acme_onboarding";

export function seedDatabase(): { seeded: boolean; message: string } {
  const db = getDb();
  const existing = db.select().from(projects).where(eq(projects.id, DEMO_PROJECT_ID)).get();

  if (existing) {
    return { seeded: false, message: "Demo project already exists" };
  }

  const now = new Date().toISOString();

  db.insert(projects).values({
    id: DEMO_PROJECT_ID,
    name: "Acme Corp — Customer Onboarding Portal",
    successMetricName: "Time to first successful onboarding (minutes)",
    baselineValue: 45,
    targetValue: 15,
    convictionStatement:
      "If we reduce onboarding time from 45 to 15 minutes, Acme's activation rate will increase because fewer users abandon mid-flow.",
    createdAt: now,
  }).run();

  const engagementId = "eng_kickoff_call";
  db.insert(engagements).values({
    id: engagementId,
    projectId: DEMO_PROJECT_ID,
    title: "Kickoff call — Acme stakeholders",
    rawNotes: `Attendees: Sarah (VP Ops), Mike (CTO), us

Sarah: Current onboarding takes ~45 min. Users drop off at document upload step.
Mike: We need SSO with Okta. No password-based signup.
Decision: Launch with Okta SSO only for v1. Password auth deferred to Q3.
Action: Send Okta integration spec by Friday.
Action: Prototype upload flow with drag-and-drop by next Wednesday.
Requirement: Dashboard must show onboarding status per customer account.
Requirement: Admin must see which step each user is stuck on.
UNCLEAR: Sarah mentioned "compliance stuff" — need follow-up on regulatory requirements.`,
    summary:
      "Kickoff with Acme leadership. Agreed Okta-only SSO for v1. Focus on reducing drop-off at document upload. Dashboard and admin visibility are must-haves.",
    extractionHash: "seeded",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }).run();

  const seededItems = [
    {
      id: "item_dec_1",
      type: "decision" as const,
      content: "Launch with Okta SSO only for v1. Password auth deferred to Q3.",
    },
    {
      id: "item_act_1",
      type: "action" as const,
      content: "Send Okta integration spec by Friday.",
    },
    {
      id: "item_act_2",
      type: "action" as const,
      content: "Prototype upload flow with drag-and-drop by next Wednesday.",
    },
    {
      id: "item_req_1",
      type: "requirement" as const,
      content: "Dashboard must show onboarding status per customer account.",
      linkedFeatureRef: "FEAT-101",
    },
    {
      id: "item_req_2",
      type: "requirement" as const,
      content: "Admin must see which step each user is stuck on.",
      linkedFeatureRef: "FEAT-102",
    },
    {
      id: "item_req_3",
      type: "requirement" as const,
      content: "UNCLEAR: Compliance requirements — follow up with Sarah on regulatory constraints.",
    },
  ];

  for (const item of seededItems) {
    db.insert(extractedItems).values({
      id: item.id,
      engagementId,
      projectId: DEMO_PROJECT_ID,
      type: item.type,
      content: item.content,
      status: item.type === "action" ? "open" : "open",
      linkedFeatureRef: item.linkedFeatureRef ?? null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }).run();
  }

  db.insert(metricSnapshots).values({
    id: "metric_1",
    projectId: DEMO_PROJECT_ID,
    value: 38,
    recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "After upload UX improvements in staging",
  }).run();

  db.insert(dailyUpdates).values({
    id: "update_1",
    projectId: DEMO_PROJECT_ID,
    content:
      "Progress: Okta SSO integration spec drafted. Upload prototype in progress.\n\nOpen: Compliance requirements still unclear — scheduling follow-up with Sarah.\n\nMetric: Onboarding time down from 45 to 38 minutes in staging.\n\nNext: Ship drag-and-drop upload prototype for review Wednesday.",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }).run();

  return { seeded: true, message: "Demo project seeded successfully" };
}
