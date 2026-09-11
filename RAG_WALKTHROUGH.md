# How your portfolio AI works

You now have two programs working together: a React interface in the browser and
a Cloudflare Worker on the server. The browser collects questions and displays
answers. The Worker controls what can be searched, calls the models, and enforces
the limits. Nothing trains or changes the language model's weights.

## Follow one question

Suppose you open the Fabflix chat and ask **What results are documented?**

```text
ChatPage.tsx: collect question + current project
    ↓ POST /api/chat
worker.ts: validate, check rate limit, reserve daily slot
    ↓ context.ts: About Fabflix: What results are documented?
semantic.ts: embed question → search Vectorize
retrieve.ts: search the same corpus by keywords
    ↓ combine rankings; keep up to four approved passages
answer.ts: question + evidence → Workers AI language model
    ↓ paragraphs + source links + current project
live-chat.ts: validate response and source URLs
    ↓
ChatPage.tsx: render text, source cards and follow-up suggestions
```

## 1. The knowledge base: what the assistant can know about you

Open `src/rag/knowledge.ts`. Each passage has an ID, title, URL and text. A passage
is one small searchable piece of evidence. Project facts come from
`src/data/projects.ts`, the same file used by your project pages and web résumé.
Education and teaching passages are manually curated public facts.

We deliberately use a short allowlist rather than indexing every repository file.
The assistant can read the approved public facts; it has no tool for opening
private files, changing your site, or following arbitrary URLs.

**Try:** find `fabflix-results`. Notice that its text originates from the résumé
bullets in the shared project data. A source URL tells the reader where to check it.

## 2. Indexing: prepare documents before anyone asks a question

Open `src/rag/semantic.ts` and find `indexKnowledge`.

An embedding model converts text into a list of numbers representing its meaning.
We use BGE base English v1.5 through Workers AI, producing 768 numbers per passage.
Those vectors are stored in the Cloudflare Vectorize index
`danmengo-portfolio-knowledge`. This step currently indexes 13 passages.

The same model and `cls` pooling setting must be used for documents and questions.
Vectors from incompatible models or pooling settings cannot be compared reliably.

`corpusRevision` hashes the content, model and pooling configuration. The hash is
used as a namespace and included in vector IDs. If you change a fact, the new
Worker will search the new revision; you must index it before deploying. This
prevents an old vector from silently being treated as up-to-date evidence.

```sh
npm run rag:index
```

This command uses your Cloudflare account and incurs embedding/index usage. It is
an explicit maintenance command, not something each visitor runs. Upserts are
asynchronous: allow the mutation to become queryable before deploying. Old
revision vectors are retained until explicitly cleaned up.

## 3. Retrieval: find evidence before writing an answer

There are two searches:

- `retrieve.ts` uses BM25 keyword scoring. Rare matching terms contribute more,
  and document length is normalized. It is useful for names such as Fabflix and
  exact technology names such as JDBC.
- `semantic.ts` embeds the question and searches for vectors with similar
  meaning. It can match “bulk movie data imports quicker” to Fabflix even when
  the exact phrasing does not appear in the résumé.

Hybrid retrieval combines the two rankings using reciprocal rank fusion:
each result gets `1 / (60 + rank + 1)` from each list it appears in. We use ranks
because BM25 scores and cosine similarities have different scales.

The current semantic cutoff is 0.48, calibrated on a small example set. It is not
a confidence percentage. Relevant and irrelevant passages can both be retrieved;
our initial evaluation checks whether the expected topic appears in the top four.
It does not prove every result is relevant or every answer is factual.

Compare these commands:

```sh
# Offline; prints keyword matches and the words that matched.
npm run rag:inspect -- "How did he make bulk movie data imports quicker?"

# Calls Workers AI once for a query embedding, then searches the remote index.
npm run rag:query -- "How did he make bulk movie data imports quicker?"
```

**Try:** ask about a project using its exact name, then describe it without naming
it. Compare which passages appear. Also try a question unrelated to your portfolio.

## 4. Generation: give the model an open-book question

Open `src/rag/answer.ts`. The model receives a system instruction and a JSON object
containing the question and retrieved evidence. It is told to use that evidence,
acknowledge missing details, and never invent credentials or metrics.

The answer model is `@cf/meta/llama-3.1-8b-instruct-fast`, with at most 350 output
tokens. Tokens are pieces of text used for model input/output accounting; they
are not exactly words. Temperature 0.2 reduces variation but does not guarantee
the same answer each time or eliminate hallucinations.

