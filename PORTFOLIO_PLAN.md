# Portfolio plan

## Purpose

Build a distinctive personal portfolio that Daniel Meng can share with recruiters, other engineers, and potential collaborators while pursuing entry-level software engineering roles. Position the work around full-stack products, data systems, AI/ML, and evidence from his résumé.

## Agreed direction

- Keep the source code in GitHub and host with Cloudflare to learn a new platform.
- Choose a personal domain later; none has been purchased.
- Ground the public profile in Daniel’s supplied résumé and three résumé projects.
- Keep conventional portfolio navigation and readable project information alongside a signature “Ask my AI” experience.
- Explore a technical studio aesthetic with playful touches: distinctive type, strong hierarchy, precise diagrams, and purposeful motion.

## First version

| Area | Visitor goal | First-version scope |
| --- | --- | --- |
| Home | Understand the person and find the work quickly | Introduction, selected projects, role interests, and clear navigation |
| Projects | Explore software and engineering decisions | Filterable real projects with detail views and résumé-backed context |
| Project interaction | Try something before reading the explanation | A small browser-based playground or demo within the project presentation |
| About and experience | Learn about background and interests | UC Irvine education and American Young Coder Academy teaching experience |
| Ask my AI | Ask about projects and background conversationally | Functional preview with suggested questions and clearly identified curated answers |
| Résumé | Read a concise overview and save a copy | Print-ready résumé with browser print/save-to-PDF support |
| Contact | Find an authentic way to reach Daniel | Verified email, LinkedIn, and GitHub destinations |

Selected projects:

- **SplitSmart:** a Next.js and TypeScript group expense application with a Supabase, Prisma, and PostgreSQL data layer plus Recharts analytics.
- **Sports Analytics Agent:** an agentic system connecting Gemini to MLB APIs and data, with BigQuery ML win-probability modeling.
- **Fabflix:** a Java web application deployed on AWS EC2 with load balancing, MySQL replication, pooling, batch processing, and caching.

Project claims are limited to the supplied résumé. New metrics, links, collaborators, and implementation details require verification before publication.

## Implementation

Use React and TypeScript with Vite for a static single-page application. Cloudflare Workers Static Assets serves the production files, with a fallback for client-side routes. The current chat runs locally in the browser and uses curated sample responses. A live model backend is a later milestone.

GitHub Actions will run lint, tests, and a production build. Cloudflare Workers Builds can publish production from `main` and make previews for other branches once the accounts and repository are connected. Require passing checks before merges through a GitHub branch rule.

Design and implementation should support narrow screens, keyboard navigation, visible focus states, readable contrast, reduced-motion preferences, and clear loading/empty states where needed. Keep the core portfolio easy to browse without interacting with the chat.

## Before sharing as a real portfolio

1. Review the résumé-derived wording, project presentation, and printable résumé for accuracy.
2. Add verified repository or live-demo links for projects when Daniel wants them public.
3. Review the finished visual direction and interactions on desktop and mobile.
4. Connect the selected GitHub repository and Cloudflare account, configure required checks, and verify production plus preview deployments.
5. Choose an available personal domain, confirm its registration and renewal cost, and connect it to the Worker.

## Live AI milestone

Agree on an AI provider/model and operating budget. Build a Worker endpoint that retrieves from approved public project notes and résumé material, keeps credentials server-side, links answers to evidence, and refuses to invent missing details. Add rate limits, error handling, and response-quality checks before public use. Clearly identify the experience as danmengo's AI representative.

Project-aware links should open the chat with the relevant project in context. A “How this works” explanation can make the assistant itself a portfolio case study after the backend exists.

## Decisions intentionally left for later

Public project/demo URLs; domain name; model/provider; spending budget; whether a contact form needs a backend; and whether project content warrants static prerendering for search and link previews.
