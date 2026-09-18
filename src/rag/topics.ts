import { projects } from "../data/projects.ts";

/** Curated entry points for broad questions that share few words with a resume. */
export function topicPassageIds(question: string): string[] {
  const normalized = question.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (projects.some(p => normalized.includes(p.id.replace(/-/g, "")))) return [];
  if (/\b(hobb(?:y|ies)|free time|outside (?:of )?(?:work|coding)|for fun|enjoy|interests outside|sports do you)\b/i.test(question)) return ["activities", "roles"];
  if (/\b(languages?|skills?|tech stack|frameworks?|tools do you|technologies do you)\b/i.test(question)) return ["skills", "project-summary"];
  if (/\b(tell me about yourself|introduce yourself|who (?:are you|is daniel)|your background|about daniel|about you)\b/i.test(question)) return ["profile", "education", "project-summary", "activities"];
  if (/\b(projects|portfolio|what have you built|what did you build)\b/i.test(question)) return ["project-summary", ...projects.map(p => `${p.id}-overview`).slice(0, 3)];
  if (/\b(contact|reach you|email|github|linkedin)\b/i.test(question)) return ["contact"];
  if (/\b(experience|teach|taught|instructor|worked|work history)\b/i.test(question)) return ["teaching", "project-summary"];
  if (/\b(job|hire|hiring|looking for|career|roles)\b/i.test(question)) return ["roles", "skills", "project-summary"];
  return [];
}

/** Only whole-message social intents; mixed questions continue through retrieval. */
export function socialReply(question: string) {
  const q = question.trim().toLowerCase().replace(/[!?.]+$/g, "").trim();
  let text: string | undefined;
  if (/^(hi|hey|hello|hiya|yo)( mengoai)?$/.test(q)) text = "Hey hey 👋 Pick a rabbit hole: projects, my background, or life outside coding.";
  else if (/^(thanks|thank you|thank you so much|thx|ty)$/.test(q)) text = "Anytime! 😄";
  else if (/^(how are you|how's it going|what's up|whats up)$/.test(q)) text = "Hey! The chat is open and the pixels are behaving 😄 What’s on your mind?";
  else if (/^(are you smart|are you intelligent|how smart are you)$/.test(q)) text = "Let’s find out 😄 Ask me something about my projects. Bonus points if it’s more challenging than 2 + 2.";
  if (!text) return undefined;
  return { paragraphs: [text], sources: [], suggestions: [], mode: "conversation" };
}

export function noEvidenceReply() {
  return {
    paragraphs: ["You’ve found a gap in my notes 😅 Give me a little more context, or try my projects, skills, or life outside coding."],
    sources: [], suggestions: [], mode: "no-evidence",
  };
}
