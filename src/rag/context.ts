import { projects } from "../data/projects.ts";
import type { ProjectId } from "../data/projects.ts";

export function contextualize(question: string, previous?: ProjectId) {
  const normalized = question.toLowerCase().replace(/[^a-z0-9]/g, "");
  const named = projects.filter((p) => normalized.includes(p.id.replace(/-/g, "")));
  if (named.length) return { query: question, project: named.length === 1 ? named[0].id : undefined };
  const followsProject = /\b(it|its|that|this)\b|technolog|result|stack|metric|architect|tell me more/i.test(question);
  const project = previous && followsProject ? projects.find((p) => p.id === previous) : undefined;
  return { query: project ? `About ${project.name}: ${question}` : question, project: project?.id };
}
