import { topicPassageIds } from "./topics.ts";
import { projects } from "../data/projects.ts";
import type { ProjectId } from "../data/projects.ts";

export function contextualize(question: string, previous?: ProjectId) {
  const normalized = question.toLowerCase().replace(/[^a-z0-9]/g, "");
  const named = projects.filter((p) => normalized.includes(p.id.replace(/-/g, "")));
  if (named.length) return { query: question, project: named.length === 1 ? named[0].id : undefined };
  // Personal background and assistant questions start a new topic even when
  // they contain "this" or "that", which otherwise indicate project followups.
  if (/\b(study|studied|studying|school|college|university|major|majored|degree|education)\b/i.test(question)) {
    // In this portfolio's education questions, first-person shorthand refers
    // to Daniel's background rather than an unknown visitor's private history.
    return { query: question.replace(/\bi\b/gi, "Daniel").replace(/\bmy\b/gi, "Daniel's"), project: undefined };
  }
  if (/\bmengoai\b|\b(?:what|which)\s+(?:ai\s+)?(?:model|llm)\b|\b(?:are you|is this)\s+(?:an?\s+)?(?:ai|human|chatbot)\b|\b(?:powers|powering)\s+(?:you|this)\b/i.test(question)) {
    return { query: `About mengoAI: ${question}`, project: undefined };
  }
  if (topicPassageIds(question).length && !/\b(it|its|that|this)\b|did you use|your role/i.test(question)) return { query: question, project: undefined };
  const followsProject = /\b(it|its|that|this)\b|technolog|result|stack|metric|architect|did you use|tell me more|^\s*(?:why|how|more|go on|continue|and then|what else|what about|what did you do|what was your role|your role)\b/i.test(question);
  const project = previous && followsProject ? projects.find((p) => p.id === previous) : undefined;
  return { query: project ? `About ${project.name}: ${question}` : question, project: project?.id };
}
