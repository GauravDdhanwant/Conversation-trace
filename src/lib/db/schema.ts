import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  successMetricName: text("success_metric_name").notNull(),
  baselineValue: real("baseline_value").notNull(),
  targetValue: real("target_value").notNull(),
  convictionStatement: text("conviction_statement").notNull(),
  createdAt: text("created_at").notNull(),
});

export const engagements = sqliteTable("engagements", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  rawNotes: text("raw_notes").notNull(),
  summary: text("summary"),
  extractionHash: text("extraction_hash"),
  createdAt: text("created_at").notNull(),
});

export const extractedItems = sqliteTable("extracted_items", {
  id: text("id").primaryKey(),
  engagementId: text("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["decision", "action", "requirement"] }).notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["open", "done", "blocked"] })
    .notNull()
    .default("open"),
  linkedFeatureRef: text("linked_feature_ref"),
  createdAt: text("created_at").notNull(),
});

export const dailyUpdates = sqliteTable("daily_updates", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  publishedAt: text("published_at").notNull(),
});

export const metricSnapshots = sqliteTable("metric_snapshots", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  value: real("value").notNull(),
  recordedAt: text("recorded_at").notNull(),
  notes: text("notes"),
});

export type Project = typeof projects.$inferSelect;
export type Engagement = typeof engagements.$inferSelect;
export type ExtractedItem = typeof extractedItems.$inferSelect;
export type DailyUpdate = typeof dailyUpdates.$inferSelect;
export type MetricSnapshot = typeof metricSnapshots.$inferSelect;
