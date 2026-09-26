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
  { id: "profile", title: "Daniel Meng: introduction and background", href: "/resume", text: "Daniel Meng is a UC Irvine graduate in Computer Science and Business Information Management, specializing in Intelligent Systems. He is seeking entry-level software engineering roles in full-stack development and AI/ML. His work includes group expense tracking, Java backend scaling, a baseball analytics agent, and a team capstone on conversational survey scoring. He also taught Python and problem solving as a coding instructor." },
  { id: "skills", title: "Programming languages, skills, frameworks, and tools", href: "/resume", text: "Daniel's resume lists Python, JavaScript/TypeScript, C/C++, SQL, C#, and Java; React, Node.js, and Next.js; MySQL, PostgreSQL, and MongoDB; AWS EC2 and load balancing, Google Cloud BigQuery and Cloud Run; ADK, MCP, BQML, and scikit-learn. Listing a skill does not establish expert proficiency or years of experience." },
  { id: "activities", title: "Activities, hobbies, sports, and life outside coding", href: "/resume", text: "Daniel's public resume lists membership in the UCI Triathlon Club from September 2025 to June 2026, training and competing in sprint-distance triathlons with a structured endurance schedule. It also lists student leadership in Asian American Christian Fellowship from September 2023 to June 2026, leading weekly small-group discussions and coordinating events for a 70+ member organization. These are documented activities, not evidence of favorite sports, music, food, or personal beliefs." },
  { id: "contact", title: "Contact Daniel: email, GitHub, LinkedIn, website", href: "/resume", text: "Daniel's public contact details are danielmeng530@gmail.com, github.com/danmengo, linkedin.com/in/danielmengo, and danmengo.com. He is open to entry-level software engineering opportunities. No salary, start date, or meeting availability is documented." },
  { id: "project-summary", title: "All projects: what Daniel has built", href: "/resume", text: "Daniel's projects include My Money (September 2026), a personal budgeting dashboard with Next.js, Supabase authentication, PostgreSQL Row Level Security, and Cloudflare Workers; Survey Sage (June 2026), a UCI team research prototype where he generated and scored synthetic conversations and evaluated models; SplitSmart (February 2026), a group expense app using Next.js and PostgreSQL; Sports Analytics Agent (October 2025), an MLB analytics system using ADK, Gemini, and BigQuery ML; and Fabflix (April 2025), a Java/MySQL application with AWS scaling and an optimized XML import workflow. The portfolio also includes mengoAI, a Cloudflare-hosted RAG assistant." },
  { id: "mengoai", title: "About mengoAI", href: "/chat", text: `mengoAI is Daniel Meng's AI portfolio representative. It uses ${ANSWER_MODEL_NAME} (${ANSWER_MODEL}) to generate chat answers through Cloudflare Workers AI. It uses ${EMBEDDING_MODEL_NAME} (${EMBEDDING_MODEL}) for 768-dimensional text embeddings. Cloudflare Vectorize searches the portfolio notes, combined with keyword search, before the answer model writes a reply. This is retrieval-augmented generation (RAG), not a model trained on Daniel's resume. Questions about this chatbot's AI model, LLM, provider, or how mengoAI works refer to these models, not the Sports Analytics Agent's Gemini or BQML models.` },
  ...projects.flatMap((project) => [
    { id: `${project.id}-overview`, title: `${project.name}: overview`, href: `/projects/${project.id}`, text: `${project.name} (${project.date}). ${project.description} ${project.problem}` },
    { id: `${project.id}-technology`, title: `${project.name}: technologies`, href: `/projects/${project.id}`, text: `${project.name}. ${project.approach}` },
    { id: `${project.id}-scope`, title: `${project.name}: results, limitations, and next steps`, href: `/projects/${project.id}`, text: `${project.name}. ${project.tradeoff} ${project.next}` },
    { id: `${project.id}-results`, title: `${project.name}: documented results`, href: `/projects/${project.id}`, text: `${project.name}. ${project.bullets.join(" ")}` },
  ]),
  { id: "education", title: "Education", href: "/resume", text: "Daniel Meng graduated from UC Irvine (UCI) with a B.S. in Computer Science and Business Information Management, September 2022 through June 2026. Specialization: Intelligent Systems. GPA: 3.535. Coursework: Data Structures and Algorithms, System Design, Machine Learning, Information Retrieval." },
  { id: "teaching", title: "Coding instructor experience", href: "/resume", text: "Daniel was a Coding Instructor at American Young Coder Academy from May 2024 through March 2026. He led four weekly classes in Python, object-oriented programming, and problem solving. His resume reports a 27% improvement in student test scores." },
  { id: "credentials", title: "Certifications", href: "/resume", text: "Daniel earned SQL Bootcamp (Udemy), Google AI Professional Certificate (Coursera), and Claude Code in Action (Anthropic) certifications in 2026." },
  { id: "roles", title: "Career interests", href: "/resume", text: "Daniel Meng is seeking entry-level software engineering roles focused on full-stack development or AI/ML." },
];
