import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  Cloud,
  Database,
  GitBranch,
  ReceiptText,
  Server,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { findProject, type ProjectId } from "../data/projects";
import ProjectArtwork from "./ProjectArtwork";

type SystemPart = { title: string; icon: LucideIcon; text: string };

const projectSystems: Record<ProjectId, SystemPart[]> = {
  splitsmart: [
    {
      title: "Product",
      icon: Users,
      text: "Next.js and TypeScript power the multi-user expense experience and its interactive analytics dashboard.",
    },
    {
      title: "Data",
      icon: Database,
      text: "Prisma connects the application to PostgreSQL, with Supabase included in the documented stack.",
    },
    {
      title: "Delivery",
      icon: Cloud,
      text: "The project was deployed with Vercel; Recharts visualizes spending breakdowns and monthly trends.",
    },
  ],
  "sports-analytics-agent": [
    {
      title: "Live data",
      icon: GitBranch,
      text: "Real-time MLB APIs feed the analytics platform, with BigQuery providing scalable ingestion and serving.",
    },
    {
      title: "Intelligence",
      icon: Bot,
      text: "ADK, MCP, and Gemini form the agent layer, while a BQML model produces win-probability predictions.",
    },
    {
      title: "Delivery",
      icon: Cloud,
      text: "The end-to-end platform uses Streamlit and Cloud Run to deliver predictions and performance analysis.",
    },
  ],
  fabflix: [
    {
      title: "Application",
      icon: Server,
      text: "Fabflix is a full-stack Java application built with Apache Tomcat, JDBC, and Maven.",
    },
    {
      title: "Scale",
      icon: GitBranch,
      text: "The AWS EC2 deployment used load balancing and primary-replica MySQL database replication.",
    },
    {
      title: "Performance",
      icon: BarChart3,
      text: "Connection pooling, batch inserts, and in-memory caching improved the XML import path and removed unnecessary lookups.",
    },
  ],
};

function SplitSmartDemo() {
  const [total, setTotal] = useState("186");
  const [people, setPeople] = useState(3);
  const amount = Math.max(0, Number(total) || 0);
  const share = amount / people;
  return (
    <div className="playground evidence-playground">
      <div className="playground-toolbar">
        <span>
          <ReceiptText size={17} /> A quick expense split
        </span>
        <span className="sample-label">PORTFOLIO RECREATION</span>
      </div>
      <div className="demo-control-grid">
        <div>
          <label htmlFor="expense-total">Shared expense</label>
          <div className="money-input">
            <span>$</span>
            <input
              id="expense-total"
              inputMode="decimal"
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              maxLength={8}
              aria-describedby="expense-demo-note"
            />
          </div>
        </div>
        <div>
          <label htmlFor="expense-people">People in the group</label>
          <input
            id="expense-people"
            type="range"
            min="2"
            max="8"
            value={people}
            onChange={(event) => setPeople(Number(event.target.value))}
          />
          <strong className="range-value">{people} people</strong>
        </div>
        <div className="demo-result-card" aria-live="polite">
          <span className="eyebrow">EQUAL SHARE</span>
          <strong>{"$" + share.toFixed(2)}</strong>
          <p>per person</p>
        </div>
      </div>
      <p className="demo-note" id="expense-demo-note">
        Interactive explainer built for this portfolio. The résumé documents
        SplitSmart’s multi-user expense splitting and analytics; this calculator
        is a small recreation of that product idea.
      </p>
    </div>
  );
}

const sportsSteps = [
  {
    label: "Ask the agent",
    detail: "A user begins with a baseball question in the Streamlit experience.",
  },
  {
    label: "Gather context",
    detail:
      "The ADK agent uses MCP integrations to combine real-time MLB API data with information served from BigQuery.",
  },
  {
    label: "Estimate the outcome",
    detail:
      "A BQML win-probability model contributes a game outcome prediction to the analysis.",
  },
  {
    label: "Explain the result",
    detail:
      "Gemini helps the agent present the prediction with detailed performance analysis.",
  },
];

