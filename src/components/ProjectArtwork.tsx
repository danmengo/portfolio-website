import { Check } from "lucide-react";
import { findProject, type ProjectId } from "../data/projects";

export default function ProjectArtwork({ id }: { id: ProjectId }) {
  if (id === "splitsmart" || id === "sports-analytics-agent" || id === "survey-sage" || id === "my-money") {
    const name = findProject(id)!.name;
    return (
      <div className="project-art project-site-preview">
        <div className="project-preview-bar" aria-hidden="true">
          <span className="project-preview-dots">● ● ●</span>
          <span>{name}</span>
          <span>{id === "survey-sage" ? "Capstone preview" : "Site preview"}</span>
        </div>
        <img src={`/previews/${id}.jpg`} alt={`${name} ${id === "survey-sage" ? "chat interface from the capstone report" : "deployed website screenshot"}`} width={id === "survey-sage" ? 2048 : 1440} height={id === "survey-sage" ? 1115 : 1000} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className="project-art art-fabflix" aria-hidden="true">
      <div className="sentiment-orbit" />
      <div className="sentiment-note note-a">
        “pooled <span>database</span> connections”
      </div>
      <div className="sentiment-face">
        <span className="face-eye" />
        <span className="face-eye" />
        <span className="face-smile" />
      </div>
      <div className="sentiment-note note-b">
        <span className="sentiment-check">
          <Check size={12} />
        </span>{" "}
        40% faster XML workflow <span className="note-stars">✦</span>
      </div>
      <div className="signal-bars">
        {[16, 26, 20, 42, 34, 55, 41, 63, 51, 72, 62, 80, 71, 88, 80].map(
          (h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ),
        )}
      </div>
      <span className="art-caption">POOL. CACHE. SCALE.</span>
    </div>
  );
}
