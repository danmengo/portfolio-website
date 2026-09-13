import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MessageSquare,
  Sparkles,
  Terminal,
} from "lucide-react";
import { projects } from "../data/projects";
import ProjectArtwork from "./ProjectArtwork";
import StackDiagram from "./StackDiagram";
import { ProjectTemplateCard } from "./ProjectTemplate";

const filters = [
  "All work",
  "Full stack",
  "AI / ML",
] as const;

export default function HomePage() {
  const [filter, setFilter] = useState<string>("All work");
  const visible = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  );
  return (
    <>
      <section className="hero page-width" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="availability-dot" /> DANIEL MENG · SOFTWARE ENGINEER
          </div>
          <h1 id="hero-title">
            A curious mind.
            <br />A builder
            <br />
            at{" "}
            <span className="heart-word">
              heart
              <svg
                viewBox="0 0 280 17"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M4 11Q131 1 273 7M25 16Q160 5 264 11" />
              </svg>
            </span>
            <span className="orange-period">.</span>
          </h1>
          <p className="hero-description">
            I build full-stack products, data systems, and applied AI projects—
            from shared-expense analytics to agentic sports analysis.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#work">
              Explore my work <ArrowDown size={16} />
            </a>
            <Link className="text-link" to="/chat">
              <Sparkles size={17} /> Meet mengoAI <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="hero-footnote">
            <span className="tiny-line" /> FULL-STACK DEVELOPMENT{" "}
            <span className="footnote-plus">+</span> INTELLIGENT SYSTEMS
          </div>
        </div>
        <StackDiagram />
      </section>

      <div className="ticker-strip">
        <div className="page-width ticker-content">
          <span>GOOD SOFTWARE STARTS WITH A LITTLE CURIOSITY</span>
          <span>
            <Braces size={17} /> Build thoughtfully
          </span>
          <span>
            <Layers3 size={17} /> Connect the pieces
          </span>
          <span>
            <Sparkles size={17} /> Keep exploring
          </span>
        </div>
      </div>

      <section
        id="work"
        className="work-section page-width"
        aria-labelledby="work-heading"
      >
        <div className="section-topline">
          <span className="eyebrow">
            <span className="section-index">01 /</span> THE PROJECTS
          </span>
          <span className="edition-label">SELECTED WORK · 2025—2026</span>
        </div>
        <div className="section-heading">
          <div>
            <h2 id="work-heading">Ideas you can click on.</h2>
            <p>Projects spanning product engineering, AI, and data systems.</p>
          </div>
          <a
            className="text-link github-text"
            href="https://github.com/danmengo"
            target="_blank"
            rel="noreferrer"
          >
            Explore GitHub <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="work-filters" aria-label="Filter projects">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
              {item === "All work" && <span>{String(projects.length + 1).padStart(2, "0")}</span>}
            </button>
          ))}
        </div>
        <div className="project-grid" aria-live="polite">
          {visible.map((project) => (
            <article className="project-card" key={project.id}>
              <Link
                className="project-art-link"
                to={`/projects/${project.id}`}
                aria-label={`Explore ${project.name} project`}
              >
                <ProjectArtwork id={project.id} />
                <span className="art-open">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
              <div className="project-meta">
                <span className="eyebrow">{project.category}</span>
                <span className="sample-label">{project.date}</span>
              </div>
              <Link className="project-title" to={`/projects/${project.id}`}>
                <h3>{project.name}</h3>
                <span>↗</span>
              </Link>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
          {filter === "All work" && <ProjectTemplateCard />}
        </div>
      </section>

      <section className="ai-section page-width" aria-labelledby="ai-heading">
        <div className="ai-invitation">
          <div className="ai-invitation-copy">
            <span className="eyebrow">
              <span className="orange-spark">✳</span> ANOTHER WAY TO GET TO KNOW
              ME
            </span>
            <h2 id="ai-heading">
              A portfolio that
              <br />
              talks back.
            </h2>
            <p>
              Curious about a project or the thinking behind it?
              <br className="desktop-only" /> Meet the conversational side of
              this portfolio.
            </p>
            <Link className="button button-dark" to="/chat">
              Ask mengoAI <ArrowUpRight size={17} />
            </Link>
            <span className="preview-caption">
              AI answers grounded in résumé and project notes
            </span>
          </div>
          <div className="home-chat-preview">
            <div className="chat-preview-top">
              <div className="dm-avatar">
                d<span>✦</span>
              </div>
              <div>
                <strong>mengoAI</strong>
                <span>A little context goes a long way.</span>
              </div>
              <span className="preview-pill">PREVIEW</span>
            </div>
            <div className="preview-user-bubble">
              What are you curious about building?
            </div>
            <div className="preview-ai-bubble">
              <Sparkles size={17} />
              <p>
                Useful things that connect the dots—an intuitive interface, a
                thoughtful system, and a little intelligence.
                <br />
                <br />
                Want to explore one of Daniel’s projects?
              </p>
            </div>
            <div className="preview-questions">
              <Link to="/chat?project=splitsmart">
                Show me SplitSmart <ArrowUpRight size={12} />
              </Link>
              <Link to="/chat?project=sports-analytics-agent">
                Let’s talk about the AI agent <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="about-section page-width"
        aria-labelledby="about-heading"
      >
        <div className="about-intro">
          <span className="eyebrow">
            <span className="section-index">02 /</span> THE PERSON BEHIND THE
            CODE
          </span>
          <h2 id="about-heading">
            Always a student.
            <br />
            Always a builder.
          </h2>
          <p>
            I’m Daniel Meng, a UC Irvine graduate in Computer Science and
            Business Information Management with a specialization in Intelligent
            Systems. I’m pursuing entry-level opportunities across full-stack
            engineering and AI/ML.
          </p>
          <Link className="text-link" to="/resume">
            A little more about my journey <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="about-notes">
          <div>
            <span className="note-number">01</span>
            <div>
              <h3>
                <Braces size={18} /> From interface to infrastructure
              </h3>
              <p>
                SplitSmart and Fabflix span user-facing applications, relational
                data, cloud deployment, and scalable backend systems.
              </p>
            </div>
          </div>
          <div>
            <span className="note-number">02</span>
            <div>
              <h3>
                <Sparkles size={18} /> Agents grounded in data
              </h3>
              <p>
                The Sports Analytics Agent connects Gemini, MCP, MLB data, and a
                BigQuery ML win-probability model.
              </p>
            </div>
          </div>
          <div>
            <span className="note-number">03</span>
            <div>
              <h3>
                <Terminal size={18} /> Learning by teaching
              </h3>
              <p>
                At American Young Coder Academy, I taught four weekly Python and
                object-oriented programming classes and helped improve student
                test scores by 27%.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="experience-section page-width">
        <div className="section-topline">
          <span className="eyebrow">
            <span className="section-index">03 /</span> THE JOURNEY
          </span>
          <span className="sample-label">EDUCATION + EXPERIENCE</span>
        </div>
        <div className="experience-row">
          <div>
            <h2>Code, taught and built.</h2>
            <p>
              Coding Instructor · American Young Coder Academy · May 2024—Mar 2026
              <br />
              UC Irvine · B.S. Computer Science &amp; Business Information Management ·
              Sep 2022—Jun 2026 · GPA 3.535
            </p>
          </div>
          <Link className="button button-outline" to="/resume">
            View full résumé <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section id="contact" className="contact-section page-width">
        <span className="eyebrow">
          <span className="availability-dot" /> LET’S CONNECT
        </span>
        <div>
          <h2>
            Something in mind?
            <br />
            <span>Let’s start a conversation.</span>
          </h2>
          <a
            href="mailto:danielmeng530@gmail.com"
            className="contact-arrow"
            aria-label="Email Daniel Meng"
          >
            <ArrowUpRight size={39} />
          </a>
        </div>
        <div className="contact-bottom">
          <p>Open to entry-level full-stack and AI/ML opportunities.</p>
          <a className="text-link" href="mailto:danielmeng530@gmail.com">
            <Mail size={16} /> Email <ArrowUpRight size={14} />
          </a>
          <a
            className="text-link"
            href="https://github.com/danmengo"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} /> GitHub <ArrowUpRight size={14} />
          </a>
          <a
            className="text-link"
            href="https://www.linkedin.com/in/danielmengo/"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} />
          </a>
          <Link className="text-link" to="/chat">
            <MessageSquare size={16} /> Ask mengoAI{" "}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