function SportsAgentDemo() {
  const [step, setStep] = useState(0);
  return (
    <div className="playground evidence-playground">
      <div className="playground-toolbar">
        <span>
          <Bot size={17} /> Follow one question through the agent
        </span>
        <span className="sample-label">INTERACTIVE EXPLAINER</span>
      </div>
      <div className="pipeline-explorer">
        <div className="pipeline-steps" aria-label="Sports agent pipeline">
          {sportsSteps.map((item, index) => (
            <button
              key={item.label}
              aria-pressed={step === index}
              className={step === index ? "active" : ""}
              onClick={() => setStep(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="pipeline-detail" aria-live="polite">
          <span className="eyebrow">STEP {step + 1} / 4</span>
          <h3>{sportsSteps[step].label}</h3>
          <p>{sportsSteps[step].detail}</p>
        </div>
      </div>
      <p className="demo-note">
        Architecture explainer based on the résumé. It does not call the
        original agent, MLB APIs, Gemini, or the BQML model.
      </p>
    </div>
  );
}

const optimizationNotes = [
  {
    label: "Connection pooling",
    detail: "Reuse JDBC database connections instead of opening one per request.",
  },
  {
    label: "Batch inserts",
    detail: "Group writes during XML ingestion to reduce database round trips.",
  },
  {
    label: "In-memory caching",
    detail: "Avoid unnecessary lookups while parsing and inserting records.",
  },
];

function FabflixDemo() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="playground evidence-playground">
      <div className="playground-toolbar">
        <span>
          <Server size={17} /> Inspect the optimization work
        </span>
        <span className="sample-label">RÉSUMÉ EVIDENCE</span>
      </div>
      <div className="optimization-explorer">
        <div>
          {optimizationNotes.map((item, index) => (
            <button
              key={item.label}
              aria-pressed={selected === index}
              className={selected === index ? "active" : ""}
              onClick={() => setSelected(index)}
            >
              <Check size={14} /> {item.label}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          <span className="eyebrow">WHAT CHANGED</span>
          <h3>{optimizationNotes[selected].label}</h3>
          <p>{optimizationNotes[selected].detail}</p>
          <strong className="performance-callout">40% faster</strong>
          <p>
            The résumé reports a 40% improvement in XML parsing and insert speed
            after the database and ingestion optimizations.
          </p>
        </div>
      </div>
      <p className="demo-note">
        Interactive explanation of documented work. It does not run the original
        Java application or reproduce its benchmark.
      </p>
    </div>
  );
}

function ProjectDemo({ id }: { id: ProjectId }) {
  if (id === "splitsmart") return <SplitSmartDemo />;
  if (id === "sports-analytics-agent") return <SportsAgentDemo />;
  return <FabflixDemo />;
}

export default function ProjectPage() {
  const { id } = useParams();
  const project = findProject(id);
  const [section, setSection] = useState("The challenge");
  const [node, setNode] = useState(0);
  if (!project)
    return (
      <section className="not-found page-width">
        <h1>Project not found.</h1>
        <Link className="button button-dark" to="/#work">
          Explore the projects <ArrowRight size={16} />
        </Link>
      </section>
    );

  const sections = {
    "The challenge": project.problem,
    "The implementation": project.approach,
    "The result": project.tradeoff,
    "Engineering scope": project.next,
  };
  const system = projectSystems[project.id];

  return (
    <div className="project-page page-width">
      <Link className="back-link" to="/#work">
        <ArrowLeft size={15} /> Back to the projects
      </Link>
      <div className="project-detail-header">
        <div>
          <span className="eyebrow">
            PROJECT {project.number} / {project.category.toUpperCase()}
          </span>
          <h1>
            {project.name}
            <span>.</span>
          </h1>
          <p>{project.tagline}</p>
        </div>
        <div className="project-detail-actions">
          {project.liveUrl && (
            <a className="button button-dark" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} live demo (opens in a new tab)`}>
              Live demo <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          <Link className="button button-outline" to={`/chat?project=${project.id}`}>
            <Sparkles size={16} /> Ask about this project
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <div className="sample-notice resume-evidence-notice">
        <span className="mini-orange-dot" />
        <strong>Résumé project</strong>
        <span>
          Project facts and results on this page come from Daniel’s résumé. The
          hands-on section is an explainer created for this portfolio.
        </span>
      </div>
      <div className="case-study-intro">
        <ProjectArtwork id={project.id} />
        <div>
          <span className="eyebrow">{project.date.toUpperCase()}</span>
          <h2>{project.description}</h2>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p>
            Explore the documented decisions and result, then use the interactive
            section to unpack one part of the project.
          </p>
          <a className="text-link" href="#playground">
            Open the interactive explainer <ArrowRight size={16} />
          </a>
        </div>
      </div>
      <section className="case-notes">
        <div className="case-tabs" aria-label="Explore the case study">
          {Object.keys(sections).map((title) => (
            <button
              key={title}
              aria-pressed={section === title}
              className={section === title ? "active" : ""}
              onClick={() => setSection(title)}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="case-notes-content" aria-live="polite">
          <span className="eyebrow">FROM THE RÉSUMÉ</span>
          <h2>{section}</h2>
          <p>{sections[section as keyof typeof sections]}</p>
        </div>
      </section>
      <section id="playground" className="playground-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A HANDS-ON EXPLANATION</span>
            <h2>See how one piece works.</h2>
          </div>
          <span className="playground-live">
            <span className="availability-dot" /> INTERACTIVE
          </span>
        </div>
        <ProjectDemo id={project.id} />
      </section>
      <section className="architecture-section">
        <span className="eyebrow">CONNECTING THE DOTS</span>
        <h2>The documented system, unpacked.</h2>
        <p>Select a piece to see how the technologies fit together.</p>
        <div className="architecture-nodes">
          {system.map((item, index) => (
            <div key={item.title}>
              <button
                aria-pressed={node === index}
                className={node === index ? "active" : ""}
                onClick={() => setNode(index)}
              >
                <item.icon size={22} />
                <span>{item.title}</span>
                {node === index && <Check size={14} />}
              </button>
              {index < 2 && <ArrowRight className="architecture-arrow" size={22} />}
            </div>
          ))}
        </div>
        <p className="architecture-description" aria-live="polite">
          {system[node].text}
        </p>
      </section>
      <div className="project-bottom-nav">
        <Link className="text-link" to="/#work">
          <ArrowLeft size={15} /> All projects
        </Link>
        <Link className="text-link" to={`/chat?project=${project.id}`}>
          Keep the conversation going <Sparkles size={16} />
        </Link>
      </div>
    </div>
  );
}
