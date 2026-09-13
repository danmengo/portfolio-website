import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { projectTemplate } from "../data/project-template";
import "./project-template.css";

export function ProjectTemplateCard() {
  return (
    <article className="project-card">
      <Link className="project-art-link" to="/projects/new-project" aria-label="Explore new project template">
        <div className="project-art template-art" aria-hidden="true">
          <Plus size={48} strokeWidth={1} />
          <span className="eyebrow">A little room for what comes next.</span>
        </div>
        <span className="art-open"><ArrowUpRight size={20} /></span>
      </Link>
      <div className="project-meta">
        <span className="eyebrow">Coming soon</span>
        <span className="sample-label">04</span>
      </div>
      <Link className="project-title" to="/projects/new-project">
        <h3>{projectTemplate.name}</h3><span>↗</span>
      </Link>
      <p>{projectTemplate.description || "A new project is taking shape. Details coming soon."}</p>
    </article>
  );
}

export default function ProjectTemplatePage() {
  const sections = [
    ["Overview", projectTemplate.description],
    ["Technologies", projectTemplate.technology],
    ["The challenge", projectTemplate.problem],
    ["The implementation", projectTemplate.implementation],
    ["The results", projectTemplate.results],
    ["What comes next", projectTemplate.next],
  ];

  return (
    <div className="project-page page-width">
      <Link className="back-link" to="/#work"><ArrowLeft size={15} /> Back to the projects</Link>
      <div className="project-detail-header">
        <div>
          <span className="eyebrow">Project 04 / Coming soon</span>
          <h1>{projectTemplate.name}<span>.</span></h1>
          <p>A space for the next idea.</p>
        </div>
      </div>
      <div className="template-sections">
        {sections.map(([title, content]) => (
          <section className="template-section" key={title}>
            <h2>{title}</h2>
            <p>{content || "Details coming soon."}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
