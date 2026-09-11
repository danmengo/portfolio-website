# Daniel Meng — Portfolio

[![Portfolio CI](https://github.com/danmengo/portfolio-website/actions/workflows/ci.yml/badge.svg)](https://github.com/danmengo/portfolio-website/actions/workflows/ci.yml)
[![Live on Cloudflare](https://img.shields.io/badge/live-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://danmengo-portfolio.danmengo-portfolio.workers.dev/)

A personal portfolio for my software engineering search, focused on full-stack development and AI/ML. It presents my work as concise case studies, includes a browser-friendly résumé, and experiments with a conversational way to explore my experience.

**[View the live portfolio →](https://danmengo-portfolio.danmengo-portfolio.workers.dev/)**

## Highlights

- Filterable project showcase with dedicated case-study pages
- Interactive project diagrams and small working playgrounds
- Live “Ask my AI” with hybrid retrieval, source links, and bounded project context
- Public web résumé with a downloadable PDF and print support
- Light, dark, and system-aware color themes
- Responsive navigation, keyboard support, reduced-motion support, and SPA routing

The AI calls a same-origin Cloudflare Worker, retrieves public portfolio evidence
with BM25 and Vectorize, and generates answers through Workers AI. Per-IP rate
limits and a shared daily allowance run before AI calls; credentials stay server-side.

A separate RAG backend with a populated Cloudflare vector index is available. Start with
`npm run rag:inspect -- "How did Fabflix improve XML performance?"` to inspect
retrieved evidence without calling AI. `npm run rag:answer -- "How did Fabflix improve XML parsing?"`
retrieves from the live index and generates an answer using Workers AI.
Start with [RAG_WALKTHROUGH.md](./RAG_WALKTHROUGH.md) for a guided tour of the complete flow.
See [RAG_GUIDE.md](./RAG_GUIDE.md) for the
architecture, implemented protections, limitations, and next milestones.

## Featured work

| Project | Focus | Stack |
| --- | --- | --- |
| **SplitSmart** | Group expense splitting and spending analytics | Next.js, Supabase, PostgreSQL |
| **Fabflix** | Scalable database-backed Java web application | Java, MySQL, AWS EC2 |
| **Sports Analytics Agent** | Baseball data agent and win-probability analysis | GCP ADK, Gemini, BigQuery |

## Built with

- React 19 and TypeScript
- Vite 7
- React Router
- Lucide icons
- Vitest and ESLint
- Cloudflare Workers Static Assets
- GitHub Actions and Cloudflare Workers Builds

## Run locally

This project uses Node.js 22.22.0, recorded in `.nvmrc`.

```bash
npm ci
npm run dev
```

Vite prints the local development URL in the terminal.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint |
| `npm run test -- --run` | Run the test suite once |
| `npm run build` | Type-check and create the production build |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build and deploy manually with Wrangler |

## Project structure

```text
src/
├── components/       Page sections and shared interface components
├── data/projects.ts  Project summaries and case-study content
├── lib/chat.ts       Curated chat topics and response logic
├── App.tsx           Routes, navigation, and page metadata
└── styles.css        Global design system and responsive styles
public/
├── Daniel_Meng_Resume.pdf
└── favicon.svg
```

The main content can be updated in:

- `src/components/HomePage.tsx` for the introduction, experience, and contact details
- `src/data/projects.ts` for project cards and case studies
- `src/components/ResumePage.tsx` for the web résumé
- `src/lib/chat.ts` for the curated conversation content

## CI/CD

GitHub Actions runs linting, tests, and a production build for pull requests and pushes to `main`. Cloudflare Workers Builds is connected to the GitHub repository so pushes to `main` can publish the resulting static assets to the live Worker.

Cloudflare uses `wrangler.jsonc` to serve `dist/` and fall back to the React application for nested routes. A manual deployment is also available after authenticating Wrangler:

```bash
npm run deploy
```

## Current status

The repository is private while the portfolio content is being finalized. Search-engine indexing is also disabled in `index.html`; that directive can be removed when the site is ready for broader sharing.

See [`PORTFOLIO_PLAN.md`](./PORTFOLIO_PLAN.md) for the product direction and future ideas, including the model-backed version of “Ask my AI.”
