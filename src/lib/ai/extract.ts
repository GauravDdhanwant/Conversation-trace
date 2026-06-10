import OpenAI from "openai";
import { createHash } from "crypto";
import { EXTRACTION_SYSTEM_PROMPT } from "./prompts";
import { extractionResultSchema, type ExtractionResult } from "./schemas";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export function hashNotes(notes: string): string {
  return createHash("sha256").update(notes.trim()).digest("hex");
}

function fallbackExtraction(notes: string): ExtractionResult {
  const lines = notes
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const decisions: string[] = [];
  const actions: string[] = [];
  const requirements: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith("decision:") || lower.includes("we agreed") || lower.includes("decided")) {
      decisions.push(line.replace(/^decision:\s*/i, ""));
    } else if (
      lower.startsWith("action:") ||
      lower.startsWith("todo:") ||
      lower.startsWith("- [ ]")
    ) {
      actions.push(line.replace(/^(action:|todo:)\s*/i, "").replace(/^- \[ \]\s*/, ""));
    } else if (
      lower.startsWith("req:") ||
      lower.startsWith("requirement:") ||
      lower.includes("must have") ||
      lower.includes("need to")
    ) {
      requirements.push(line.replace(/^(req:|requirement:)\s*/i, ""));
    } else if (line.length > 20) {
      requirements.push(`UNCLEAR: ${line}`);
    }
  }

  return {
    summary:
      decisions.length + actions.length + requirements.length > 0
        ? "Extracted using rule-based fallback (no API key or AI unavailable). Review items marked UNCLEAR."
        : "No structured items detected. Add prefixes like Decision:, Action:, or Requirement: for fallback parsing.",
    decisions,
    actions,
    requirements,
  };
}

export async function extractFromNotes(notes: string): Promise<ExtractionResult> {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackExtraction(notes);
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        { role: "user", content: notes },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return fallbackExtraction(notes);
    }

    const parsed = extractionResultSchema.safeParse(JSON.parse(content));
    if (!parsed.success) {
      return fallbackExtraction(notes);
    }

    return parsed.data;
  } catch {
    return fallbackExtraction(notes);
  }
}
