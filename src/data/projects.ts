export type ProjectId = "splitsmart" | "sports-analytics-agent" | "fabflix";
export type ProjectCategory = "Full stack" | "AI / ML";

export interface Project {
  id: ProjectId;
  name: string;
  number: string;
  date: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  tags: string[];
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
    number: "01",
    date: "FEB 2026",
    category: "Full stack",
    tagline: "Split expenses. See where the money goes.",
    description:
      "A group expense-splitting application with Recharts analytics for understanding shared spending.",
    tags: ["Next.js", "Supabase", "PostgreSQL"],
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
    id: "sports-analytics-agent",
    name: "Sports Analytics Agent",
    number: "02",
    date: "OCT 2025",
    category: "AI / ML",
    tagline: "A data agent built around baseball questions.",
    description:
      "An agentic sports analytics system connecting Gemini to MLB APIs and data, with BQML win-probability modeling.",
    tags: ["GCP ADK", "Gemini", "BigQuery"],
    color: "sage",
    problem:
      "The project connects conversational analysis with MLB APIs and data for baseball questions and win-probability analysis.",
    approach:
      "Built with Google Cloud's Agent Development Kit, MCP, Gemini, BigQuery, and BQML, with Cloud Run and Streamlit in the application stack.",
    tradeoff:
      "The platform enabled the AI agent to provide real-time game outcome predictions and detailed performance analysis.",
    next: "The project demonstrates an end-to-end path from an agent request to MLB data and a BQML prediction.",
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
    color: "peach",
    problem:
      "Fabflix focused on the systems work required to operate a database-backed Java application across multiple instances.",
    approach:
      "Built with Tomcat, JDBC, and Maven, then deployed on AWS EC2 with load balancing and MySQL replication. The system also used connection pooling, batch processing, and caching.",
    tradeoff:
      "Optimizing XML parsing and inserts improved that workflow by 40%.",
    next: "The project demonstrates database and application scaling across a deployed Java stack.",
  },
];

export const findProject = (id: string | undefined) =>
  projects.find((project) => project.id === id);
