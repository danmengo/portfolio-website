import { projects } from "../data/projects.ts";

export interface Passage {
  id: string;
  title: string;
  href: string;
  text: string;
}

// Explicit allowlist of public facts; never ingest the repository or private files.
// Project passages reuse the same content that the portfolio displays.
export const knowledge: Passage[] = [
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
