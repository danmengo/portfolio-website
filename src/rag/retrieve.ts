import { knowledge } from "./knowledge.ts";

const stopWords = new Set("a an the is are was were what which how why did does do has have had he his daniel meng you your me about tell use used with and or to of in for it that this".split(" "));

function tokens(text: string): string[] {
  const aliases: Record<string, string> = {
    study: "education", studied: "education", studying: "education",
    school: "education", college: "education", university: "education",
    major: "education", majored: "education", degree: "education",
  };
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((term) => term.length > 1 && !stopWords.has(term)).map((term) => aliases[term] ?? term);
}

const indexed = knowledge.map((passage) => ({ passage, terms: tokens(`${passage.title} ${passage.text}`) }));
const averageLength = indexed.reduce((sum, doc) => sum + doc.terms.length, 0) / indexed.length;

/** BM25 keyword baseline. Scores rank matches; they are not confidence probabilities. */
export function retrieve(question: string) {
  const query = [...new Set(tokens(question))];
  const normalized = question.toLowerCase().replace(/[^a-z0-9]/g, "");
  const namedProjects = ["splitsmart", "sports-analytics-agent", "fabflix", "survey-sage"].filter((id) =>
    normalized.includes(id.replace(/-/g, "")),
  );
  // Explicit project questions should not retrieve unrelated projects merely
  // because they share generic words. Comparisons can still span the corpus.
  const candidates = namedProjects.length === 1
    ? indexed.filter(({ passage }) => passage.href === `/projects/${namedProjects[0]}`)
    : indexed;
  return candidates.map(({ passage, terms }) => {
    let score = 0;
    const matchedTerms: string[] = [];
    for (const term of query) {
      const frequency = terms.filter((candidate) => candidate === term).length;
      if (!frequency) continue;
      const documents = indexed.filter((doc) => doc.terms.includes(term)).length;
      const rarity = Math.log(1 + (indexed.length - documents + 0.5) / (documents + 0.5));
      score += rarity * (frequency * 2.2) / (frequency + 1.2 * (0.25 + 0.75 * terms.length / averageLength));
      matchedTerms.push(term);
    }
    return { ...passage, score, matchedTerms };
  }).filter((passage) => passage.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 4);
}
