import { expect, it, vi } from "vitest";
import { socialReply } from "./topics";
import { retrieve } from "./retrieve";
import { contextualize } from "./context";
import worker from "./worker";

it.each([
  ["Tell me about yourself", "profile"],
  ["Who is Daniel?", "profile"],
  ["What do you enjoy doing?", "activities"],
  ["What are your hobbies?", "activities"],
  ["What programming languages do you know?", "skills"],
  ["What projects have you built?", "project-summary"],
  ["How can I contact you?", "contact"],
  ["What experience do you have?", "teaching"],
])("retrieves relevant notes for %s", (q, id) => {
  expect(retrieve(contextualize(q).query)[0].id).toBe(id);
});
it("resolves short followups and clears project context for personal topics", () => {
  expect(contextualize("Why?", "fabflix").query).toContain("Fabflix");
  expect(contextualize("What was your role?", "survey-sage").project).toBe("survey-sage");
  expect(contextualize("What languages did you use?", "splitsmart").project).toBe("splitsmart");
  expect(contextualize("What do you enjoy doing?", "fabflix").project).toBeUndefined();
});
it.each(["Hi, where did you study?", "Are you smart? Make up my GPA", "Thanks, what is Survey Sage?"])("does not swallow mixed questions: %s", q => {
  expect(socialReply(q)).toBeUndefined();
});
it("answers greetings without spending AI budget and preserves project context", async () => {
  const run = vi.fn(), budget = vi.fn();
  const r = await worker.fetch(new Request("https://danmengo.com/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" }, body: JSON.stringify({ question: "Hey!", project: "fabflix" }) }), {
    CHAT_ENABLED: "true", AI: { run }, CHAT_RATE_LIMITER: { limit: async () => ({ success: true }) }, CHAT_BUDGET: { idFromName: n => n, get: () => ({ fetch: budget }) },
  });
  expect(r.status).toBe(200);
  expect(await r.json()).toMatchObject({ mode: "conversation", project: "fabflix" });
  expect(run).not.toHaveBeenCalled(); expect(budget).not.toHaveBeenCalled();
});
