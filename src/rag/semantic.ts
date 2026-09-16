import { knowledge } from "./knowledge.ts";
import { retrieve } from "./retrieve.ts";

import { EMBEDDING_MODEL } from "./models.ts";
export { EMBEDDING_MODEL } from "./models.ts";
export const EMBEDDING_DIMENSIONS = 768;
export const POOLING = "cls";
// Starting threshold, evaluated by rag:evaluate; not a confidence probability.
export const MIN_SIMILARITY = 0.48;
export interface AiBinding {
  run(model: string, input: { text: string[]; pooling: string } | {
    messages: { role: string; content: string }[]; max_tokens: number; temperature: number;
  }): Promise<unknown>;
}
export interface VectorIndex {
  query(vector: number[], options: { topK: number; namespace: string; returnMetadata: "none" }): Promise<{ matches: { id: string; score: number }[] }>;
  upsert(vectors: { id: string; namespace: string; values: number[] }[]): Promise<unknown>;
}

// Both indexing and querying use this revision. Changed facts cannot silently
// reuse old embeddings. Include model/pooling because they define vector space.
export async function corpusRevision() {
  const bytes = new TextEncoder().encode(JSON.stringify({ model: EMBEDDING_MODEL, pooling: POOLING, knowledge }));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export async function embed(ai: AiBinding, texts: string[]) {
  const output = await ai.run(EMBEDDING_MODEL, { text: texts, pooling: POOLING });
  if (!output || typeof output !== "object" || !("data" in output) || !Array.isArray(output.data) || output.data.length !== texts.length) throw new Error("Invalid embedding batch");
  const vectors: number[][] = output.data;
  if (vectors.some((vector) => !Array.isArray(vector) || vector.length !== EMBEDDING_DIMENSIONS || vector.some((value) => typeof value !== "number" || !Number.isFinite(value)))) throw new Error("Invalid embedding dimensions or values");
  return vectors;
}

export async function indexKnowledge(ai: AiBinding, index: VectorIndex) {
  const revision = await corpusRevision();
  // Our hand-authored passages are deliberately short; don't silently truncate
  // future documents at the embedding model's 512-token context limit.
  const texts = knowledge.map((p) => `${p.title}\n${p.text}`);
  if (texts.some((text) => text.length > 1400)) throw new Error("Split long passages before indexing");
  const vectors = await embed(ai, texts);
  const mutation = await index.upsert(knowledge.map((p, i) => ({ id: `${revision}:${p.id}`, namespace: revision, values: vectors[i] })));
  return { revision, passages: knowledge.length, mutation };
}

/** Combine keyword precision and semantic paraphrase matching with rank fusion. */
export async function retrieveHybrid(question: string, ai: AiBinding, index: VectorIndex) {
  const revision = await corpusRevision();
  // Unprefixed queries performed better on our small calibration set than the
  // optional BGE instruction. Keep that choice explicit and re-evaluate changes.
  const [vector] = await embed(ai, [question]);
  const result = await index.query(vector, { topK: 20, namespace: revision, returnMetadata: "none" });
  if (!result.matches.length) throw new Error("Current corpus is not indexed");
  const normalized = question.toLowerCase().replace(/[^a-z0-9]/g, "");
  const named = ["splitsmart", "fabflix", "sports-analytics-agent", "survey-sage"].filter((id) => normalized.includes(id.replace(/-/g, "")));
  const allowed = knowledge.filter((p) => named.length !== 1 || p.href === `/projects/${named[0]}`);
  // Ignore remote text/URLs and unknown/stale IDs; resolve trusted local content.
  const byId = new Map(allowed.map((p) => [`${revision}:${p.id}`, p]));
  const semantic = result.matches.filter((match) => Number.isFinite(match.score) && match.score >= MIN_SIMILARITY && byId.has(match.id)).map((match) => ({ ...byId.get(match.id)!, similarity: match.score }));
  const lexical = retrieve(question);
  const scores = new Map<string, number>();
  for (const list of [lexical, semantic]) list.forEach((p, rank) => scores.set(p.id, (scores.get(p.id) ?? 0) + 1 / (60 + rank + 1)));
  return allowed.filter((p) => scores.has(p.id)).map((p) => ({ ...p, score: scores.get(p.id)!, similarity: semantic.find((s) => s.id === p.id)?.similarity }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, 4);
}
