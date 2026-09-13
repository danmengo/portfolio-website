import { projects } from "../data/projects.ts";
import { ANSWER_MODEL, ANSWER_MODEL_NAME, EMBEDDING_MODEL, EMBEDDING_MODEL_NAME } from "./models.ts";

export interface Passage {
  id: string;
  title: string;
  href: string;
  text: string;
}

// Explicit allowlist of public facts; never ingest the repository or private files.
// Project passages reuse the same content that the portfolio displays.
export const knowledge: Passage[] = [
  { id: "mengoai", title: "About mengoAI", href: "/chat", text: `mengoAI is Daniel Meng's AI portfolio representative. It uses ${ANSWER_MODEL_NAME} (${ANSWER_MODEL}) to generate chat answers through Cloudflare Workers AI. It uses ${EMBEDDING_MODEL_NAME} (${EMBEDDING_MODEL}) for 768-dimensional text embeddings. Cloudflare Vectorize searches the portfolio notes, combined with keyword search, before the answer model writes a reply. This is retrieval-augmented generation (RAG), not a model trained on Daniel's resume. Questions about this chatbot's AI model, LLM, provider, or how mengoAI works refer to these models, not the Sports Analytics Agent's Gemini or BQML models.` },
  ...projects.flatMap((project) => [
    { id: `${project.id}-overview`, title: `${project.name}: overview`, href: `/projects/${project.id}`, text: `${project.name} (${project.date}). ${project.description} ${project.problem}` },
    { id: `${project.id}-technology`, title: `${project.name}: technologies`, href: `/projects/${project.id}`, text: `${project.name}. ${project.approach}` },
    { id: `${project.id}-results`, title: `${project.name}: documented results`, href: `/projects/${project.id}`, text: `${project.name}. ${project.bullets.join(" ")}` },
  ]),
  { id: "education", title: "Education", href: "/resume", text: "Daniel Meng graduated from UC Irvine (UCI) with a B.S. in Computer Science and Business Information Management, September 2022 through June 2026. Specialization: Intelligent Systems. GPA: 3.535. Coursework: Data Structures and Algorithms, System Design, Machine Learning, Information Retrieval." },
  { id: "teaching", title: "Coding instructor experience", href: "/resume", text: "Daniel was a Coding Instructor at American Young Coder Academy from May 2024 through March 2026. He led four weekly classes in Python, object-oriented programming, and problem solving. His resume reports a 27% improvement in student test scores." },
  { id: "credentials", title: "Certifications", href: "/resume", text: "Daniel earned SQL Bootcamp (Udemy), Google AI Professional Certificate (Coursera), and Claude Code in Action (Anthropic) certifications in 2026." },
  { id: "roles", title: "Career interests", href: "/resume", text: "Daniel Meng is seeking entry-level software engineering roles focused on full-stack development or AI/ML." },
];
