import OpenAI from "openai";
import { STATUS_SYSTEM_PROMPT } from "./prompts";

interface StatusContext {
  projectName: string;
  successMetricName: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number | null;
  openDecisions: string[];
  openActions: string[];
  openRequirements: string[];
  recentEngagements: Array<{ title: string; summary: string | null; createdAt: string }>;
}

function buildFallbackStatus(ctx: StatusContext): string {
  const metricLine = ctx.currentValue !== null
    ? `${ctx.successMetricName}: ${ctx.currentValue} (baseline ${ctx.baselineValue}, target ${ctx.targetValue})`
    : `${ctx.successMetricName}: no snapshot recorded yet (baseline ${ctx.baselineValue}, target ${ctx.targetValue})`;

  const sections = [
    `Daily update for ${ctx.projectName}`,
    "",
    "Progress today:",
    ctx.recentEngagements.length > 0
      ? ctx.recentEngagements
          .map((e) => `- ${e.title}: ${e.summary ?? "No summary"}`)
          .join("\n")
      : "- No new engagements logged today.",
    "",
    "Open decisions:",
    ctx.openDecisions.length > 0 ? ctx.openDecisions.map((d) => `- ${d}`).join("\n") : "- None",
    "",
    "Open actions:",
    ctx.openActions.length > 0 ? ctx.openActions.map((a) => `- ${a}`).join("\n") : "- None",
    "",
    "Open requirements:",
    ctx.openRequirements.length > 0
      ? ctx.openRequirements.map((r) => `- ${r}`).join("\n")
      : "- None",
    "",
    `Metric: ${metricLine}`,
    "",
    "Next steps: Continue steering open actions and confirm open decisions with stakeholders.",
  ];

  return sections.join("\n");
}

export async function generateDailyStatus(ctx: StatusContext): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackStatus(ctx);
  }

  const client = new OpenAI({ apiKey });

  const userPrompt = JSON.stringify(
    {
      project: ctx.projectName,
      metric: {
        name: ctx.successMetricName,
        baseline: ctx.baselineValue,
        target: ctx.targetValue,
        current: ctx.currentValue,
      },
      openDecisions: ctx.openDecisions,
      openActions: ctx.openActions,
      openRequirements: ctx.openRequirements,
      recentEngagements: ctx.recentEngagements,
    },
    null,
    2,
  );

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: STATUS_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    return response.choices[0]?.message?.content?.trim() ?? buildFallbackStatus(ctx);
  } catch {
    return buildFallbackStatus(ctx);
  }
}
