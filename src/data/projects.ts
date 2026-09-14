export type ProjectId = "splitsmart" | "sports-analytics-agent" | "fabflix";
export type ProjectCategory = "Full stack" | "AI / ML";

export interface Project {
  id: ProjectId;
  name: string;
  liveUrl?: string;
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
    liveUrl: "https://splitsmart-vgor.vercel.app",
    number: "01",
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
    number: "03",
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
    liveUrl: "https://mlb-scout-ui-t5crpvofra-uc.a.run.app/",
    number: "02",
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
];

export const findProject = (id: string | undefined) =>
  projects.find((project) => project.id === id);

// Display order is separate from the source array used by the RAG index.
export const projectsNewestFirst = [...projects].sort((a, b) => a.number.localeCompare(b.number));
