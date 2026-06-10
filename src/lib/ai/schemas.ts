import { z } from "zod";

export const extractionResultSchema = z.object({
  summary: z.string(),
  decisions: z.array(z.string()),
  actions: z.array(z.string()),
  requirements: z.array(z.string()),
});

export type ExtractionResult = z.infer<typeof extractionResultSchema>;