Source links come from the local knowledge base, never from model-generated URLs.
They identify retrieved references; we do not yet verify each sentence against
a specific citation. The model's answer is rendered as plain React text, so an
HTML-looking answer is not executed as HTML.

```sh
npm run rag:answer -- "How did Fabflix improve XML parsing?"
npm run rag:answer -- "What accuracy score did the Sports Analytics Agent achieve?"
```

In the live smoke tests, the first answer reported the documented 40% result;
the second acknowledged that the accuracy score was not documented.

## 5. The browser: request state and cancellation

Open `src/components/ChatPage.tsx`, then `src/lib/live-chat.ts`.

The original interface selected a canned answer and displayed it after a timer.
It now calls `fetch('/api/chat')`. While waiting, the send controls are disabled
and a status indicator is shown. Success appends an answer; failure restores the
question draft and displays an error. There is no automatic retry that could
silently consume more quota.

Each send gets an `AbortController`. New chat and unmount abort that browser
request. The component also checks controller identity before applying a response,
so an old response cannot enter a newer conversation. A 35-second browser timeout
prevents indefinite waiting. Server-side stages have their own deadlines.

Cancellation and timeouts do not guarantee an already-started provider call is
canceled or unbilled. Its reserved daily slot remains consumed.

`context.ts` carries only a validated project ID between questions. “What results
are documented?” after a Fabflix question becomes a Fabflix query. Naming
SplitSmart changes the project; an education question clears project context.
This is intentionally limited memory, not full multi-turn conversation retrieval.

**Try in the UI:** ask about Fabflix, follow with “What technologies did you use?”,
then switch to education. Start New chat during a request and confirm that an old
answer does not appear afterward.

## 6. Protections: what runs before model calls

Open `src/rag/worker.ts`, `src/rag/budget.ts`, and `wrangler.jsonc`.

1. Accept only the chat API's method and schema. The actual body is bounded to
   4 KB, the question to 500 characters, and the optional project to three IDs.
2. Apply a five-per-minute per-IP Cloudflare rate limit. This is approximate and
   per location; it is not a strict global billing counter.
3. Reserve one of 100 daily request slots in one shared Durable Object. A storage
   transaction makes concurrent reservations atomic. The count resets at UTC
   midnight. Failed requests are not refunded.
4. Each hybrid slot permits at most one embedding call and one generation call.
   Missing evidence may skip generation, but the embedding still consumes a slot.
5. Keep credentials and bindings on the server. The frontend contains no API key.
6. Return controlled errors and `Cache-Control: no-store`; do not log chat content
   in application code. Provider/platform processing and retention still apply.

The daily allowance bounds chat AI calls, not the entire Cloudflare bill. Worker,
storage, indexing and CLI usage are separate. Manual `rag:*` commands bypass the
public endpoint's counter; run them deliberately. Turnstile is not enabled yet.

To pause live inference, set `CHAT_ENABLED` to `false` in `wrangler.jsonc` and
deploy. The website remains available and the chat shows an unavailable message.

## 7. Hosting and verification

The existing website Worker now serves both static assets and `/api/*` routes.
`run_worker_first` ensures an API request reaches server code rather than the SPA
HTML fallback. Unknown API routes return JSON 404s. Normal pages still use React
Router and static asset delivery. No cross-origin API connection is needed.

For local work, run Vite and `npm run rag:dev` in separate terminals. Vite proxies
`/api` to port 8787. The test Worker config starts with AI disabled; enable remote
bindings deliberately when exercising real models. The manually deployed test
Worker was used with a two-request allowance and is paused after verification.

Verification covered real browser answers, source navigation, project context,
simulated 429/503/504 errors, draft preservation, reset cancellation, and responsive
composer visibility. Two concurrent requests competing for one remaining slot on
the deployed test Worker yielded one answer and one allowance rejection. A bounded
burst returned a real 429 with Retry-After 60; requests alternated between two
Cloudflare locations, demonstrating why the IP limiter is approximate.

```sh
npm run test -- --run
npm run lint
npm run build
```

The next learning exercise is evaluation: write ten new questions with expected
evidence and answers before running them. Separate retrieval misses from generation
mistakes. That tells you whether to improve content, search, context handling or
the prompt instead of changing everything at once.
