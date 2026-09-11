# Building the portfolio RAG assistant

Start with [RAG_WALKTHROUGH.md](./RAG_WALKTHROUGH.md) for the integrated UI-to-model implementation.

## First milestone: inspect retrieval

From the project directory, run:

```sh
npm run rag:inspect -- "How did Fabflix improve XML performance?"
npm run rag:inspect -- "Which project uses Prisma?"
npm run rag:inspect -- "How do I bake sourdough?"
```

These commands are offline and do not call AI. They print the matching passages,
source paths, matched words and ranking scores. The unrelated question should
return no passages. Read the passages and decide whether they actually answer
the question. A search match is not proof that an answer exists.

## Read the code in this order

1. `src/rag/knowledge.ts`: the public knowledge base. Each passage has a stable
   ID, title, source URL and text. Project facts come from the existing project
   data. Resume passages were transcribed from the public resume and curated chat;
   update these when the resume changes. Private files and the raw PDF are not read.
2. `src/rag/retrieve.ts`: a small BM25 search implementation. Rare matching words
   count more; length normalization prevents long passages from always winning.
   It selects at most four passages. Scores are relative rankings, not confidence.
3. `src/rag/worker.ts`: validates a question, retrieves passages, reserves one AI
   call, and gives the question plus passages to Workers AI for answer generation.
4. `src/rag/budget.ts`: persists a daily counter in one shared Durable Object.
   A transaction reserves a slot before inference, so parallel requests cannot
   overspend this request allowance. Provider failures still consume their slot.
5. `src/rag/rag.test.ts`: retrieval examples and tests proving rejected requests
   never reach inference. The concurrency unit test models serialized storage;
   it is not a substitute for testing deployed Cloudflare storage behavior.

## Semantic retrieval and real answers

The Cloudflare index `danmengo-portfolio-knowledge` now contains 13 public
passages, embedded with `@cf/baai/bge-base-en-v1.5` (768 dimensions, CLS pooling).
Document IDs include a hash of the corpus, model and pooling configuration.
Queries use that same revision, so stale content cannot silently answer new questions.
Re-run indexing after changing the knowledge base; vector updates are asynchronous.
Old revision vectors are retained until explicitly cleaned up.

From the project directory after `wrangler login`:

```sh
npm run rag:query -- "How did he make bulk movie data imports quicker?"
npm run rag:answer -- "How did Fabflix improve XML parsing?"
npm run rag:evaluate
```

Unlike `rag:inspect`, these commands call your Cloudflare account. `rag:query`
uses one query embedding, `rag:answer` uses one embedding and at most one generated
answer, and `rag:evaluate` uses fourteen query embeddings. The manual CLI does not
use the public endpoint's rate limiter or daily counter. It does not run automatically.
Keep these commands on your development machine; there is no public indexing route.

`npm run rag:index` embeds and upserts the complete corpus in one batch. The index
already exists; for a new account create it with:

```sh
npx wrangler vectorize create danmengo-portfolio-knowledge --dimensions 768 --metric cosine
npm run rag:index
```

Read `src/rag/semantic.ts` for embeddings, revisioning and hybrid retrieval, then
`src/rag/answer.ts` for the shared prompt and answer handling. Hybrid retrieval
combines keyword and semantic ranks, retrieves at most four passages, and resolves
remote IDs back to the local allowlisted content. A 0.48 semantic cutoff was calibrated
on a small example set; it is not a confidence guarantee. Unprefixed queries worked
better with that cutoff than BGE's optional query instruction in our calibration.

Live checks on September 10, 2026 retrieved Fabflix for a paraphrase that BM25
missed. The first expanded evaluation passed 13/14 cases; fixing a one-letter
possessive-token false positive made the targeted football question return no evidence.
The live model correctly described Fabflix's 40% result and answered that the sports
agent's accuracy score was not documented. These are smoke checks, not a general
accuracy benchmark. Relevant evidence may appear alongside irrelevant passages,
and retrieval success currently means the expected topic occurs in the top four.

## Current status

The public UI now calls the same-origin RAG endpoint with a 100-request daily
allowance. Project followups are supported; full conversation history is not sent
to the server. The separate test deployment verified real rate limiting and a
two-request daily allowance, and is paused after verification.

The separate `wrangler.rag.jsonc` config defines an experimental Worker with
`CHAT_ENABLED=false`. The main website config serves both assets and the live backend.
`npm run rag:dev` starts this backend on loopback with chat disabled. Workers AI
in local development can use remote inference: enabling it can consume quota.
Do not enable it until the model, account access and operating allowance are settled.

The API contract is `POST /api/chat`, JSON `{ "question": "...", "project": "fabflix" }` (project is optional). Success returns
`paragraphs`, `sources`, `suggestions` and `mode`. Rejects unknown input fields.
It accepts no model selection, arbitrary URLs, system messages or client IP fields.
Source cards are retrieved references, not verified per-sentence citations.
Render paragraphs as React text, never raw HTML; use only returned source objects
for clickable links. The frontend implements both validations.

## Protections already implemented

- AI disabled unless explicitly enabled; missing protections fail closed.
- Five requests per 60 seconds per platform-provided IP, before parsing/inference.
- Shared daily allowance of 100 attempted chat requests, resetting at midnight UTC.
  Each hybrid request reserves before embedding and permits at most two AI calls:
  one query embedding and one generated answer. Requests without evidence still
  count when they incurred an embedding call.
- At most 500 question characters, 4 KB actual request bytes, four curated passages,
  and 350 output tokens. No chat history, automatic retries or tool execution.
- Provider errors are hidden. API responses are not cached. The code does not log
  questions, raw IPs or answers. Review platform logging before public release.
- Source URLs come from the allowlisted corpus; no public ingestion route.

The daily limit caps inference attempts, not total Cloudflare dollars: Worker,
storage, rate-limiter and other account usage can still cost money. IP limits are
approximate, can affect shared networks, and can be bypassed with multiple IPs.
The daily counter is separate because the rate limiter is not globally exact.

## Next milestones

1. Review the retrieved evidence together, add missing public project details,
   and expand evaluation questions (including unsupported metrics and comparisons).
2. Measure answer grounding, prompt injection attempts, latency and actual token
   cost on a larger held-out question set. Prompt instructions reduce risk but
   cannot guarantee factual answers.
3. Expand project-context handling or add bounded history based on real follow-up
   failures. UI integration, error states, cancellation and timeouts are implemented.
4. Monitor usage and consider Turnstile with server validation if abuse warrants it.
   Add a portfolio case study describing the verified behavior and limitations.

## Official references

- [Cloudflare RAG tutorial](https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/)
- [Worker rate limits and their accuracy](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Transactional Durable Object storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Model interface](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fast/)
