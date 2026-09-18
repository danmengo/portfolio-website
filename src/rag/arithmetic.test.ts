import { expect, it, vi } from "vitest";
import { arithmeticReply } from "./arithmetic";
import worker from "./worker";

it.each([
  ["Whats 5+10", "15 😄"], ["What's 2+2?", "4 😄"],
  ["What’s 8 divided by 2?", "4 😄"], ["calculate -3 times 4", "-12 😄"],
  ["0.1 + 0.2", "0.3 😄"], ["10 - -2", "12 😄"],
  ["5 / 0", "Division by zero is undefined."],
])("answers standalone arithmetic: %s", (question, answer) => {
  expect(arithmeticReply(question)?.paragraphs).toEqual([answer]);
});
it.each(["What is 5+10 in Survey Sage?", "2+2; process.exit()", "What was the 40% improvement in Fabflix?", "2+2 and where did you study?"])("does not consume mixed or non-arithmetic questions: %s", q => {
  expect(arithmeticReply(q)).toBeUndefined();
});
it("bypasses retrieval and AI for arithmetic even with a prior project", async () => {
  const run = vi.fn(), query = vi.fn(), budget = vi.fn();
  const response = await worker.fetch(new Request("https://danmengo.com/api/chat", {
    method: "POST", headers: { "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" },
    body: JSON.stringify({ question: "Whats 5+10", project: "survey-sage" }),
  }), { CHAT_ENABLED: "true", RETRIEVAL_MODE: "hybrid", AI: { run }, VECTOR_INDEX: { query, upsert: vi.fn() },
    CHAT_RATE_LIMITER: { limit: async () => ({ success: true }) },
    CHAT_BUDGET: { idFromName: n => n, get: () => ({ fetch: budget }) },
  });
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ paragraphs: ["15 😄"], sources: [], mode: "arithmetic" });
  expect(query).not.toHaveBeenCalled(); expect(run).not.toHaveBeenCalled(); expect(budget).not.toHaveBeenCalled();
});
