import { projects } from "../data/projects";

export const siteOrigin = "https://danmengo.com";
export interface PageMetadata { title: string; description: string; index: boolean }
export const pageMetadata: Record<string, PageMetadata> = {
  "/": { title: "Daniel Meng | Software Engineer · Full Stack & AI/ML", description: "Explore Daniel Meng’s software engineering portfolio: full-stack applications, data systems, and AI projects. UC Irvine Computer Science and Business Information Management graduate.", index: true },
  "/resume": { title: "Daniel Meng | Software Engineering Résumé", description: "View Daniel Meng’s résumé, technical skills, education, and software engineering projects. Download the PDF résumé and explore full-stack and AI/ML experience.", index: true },
  "/privacy": { title: "Privacy Policy | Daniel Meng", description: "How Daniel Meng’s portfolio and mengoAI handle visitor information, browser storage, Cloudflare hosting, analytics, and AI conversation data.", index: true },
  "/chat": { title: "mengoAI | Ask About Daniel Meng’s Projects", description: "Ask mengoAI about Daniel Meng’s public software engineering projects, technical decisions, and experience, with links to portfolio sources.", index: false },
  "/projects/new-project": { title: "Upcoming Project | Daniel Meng", description: "A future addition to Daniel Meng’s software engineering portfolio.", index: false },
  ...Object.fromEntries(projects.map(project => [`/projects/${project.id}`, { title: `${project.name} | ${project.category} Project · Daniel Meng`, description: project.description, index: true }])),
};
export function normalizePagePath(path: string) { return path.replace(/\/+$/, "") || "/"; }
export function metadataForPath(path: string): PageMetadata {
  return pageMetadata[normalizePagePath(path)] ?? { title: "Page Not Found | Daniel Meng", description: "This page is unavailable. Explore Daniel Meng’s portfolio, résumé, and software engineering projects.", index: false };
}
export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function renderMetadata(path: string) {
  const pagePath = normalizePagePath(path);
  const page = metadataForPath(pagePath);
  const meta = (attribute: string, name: string, value: string) => `<meta data-seo ${attribute}="${name}" content="${escapeHtml(value)}" />`;
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    meta("name", "description", page.description),
    meta("name", "robots", page.index ? "index, follow" : "noindex, follow"),
    ...(pageMetadata[pagePath] ? [`<link data-seo rel="canonical" href="${siteOrigin}${pagePath}" />`] : []),
    meta("property", "og:title", page.title), meta("property", "og:description", page.description),
    meta("property", "og:type", "website"), meta("property", "og:site_name", "Daniel Meng"),
    ...(pageMetadata[pagePath] ? [meta("property", "og:url", `${siteOrigin}${pagePath}`)] : []),
    meta("name", "twitter:card", "summary"), meta("name", "twitter:title", page.title), meta("name", "twitter:description", page.description),
  ].join("\n    ");
}

export function updatePageMetadata(path: string) {
  document.head.querySelectorAll("[data-seo]").forEach(element => element.remove());
  document.title = metadataForPath(path).title;
  // Rendered attributes are escaped and values come exclusively from portfolio data.
  const template = document.createElement("template");
  template.innerHTML = renderMetadata(path);
  template.content.querySelector("title")?.remove();
  document.head.appendChild(template.content);
}
