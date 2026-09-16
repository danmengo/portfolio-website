import { expect, it, vi, afterEach } from "vitest";
import { getLiveWelcome, parseReply, requestReply } from "./live-chat";
import { contextualize } from "../rag/context";
import { withTimeout, DeadlineError } from "../rag/timeout";

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
it("welcomes visitors without the typing-live disclaimer", () => {
  for (const project of [undefined, "fabflix"] as const) {
    expect(getLiveWelcome(project).paragraphs.join(" ")).not.toMatch(/typing live/i);
  }
});
it("allows the public mengoAI reference", () => {
  expect(parseReply({ paragraphs: ["Model details"], sources: [{ href: "/chat", label: "About mengoAI", detail: "Public" }] }).sources[0].href).toBe("/chat");
});
it("rejects external and script source URLs", () => {
  for (const href of ["javascript:alert(1)", "//evil.example", "https://evil.example", "/unknown"]) {
    expect(() => parseReply({ paragraphs: ["Answer"], sources: [{ href, label: "Source", detail: "Details" }] })).toThrow();
  }
});
it("keeps model content as text and maps only approved sources", () => {
  const reply = parseReply({ paragraphs: ["<img src=x onerror=alert(1)>"], sources: [{ href: "/resume", label: "Resume", detail: "Public" }] });
  expect(reply.paragraphs[0]).toContain("<img");
  expect(reply.sources[0].href).toBe("/resume");
});
it("sends only question and project context", async () => {
  const fetchMock = vi.fn().mockResolvedValue(Response.json({ paragraphs: ["Answer"], sources: [] }));
  vi.stubGlobal("fetch", fetchMock);
  await requestReply("What technologies?", "fabflix", new AbortController().signal);
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ question: "What technologies?", project: "fabflix" });
});
it("explains rate limiting without exposing server errors", async () => {
  vi.stubGlobal("fetch", async () => new Response("private server detail", { status: 429 }));
  await expect(requestReply("Question", undefined, new AbortController().signal)).rejects.toThrow("wait a minute");
});
it("resolves project followups and permits switching topics", () => {
  expect(contextualize("What did I study?", "fabflix")).toEqual({ query: "What did Daniel study?", project: undefined });
  expect(contextualize("What AI model is this?", "fabflix")).toEqual({ query: "About mengoAI: What AI model is this?", project: undefined });
  expect(contextualize("What results are documented?", "fabflix")).toEqual({ query: "About Fabflix: What results are documented?", project: "fabflix" });
  expect(contextualize("Tell me about SplitSmart", "fabflix").project).toBe("splitsmart");
  expect(contextualize("Where did Daniel study?", "fabflix").project).toBeUndefined();
  expect(contextualize("Compare Fabflix and SplitSmart", "fabflix").project).toBeUndefined();
});
it("ends a stuck operation at its deadline", async () => {
  vi.useFakeTimers();
  const pending = withTimeout(new Promise(() => {}), 100);
  const check = expect(pending).rejects.toBeInstanceOf(DeadlineError);
  await vi.advanceTimersByTimeAsync(100);
  await check;
});

it("supports Survey Sage project context and its approved source", () => {
  expect(contextualize("Tell me about Survey Sage", "fabflix").project).toBe("survey-sage");
  expect(getLiveWelcome("survey-sage").paragraphs.join(" ")).toContain("Survey Sage");
  expect(parseReply({ paragraphs: ["Research prototype"], sources: [{ href: "/projects/survey-sage", label: "Survey Sage", detail: "Capstone" }], project: "survey-sage" }).project).toBe("survey-sage");
});
