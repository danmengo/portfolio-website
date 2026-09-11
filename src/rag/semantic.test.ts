import { expect, it, vi } from "vitest";
import { corpusRevision, embed, indexKnowledge, retrieveHybrid, type VectorIndex } from "./semantic";
import { knowledge } from "./knowledge";
import worker from "./worker";
import { retrieve } from "./retrieve";

it("does not treat the possessive s as evidence for a degree", () => {
  expect(retrieve("Who won yesterday's football match?")).toEqual([]);
});

const vector = () => Array(768).fill(0.01);
it("rejects incompatible embeddings before querying or indexing", async () => {
  for (const data of [[[1, 2]], [Array(768).fill(NaN)], []]) {
    await expect(embed({ run: async () => ({ data }) }, ["test"])).rejects.toThrow();
  }
});
it("indexes every passage under the current corpus revision", async () => {
  const run = vi.fn().mockResolvedValue({ data: knowledge.map(vector) });
  const upsert = vi.fn();
  const result = await indexKnowledge({ run }, { upsert } as unknown as VectorIndex);
  expect(result.passages).toBe(knowledge.length);
  expect(upsert.mock.calls[0][0].every((v: { namespace: string; id: string }) => v.namespace === result.revision && v.id.startsWith(result.revision + ":"))).toBe(true);
  expect(run.mock.calls[0][1].pooling).toBe("cls");
});
it("retrieves paraphrases while discarding untrusted and stale IDs", async () => {
  const revision = await corpusRevision();
  const query = vi.fn().mockResolvedValue({ matches: [
    { id: "attacker-controlled", score: 0.99 },
    { id: "old-revision:fabflix-results", score: 0.98 },
    { id: `${revision}:splitsmart-overview`, score: 0.8 },
  ] });
  const result = await retrieveHybrid("friends settling bills", { run: async () => ({ data: [vector()] }) }, { query } as unknown as VectorIndex);
  expect(result.map((p) => p.id)).toEqual(["splitsmart-overview"]);
  expect(result[0].href).toBe("/projects/splitsmart");
  expect(query.mock.calls[0][1].namespace).toBe(revision);
});
it("rejects low semantic similarity on an unrelated question", async () => {
  const revision = await corpusRevision();
  const result = await retrieveHybrid("bake sourdough", { run: async () => ({ data: [vector()] }) }, { query: async () => ({ matches: [{ id: `${revision}:education`, score: 0.2 }] }) } as unknown as VectorIndex);
  expect(result).toEqual([]);
});
it("fails closed for an empty current index", async () => {
  await expect(retrieveHybrid("Fabflix", { run: async () => ({ data: [vector()] }) }, { query: async () => ({ matches: [] }) } as unknown as VectorIndex)).rejects.toThrow("not indexed");
});
it("blocks query embedding when the daily allowance is exhausted", async () => {
  const run = vi.fn();
  const response = await worker.fetch(new Request("https://portfolio.example/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" }, body: JSON.stringify({ question: "friends settling bills" }) }), {
    CHAT_ENABLED: "true", RETRIEVAL_MODE: "hybrid", AI: { run },
    VECTOR_INDEX: {} as VectorIndex,
    CHAT_RATE_LIMITER: { limit: async () => ({ success: true }) },
    CHAT_BUDGET: { idFromName: (name) => name, get: () => ({ fetch: async () => Response.json({ allowed: false }) }) },
  });
  expect(response.status).toBe(503);
  expect(run).not.toHaveBeenCalled();
});
