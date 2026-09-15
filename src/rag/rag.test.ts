import { describe, expect, it, vi } from "vitest";
import { retrieve } from "./retrieve";
import worker, { type Env } from "./worker";
import { reserve, type BudgetStorage } from "./budget";

function setup() {
  const run = vi.fn().mockResolvedValue({ response: "Fabflix improved XML parsing and inserts by 40%." });
  const limit = vi.fn().mockResolvedValue({ success: true });
  const budgetFetch = vi.fn().mockImplementation(async () => Response.json({ allowed: true }));
  const env: Env = { CHAT_ENABLED: "true", AI: { run }, CHAT_RATE_LIMITER: { limit }, CHAT_BUDGET: { idFromName: (name) => name, get: () => ({ fetch: budgetFetch }) } };
  return { env, run, limit, budgetFetch };
}
function request(body: unknown = { question: "How did Fabflix improve XML performance?" }) {
  return new Request("https://portfolio.example/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" }, body: JSON.stringify(body) });
}

describe("retrieval evaluation baseline", () => {
  it.each([
    ["How did Fabflix improve XML parsing?", "fabflix-results"],
    ["What did Daniel teach in Python classes?", "teaching"],
    ["What is his UCI GPA?", "education"],
    ["Where did I study?", "education"],
    ["What did I study?", "education"],
    ["Where did you go to school?", "education"],
    ["What was your major?", "education"],
    ["What AI model is this?", "mengoai"],
    ["What certifications did Daniel earn?", "credentials"],
    ["Which project uses Prisma?", "splitsmart-technology"],
    ["Tell me about BQML", "sports-analytics-agent-overview"],
  ])("retrieves evidence for %s", (question, expected) => {
    expect(retrieve(question).map((passage) => passage.id)).toContain(expected);
  });
  it("does not retrieve unrelated topics or stopwords", () => {
    expect(retrieve("How do I bake sourdough?")).toEqual([]);
    expect(retrieve("Tell me about you")).toEqual([]);
  });
  it("keeps a named project question within that project's evidence", () => {
    const passages = retrieve("How did Fabflix improve XML performance?");
    expect(passages.length).toBeGreaterThan(0);
    expect(passages.every((p) => p.href === "/projects/fabflix")).toBe(true);
  });
  it("allows comparisons across named projects", () => {
    const paths = retrieve("Compare SplitSmart and Fabflix technologies").map((p) => p.href);
    expect(paths).toContain("/projects/splitsmart");
    expect(paths).toContain("/projects/fabflix");
  });
});

describe("protected chat endpoint", () => {
  it.each([
    ["Where did I study?", "education"],
    ["What did I study?", "education"],
    ["What AI model is this?", "mengoai"],
  ])("answers %s after discussing a project", async (question, evidenceId) => {
    const { env, run } = setup();
    const response = await worker.fetch(request({ question, project: "fabflix" }), env);
    expect(response.status).toBe(200);
    expect((await response.json()).project).toBeUndefined();
    const evidence = JSON.parse(run.mock.calls[0][1].messages[1].content).evidence;
    expect(evidence.map((p: { id: string }) => p.id)).toContain(evidenceId);
  });
  it.each([undefined, "false"])("does not call AI when disabled (%s)", async (flag) => {
    const { env, run, budgetFetch } = setup(); env.CHAT_ENABLED = flag;
    expect((await worker.fetch(request(), env)).status).toBe(503);
    expect(run).not.toHaveBeenCalled(); expect(budgetFetch).not.toHaveBeenCalled();
  });
  it("rejects rate-limited requests before budget and AI", async () => {
    const { env, run, limit, budgetFetch } = setup(); limit.mockResolvedValue({ success: false });
    const response = await worker.fetch(request(), env);
    expect(response.status).toBe(429); expect(response.headers.get("Retry-After")).toBe("60");
    expect(run).not.toHaveBeenCalled(); expect(budgetFetch).not.toHaveBeenCalled();
  });
  it.each([{ question: "" }, { question: "x".repeat(501) }, { question: 42 }, { question: "Fabflix", history: [] }, { question: "Fabflix", model: "expensive" }, { question: "Hello", project: ["fabflix"] }, { question: "Hello", project: "unknown" }, null])("rejects invalid input %j", async (body) => {
    const { env, run, budgetFetch } = setup();
    expect((await worker.fetch(request(body), env)).status).toBe(400);
    expect(run).not.toHaveBeenCalled(); expect(budgetFetch).not.toHaveBeenCalled();
  });
  it("bounds chunked bodies without trusting Content-Length", async () => {
    const { env, run } = setup();
    const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(" ".repeat(4097))); controller.close(); } });
    const req = new Request("https://portfolio.example/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" }, body, duplex: "half" } as RequestInit);
    expect((await worker.fetch(req, env)).status).toBe(400); expect(run).not.toHaveBeenCalled();
  });
  it("fails closed when protections are unavailable", async () => {
    const { env, run } = setup(); delete env.CHAT_BUDGET;
    expect((await worker.fetch(request(), env)).status).toBe(503); expect(run).not.toHaveBeenCalled();
  });
  it("requires the platform IP header", async () => {
    const { env, run } = setup(); const req = request(); req.headers.delete("CF-Connecting-IP");
    expect((await worker.fetch(req, env)).status).toBe(503); expect(run).not.toHaveBeenCalled();
  });
  it("skips inference when there is no evidence", async () => {
    const { env, run, budgetFetch } = setup();
    const response = await worker.fetch(request({ question: "Bake sourdough" }), env);
    expect((await response.json()).mode).toBe("no-evidence");
    expect(run).not.toHaveBeenCalled(); expect(budgetFetch).not.toHaveBeenCalled();
  });
  it("stops inference at the global allowance", async () => {
    const { env, run, budgetFetch } = setup(); budgetFetch.mockImplementation(async () => Response.json({ allowed: false }));
    expect((await worker.fetch(request(), env)).status).toBe(503); expect(run).not.toHaveBeenCalled();
  });
  it("sends bounded evidence, reserves first, and returns allowlisted references", async () => {
    const { env, run, budgetFetch } = setup();
    const response = await worker.fetch(request(), env);
    const body = await response.json();
    expect(response.status).toBe(200); expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.sources.some((source: { href: string }) => source.href === "/projects/fabflix")).toBe(true);
    expect(budgetFetch.mock.invocationCallOrder[0]).toBeLessThan(run.mock.invocationCallOrder[0]);
    const input = run.mock.calls[0][1];
    expect(input.max_tokens).toBe(350); expect(JSON.parse(input.messages[1].content).evidence.length).toBeLessThanOrEqual(4);
  });
  it("does not leak provider errors or retry a charged call", async () => {
    const { env, run } = setup(); run.mockRejectedValue(new Error("secret-provider-detail"));
    const response = await worker.fetch(request(), env);
    expect(response.status).toBe(502); expect(await response.text()).not.toContain("secret-provider-detail"); expect(run).toHaveBeenCalledTimes(1);
  });
  it("rejects malformed model output", async () => {
    const { env, run } = setup(); run.mockResolvedValue({ response: null });
    expect((await worker.fetch(request(), env)).status).toBe(502);
  });
});

