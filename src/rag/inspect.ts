import { argv } from "node:process";
import { retrieve } from "./retrieve.ts";

const question = argv.slice(2).join(" ") || "How did Fabflix improve XML performance?";
console.log(`Question: ${question}\nRetriever: BM25 (no AI calls)\n`);
for (const passage of retrieve(question)) {
  console.log(`${passage.id} | score ${passage.score.toFixed(3)} | matched: ${passage.matchedTerms.join(", ")}\n${passage.text}\nSource: ${passage.href}\n`);
}
