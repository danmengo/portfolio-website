import { getWelcome, type ChatProject, type ChatReply } from "./chat";

export function getLiveWelcome(project?: ChatProject): ChatReply {
  const base = getWelcome(project);
  return { ...base, suggestions: project ? base.suggestions : ["Where did you study?", "What did you teach?", "Walk me through SplitSmart"], paragraphs: [
    "Hey! 👋 I'm mengoAI, Daniel's AI. Ask me about my projects or any questions to learn more about me.",
    ...(project ? [base.paragraphs[0]] : []),
  ] };
}

const allowedSources = new Set(["/chat", "/resume", "/projects/splitsmart", "/projects/fabflix", "/projects/sports-analytics-agent", "/projects/survey-sage", "/projects/my-money"]);
export function parseReply(value: unknown): ChatReply {
  if (!value || typeof value !== "object") throw new Error("The server returned an invalid answer.");
  const body = value as Record<string, unknown>;
  if (!Array.isArray(body.paragraphs) || !body.paragraphs.length || body.paragraphs.length > 30 || body.paragraphs.some((p) => typeof p !== "string" || p.length > 6000) || !Array.isArray(body.sources) || body.sources.length > 4) throw new Error("The server returned an invalid answer.");
  const sources = body.sources.map((source: unknown) => {
    if (!source || typeof source !== "object") throw new Error("Invalid source.");
    const s = source as Record<string, unknown>;
    if (typeof s.href !== "string" || !allowedSources.has(s.href) || typeof s.label !== "string" || typeof s.detail !== "string") throw new Error("Invalid source.");
    return { href: s.href, label: s.label, detail: s.detail };
  });
  const project = ["splitsmart", "fabflix", "sports-analytics-agent", "survey-sage", "my-money"].includes(String(body.project)) ? body.project as ChatProject : undefined;
  return { paragraphs: body.paragraphs as string[], sources, suggestions: project ? ["What technologies did you use?", "What results are documented?"] : ["Tell me about SplitSmart", "Tell me about Fabflix"], project };
}

export async function requestReply(question: string, project: ChatProject | undefined, signal: AbortSignal): Promise<ChatReply> {
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, ...(project ? { project } : {}) }), signal });
  if (!response.ok) {
    if (response.status === 429) throw new Error("Too many questions. Please wait a minute, then send your question again.");
    if (response.status === 503) throw new Error("Live AI is paused or today's allowance is exhausted. You can still browse the projects and résumé.");
    if (response.status === 504) throw new Error("The answer took too long. Please try again.");
    throw new Error("The AI couldn't prepare an answer. Please try again later.");
  }
  return parseReply(await response.json());
}
