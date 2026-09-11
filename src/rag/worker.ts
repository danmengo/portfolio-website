import { generateReply } from "./answer.ts";
import { contextualize } from "./context.ts";
import { DeadlineError, withTimeout } from "./timeout.ts";
import type { ProjectId } from "../data/projects.ts";
import { retrieve } from "./retrieve.ts";
import { retrieveHybrid, type AiBinding, type VectorIndex } from "./semantic.ts";
export { ChatBudget } from "./budget.ts";

export interface Env {
  CHAT_ENABLED?: string;
  ASSETS?: { fetch(request: Request): Promise<Response> };
  AI?: AiBinding;
  RETRIEVAL_MODE?: string;
  VECTOR_INDEX?: VectorIndex;
  CHAT_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
  CHAT_BUDGET?: { idFromName(name: string): unknown; get(id: unknown): { fetch(request: Request): Promise<Response> } };
}

const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
function json(body: unknown, status = 200) { return Response.json(body, { status, headers }); }
function error(message: string, status: number) { return json({ error: message }, status); }

async function readQuestion(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new Error("Use application/json.");
  // Enforce actual bytes, including chunked bodies with no Content-Length header.
  const reader = request.body?.getReader();
  if (!reader) throw new Error("A question is required.");
  let bytes = 0;
  let text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 4096) { await reader.cancel(); throw new Error("Request is too large."); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally { reader.releaseLock(); }
  const body: unknown = JSON.parse(text);
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => !["question", "project"].includes(key))) throw new Error("Send only question and project fields.");
  const question = (body as { question?: unknown }).question;
  if (typeof question !== "string" || !question.trim() || question.length > 500) throw new Error("Question must be 1–500 characters.");
  const project = (body as { project?: unknown }).project;
  if (project !== undefined && (typeof project !== "string" || !["splitsmart", "fabflix", "sports-analytics-agent"].includes(project))) throw new Error("Invalid project.");
  return { question: question.trim(), project: project as ProjectId | undefined };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (!path.startsWith("/api/")) return env.ASSETS ? env.ASSETS.fetch(request) : error("Not found.", 404);
    if (path !== "/api/chat") return error("Not found.", 404);
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { ...headers, Allow: "POST" } });
    if (env.CHAT_ENABLED !== "true") return error("Live AI is currently paused.", 503);
    // Missing protections fail closed. Client-supplied IP/session fields are never trusted.
    if (!env.AI || !env.CHAT_RATE_LIMITER || !env.CHAT_BUDGET) return error("Chat is not configured.", 503);
    const hybrid = env.RETRIEVAL_MODE === "hybrid";
    if (hybrid && !env.VECTOR_INDEX) return error("Search is not configured.", 503);
    const ip = request.headers.get("CF-Connecting-IP");
    if (!ip) return error("Chat is unavailable for this request.", 503);
    try {
      const permitted = await env.CHAT_RATE_LIMITER.limit({ key: ip });
      if (!permitted.success) return Response.json({ error: "Too many questions. Please wait a minute." }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
      let input: { question: string; project?: ProjectId };
      try { input = await withTimeout(readQuestion(request), 5000); }
      catch { return error("Send a JSON question of 1–500 characters, with a body under 4 KB.", 400); }
      const { query: question, project } = contextualize(input.question, input.project);
      let passages = retrieve(question);
      const noEvidence = () => json({ paragraphs: ["I couldn't find relevant information in Daniel's public portfolio. Try a specific project or resume topic."], sources: [], suggestions: [], mode: "no-evidence" });
      if (!hybrid && !passages.length) return noEvidence();

      const budget = env.CHAT_BUDGET.get(env.CHAT_BUDGET.idFromName("portfolio-global-budget"));
      const reservation = await withTimeout(budget.fetch(new Request("https://budget/reserve", { method: "POST" })), 3000);
      if (!reservation.ok) return error("Chat is temporarily unavailable.", 503);
      const allowance = await reservation.json() as { allowed?: unknown };
      if (allowance.allowed !== true) return error("Today's AI allowance is exhausted. Please browse the project pages.", 503);

      // Reserve before ALL paid work, including the query embedding. One daily
      // slot allows at most one embedding call and one generation call.
      if (hybrid) {
        passages = (await withTimeout(retrieveHybrid(question, env.AI, env.VECTOR_INDEX!), 10000)).map((p) => ({ ...p, matchedTerms: [] }));
        if (!passages.length) return noEvidence();
      }

      try { return json({ ...await withTimeout(generateReply(question, passages, env.AI), 15000), project }); }
      catch (cause) { return error("The AI could not prepare an answer. Please try later.", cause instanceof DeadlineError ? 504 : 502); }
    } catch (cause) {
      // Never echo provider errors, secrets, question text or raw IPs to logs/clients.
      return error("Chat is temporarily unavailable. Please try later.", cause instanceof DeadlineError ? 504 : 503);
    }
  },
};
