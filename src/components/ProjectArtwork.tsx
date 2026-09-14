import { Check } from "lucide-react";
import type { ProjectId } from "../data/projects";

export default function ProjectArtwork({ id }: { id: ProjectId }) {
  if (id === "splitsmart" || id === "sports-analytics-agent") {
    const name = id === "splitsmart" ? "SplitSmart" : "Sports Analytics Agent";
    return (
      <div className="project-art project-site-preview">
        <div className="project-preview-bar" aria-hidden="true">
          <span className="project-preview-dots">● ● ●</span>
          <span>{name}</span>
          <span>Site preview</span>
        </div>
        <img src={`/previews/${id}.jpg`} alt={`${name} deployed website screenshot`} width={1440} height={1000} loading="lazy" decoding="async" />
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
