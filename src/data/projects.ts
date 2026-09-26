export type ProjectId = "splitsmart" | "sports-analytics-agent" | "fabflix" | "survey-sage" | "my-money";
export type ProjectCategory = "Full stack" | "AI / ML";

export interface Project {
  id: ProjectId;
  name: string;
  liveUrl?: string;
  githubUrl?: string;
  number: string;
  date: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  tags: string[];
  technology: string;
  bullets: string[];
  color: string;
  problem: string;
  approach: string;
  tradeoff: string;
  next: string;
}

export const projects: Project[] = [
  {
    id: "splitsmart",
    name: "SplitSmart",
    githubUrl: "https://github.com/danmengo/splitsmart",
    liveUrl: "https://splitsmart-vgor.vercel.app",
    number: "03",
    date: "FEB 2026",
    category: "Full stack",
    tagline: "Split expenses. See where the money goes.",
    description:
      "A group expense-splitting application with Recharts analytics for understanding shared spending.",
    tags: ["Next.js", "Supabase", "PostgreSQL"],
    technology: "Next.js, TypeScript, Supabase, Prisma, PostgreSQL, Vercel",
    bullets: [
      "Built a full-stack accounting app with TypeScript, Prisma ORM, and PostgreSQL, supporting multi-user groups with expense splitting calculations, reducing manual tracking.",
      "Designed an interactive analytics dashboard using Recharts to visualize per-user spending breakdowns and monthly trends across shared expense groups.",
    ],
    color: "lavender",
    problem:
      "SplitSmart brings group expense splitting and spending analytics into one application.",
    approach:
      "Built with Next.js and TypeScript, with Supabase, Prisma, and PostgreSQL for the data layer and Recharts for analytics. The application was deployed on Vercel.",
    tradeoff:
      "The application supported multi-user groups with expense-splitting calculations, reducing the need for manual tracking. Its dashboard made per-user spending and monthly trends visible.",
    next: "The project demonstrates a full-stack path from expense data to interactive charts.",
  },
  {
    id: "fabflix",
    name: "Fabflix",
    number: "05",
    date: "APR 2025",
    category: "Full stack",
    tagline: "A Java web application built to scale.",
    description:
      "A deployed Java web application with load balancing, MySQL replication, connection pooling, batch processing, and caching.",
    tags: ["Java", "MySQL", "AWS EC2"],
    technology: "Apache Tomcat, JDBC, Maven, AWS EC2",
    bullets: [
      "Built and deployed a scalable full-stack web app using AWS EC2 with load balancing and primary-replica MySQL replication.",
      "Optimized database performance by using JDBC connection pooling and batch inserts, improving XML parsing and insert speed by 40% and eliminating unnecessary lookups through in-memory caching.",
    ],
    color: "peach",
    problem:
      "Fabflix focused on the systems work required to operate a database-backed Java application across multiple instances.",
    approach:
      "Built with Tomcat, JDBC, and Maven, then deployed on AWS EC2 with load balancing and MySQL replication. The system also used connection pooling, batch processing, and caching.",
    tradeoff:
      "JDBC connection pooling and batch inserts improved XML parsing and insert speed by 40%. In-memory caching eliminated unnecessary lookups.",
    next: "The project demonstrates database and application scaling across a deployed Java stack.",
  },
  {
    id: "sports-analytics-agent",
    name: "Sports Analytics Agent",
    githubUrl: "https://github.com/danmengo/sports-analytics-agent",
    liveUrl: "https://mlb-scout-ui-t5crpvofra-uc.a.run.app/",
    number: "04",
    date: "OCT 2025",
    category: "AI / ML",
    tagline: "A data agent built around baseball questions.",
    description:
      "An agentic sports analytics system connecting Gemini to MLB APIs and data, with BQML win-probability modeling.",
    tags: ["GCP ADK", "Gemini", "BigQuery"],
    technology: "Google Cloud, ADK, MCP, Gemini, BigQuery, Cloud Run, Streamlit",
    bullets: [
      "Built and deployed an end-to-end AI analytics platform using the Agent Development Kit (ADK) and Cloud Run, integrating real-time MLB APIs and BigQuery for scalable data ingestion and serving.",
      "Developed an ML-powered Win Probability model (BQML) within a BigQuery data lake, enabling the AI agent to provide real-time game outcome predictions and detailed performance analysis.",
    ],
    color: "sage",
    problem:
      "The project connects conversational analysis with MLB APIs and data for baseball questions and win-probability analysis.",
    approach:
      "Built and deployed with the Agent Development Kit (ADK) and Cloud Run, integrating real-time MLB APIs and BigQuery for scalable data ingestion and serving. The documented stack also includes MCP, Gemini, and Streamlit.",
    tradeoff:
      "Developed an ML-powered Win Probability model using BQML within a BigQuery data lake, enabling real-time game outcome predictions and detailed performance analysis.",
    next: "The project demonstrates an end-to-end path from an agent request to MLB data and a BQML prediction.",
  },
  {
    id: "survey-sage",
    name: "Survey Sage",
    githubUrl: "https://github.com/mindful-metrics/survey-sage",
    number: "02",
    date: "JUN 2026",
    category: "AI / ML",
    tagline: "From conversation to structured survey scores.",
    description: "A UCI capstone research prototype combining a conversational survey interface with local LLM scoring and model evaluation.",
    tags: ["Python", "Jupyter", "Ollama"],
    technology: "Python, Jupyter, Ollama, TypeScript, React, Bun, Elysia",
    bullets: [
      "Contributed to a UCI capstone team exploring conversational survey scoring; generated and scored synthetic conversations and evaluated models using Jupyter notebooks.",
      "The team benchmarked 10+ LLMs on 60 synthetic conversations across six survey instruments using mean squared error and statistical comparisons. This was a local research prototype, not a clinically validated system.",
    ],
    color: "sage",
    problem: "Survey Sage explored a conversational alternative to rating-scale forms for stress and mental-health research. The goal was to extract structured survey scores from transcripts; reduced participant fatigue was a goal, not a measured outcome.",
    approach: "The team built a React and TypeScript chat application with Bun and Elysia, local inference through Ollama, and a Python/Jupyter evaluation pipeline. Daniel generated and scored synthetic conversation data and evaluated models in notebooks. The application and evaluation pipeline were team deliverables, not solely Daniel's work.",
    tradeoff: "The final report describes 60 synthetic conversations across six instruments, two independent scorers, and benchmarks of 10+ LLMs using mean squared error. It reports better-than-random scoring (Wilcoxon p < 0.001) and no statistically significant difference among compared models or fine-tuned variants (Friedman p = 0.162). The small synthetic dataset does not establish clinical validity or model equivalence.",
    next: "The June 2026 capstone ran locally. Researcher administration, PostgreSQL persistence, and multi-study configuration were deferred. Future work includes expert annotations, a larger dataset, and evaluation with real participants under research oversight.",
  },
  {
    id: "my-money",
    name: "My Money",
    githubUrl: "https://github.com/danmengo/my-money-budget",
    liveUrl: "https://budget.danmengo.com",
    number: "01",
    date: "SEP 2026",
    category: "Full stack",
    tagline: "A clearer picture of your money.",
    description: "A personal finance dashboard for tracking income, expenses, monthly budgets, and savings and investing goals.",
    tags: ["Next.js", "Supabase", "Cloudflare"],
    technology: "Next.js, React, TypeScript, Supabase Auth, PostgreSQL, Tailwind CSS, shadcn/ui, Recharts, Cloudflare Workers",
    bullets: [
      "Built a personal budgeting app with income and expense tracking, editable categories, monthly budgets, savings and investing goals, and CSV transaction export.",
      "Integrated Google OAuth and passwordless email sign-in with Supabase Auth, with PostgreSQL Row Level Security restricting financial records to their owner.",
      "Created responsive spending analytics and monthly breakdowns with Recharts, deployed on Cloudflare Workers.",
    ],
    color: "sage",
    problem: "My Money brings day-to-day transactions, category budgets, and longer-term financial goals into one personal dashboard.",
    approach: "Built with Next.js, React, and TypeScript, using Tailwind CSS and shadcn/ui for the interface and Recharts for analytics. Supabase provides authentication and PostgreSQL storage; Cloudflare Workers hosts the app.",
    tradeoff: "The deployed app supports transaction tracking, monthly budget progress, savings and investing goals, spending breakdowns, and CSV export. The public repository does not report adoption or performance measurements.",
    next: "The project connects a responsive finance interface to per-user data access. PostgreSQL Row Level Security restricts reads and writes to the authenticated owner, and the browser uses a public Supabase key rather than a service-role key.",
  },
];

export const findProject = (id: string | undefined) =>
  projects.find((project) => project.id === id);

// Display order is separate from the source array used by the RAG index.
export const projectsNewestFirst = [...projects].sort((a, b) => a.number.localeCompare(b.number));
