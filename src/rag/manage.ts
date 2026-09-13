import { argv } from "node:process";
import { getPlatformProxy } from "wrangler";
import { indexKnowledge, retrieveHybrid, type AiBinding, type VectorIndex } from "./semantic.ts";
import { retrieve } from "./retrieve.ts";
import { generateReply } from "./answer.ts";
import { contextualize } from "./context.ts";

const command = argv[2];
if (!["index", "query", "answer", "evaluate"].includes(command)) throw new Error("Use index, query <question>, answer <question>, or evaluate");
const platform = await getPlatformProxy<{ AI: AiBinding; VECTOR_INDEX: VectorIndex }>({ configPath: "wrangler.index.jsonc", remoteBindings: true, persist: false });
try {
  const { AI, VECTOR_INDEX } = platform.env;
  if (command === "index") console.log(JSON.stringify(await indexKnowledge(AI, VECTOR_INDEX), null, 2));
  if (command === "query") {
    const question = contextualize(argv.slice(3).join(" ")).query;
    if (!question || question.length > 500) throw new Error("Provide a question of 1–500 characters");
    console.log(JSON.stringify({ question, keyword: retrieve(question), hybrid: await retrieveHybrid(question, AI, VECTOR_INDEX) }, null, 2));
  }
  if (command === "answer") {
    const question = contextualize(argv.slice(3).join(" ")).query;
    if (!question || question.length > 500) throw new Error("Provide a question of 1–500 characters");
    const passages = await retrieveHybrid(question, AI, VECTOR_INDEX);
    console.log(JSON.stringify({ question, evidence: passages.map((p) => p.id), reply: await generateReply(question, passages, AI) }, null, 2));
  }
  if (command === "evaluate") {
    const cases = [
      { question: "Which project helps friends settle shared bills?", expected: "splitsmart" },
      { question: "How did he make bulk movie data imports quicker?", expected: "fabflix" },
      { question: "Has he built anything that forecasts baseball outcomes?", expected: "sports-analytics-agent" },
      { question: "What did he teach children?", expected: "teaching" },
      { question: "Where did Daniel earn his degree?", expected: "education" },
      { question: "How did Fabflix improve XML parsing?", expected: "fabflix" },
      { question: "How do I bake sourdough?", expected: null },
      { question: "What is the weather in Paris tomorrow?", expected: null },
      { question: "Did he work with relational databases?", expected: "fabflix" },
      { question: "Who has experience with expense sharing dashboards?", expected: "splitsmart" },
      { question: "What is Daniel's academic background?", expected: "education" },
      { question: "What was his role at American Young Coder Academy?", expected: "teaching" },
      { question: "Write a recipe for chocolate brownies", expected: null },
      { question: "Who won yesterday's football match?", expected: null },
    ];
    for (const { question, expected } of cases) {
      const keyword = retrieve(question);
      const hybrid = await retrieveHybrid(question, AI, VECTOR_INDEX);
      const hit = (items: { id: string }[]) => expected === null ? items.length === 0 : items.some((p) => p.id.startsWith(expected));
      console.log(JSON.stringify({ question, expected, keywordPass: hit(keyword), hybridPass: hit(hybrid), hybrid: hybrid.map(({ id, similarity }) => ({ id, similarity })) }));
    }
  }
} finally { await platform.dispose(); }