describe("daily reservation policy", () => {
  function memoryStorage(): BudgetStorage {
    const data = new Map<string, unknown>();
    let queue: Promise<unknown> = Promise.resolve();
    return { transaction(callback) {
      const result = queue.then(() => callback({ get: async <T>(key: string) => data.get(key) as T | undefined, put: async (key, value) => { data.set(key, value); } }));
      queue = result.catch(() => undefined); return result;
    } };
  }
  it("allows only the configured count under competing reservations", async () => {
    const storage = memoryStorage();
    const outcomes = await Promise.all(Array.from({ length: 20 }, () => reserve(storage, 3)));
    expect(outcomes.filter(Boolean)).toHaveLength(3);
  });
  it("resets at UTC midnight", async () => {
    const storage = memoryStorage();
    expect(await reserve(storage, 1, new Date("2026-09-08T23:59:59Z"))).toBe(true);
    expect(await reserve(storage, 1, new Date("2026-09-08T23:59:59Z"))).toBe(false);
    expect(await reserve(storage, 1, new Date("2026-09-09T00:00:00Z"))).toBe(true);
  });
  it.each([NaN, 0, -1, 1.5, 1001])("rejects invalid allowance %s", async (limit) => {
    expect(await reserve(memoryStorage(), limit)).toBe(false);
  });
});

describe("canonical domain redirect", () => {
  it.each(["/", "/chat?project=splitsmart", "/projects/fabflix", "/assets/example.js"])("preserves %s on the old domain", async (path) => {
    const response = await worker.fetch(new Request(`https://danmengo-portfolio.danmengo-portfolio.workers.dev${path}`), {});
    expect(response.status).toBe(308);
    expect(response.headers.get("Location")).toBe(`https://danmengo.com${path}`);
  });
  it("redirects POST before consuming the AI budget", async () => {
    const { env, run, limit, budgetFetch } = setup();
    const response = await worker.fetch(new Request("https://danmengo-portfolio.danmengo-portfolio.workers.dev/api/chat", { method: "POST", body: "{}" }), env);
    expect(response.status).toBe(308);
    expect(run).not.toHaveBeenCalled();
    expect(limit).not.toHaveBeenCalled();
    expect(budgetFetch).not.toHaveBeenCalled();
  });
  it.each(["danmengo.com", "localhost", "danmengo-portfolio-rag.danmengo-portfolio.workers.dev"])("serves %s without redirecting", async (host) => {
    const fetch = vi.fn().mockResolvedValue(new Response("Portfolio"));
    const response = await worker.fetch(new Request(`https://${host}/chat`), { ASSETS: { fetch } });
    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledOnce();
    expect(response.headers.has("Location")).toBe(false);
  });
});
