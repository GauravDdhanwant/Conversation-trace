import { z } from "zod";

export const createEngagementSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1).max(200),
  rawNotes: z.string().min(10).max(20000),
});

export const createMetricSnapshotSchema = z.object({
  value: z.number(),
  notes: z.string().max(500).optional(),
});

export const updateItemStatusSchema = z.object({
  status: z.enum(["open", "done", "blocked"]),
});
