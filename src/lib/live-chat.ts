import { getWelcome, type ChatProject, type ChatReply } from "./chat";

export function getLiveWelcome(project?: ChatProject): ChatReply {
  const base = getWelcome(project);
  return { ...base, suggestions: project ? base.suggestions : ["What is Daniel's education?", "Tell me about his teaching experience", "Walk me through SplitSmart"], paragraphs: [
    project ? base.paragraphs[0] : "Hi, I'm Daniel Meng's AI portfolio guide. Ask me about his projects, education, or teaching experience.",
    "I search Daniel's public résumé and project notes before answering. I can make mistakes—check the source links. I remember the current project, but not the full conversation.",
  ] };
}

const allowedSources = new Set(["/resume", "/projects/splitsmart", "/projects/fabflix", "/projects/sports-analytics-agent"]);
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
  const project = ["splitsmart", "fabflix", "sports-analytics-agent"].includes(String(body.project)) ? body.project as ChatProject : undefined;
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
