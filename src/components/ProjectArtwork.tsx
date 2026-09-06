import {
  ArrowUpRight,
  Check,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import type { ProjectId } from "../data/projects";

export default function ProjectArtwork({ id }: { id: ProjectId }) {
  if (id === "splitsmart")
    return (
      <div className="project-art art-splitsmart" aria-hidden="true">
        <div className="mini-board">
          <div className="mini-app-header">
            <span>
              <span className="task-symbol">s</span> splitsmart
              <span className="mini-slash">/</span>
              <span className="mini-muted">Group</span>
            </span>
            <MoreHorizontal size={14} />
          </div>
          <div className="mini-board-title">
            Expenses at a glance.
            <span>
              Group view <span>⌄</span>
            </span>
          </div>
          <div className="mini-columns">
            {["Owed", "Settling", "Settled"].map((title, i) => (
              <div key={title}>
                <div className="mini-column-heading">
                  <span className={`board-dot board-dot-${i}`} />
                  {title}
                  <span>{i === 0 ? "2" : "1"}</span>
                  <Plus size={10} />
                </div>
                {(i === 0
                  ? ["Dinner · $84", "Utilities · $120"]
                  : i === 1
                    ? ["Trip · $245"]
                    : ["Groceries · $62"]
                ).map((task, j) => (
                  <div className="mini-task" key={task}>
                    <span className={`mini-tag tag-${i}`}>
                      {i === 0
                        ? "Expense"
                        : i === 1
                          ? "Balance"
                          : "Settled"}
                    </span>
                    <p>{task}</p>
                    <div>
                      <span className="mini-lines">≡</span>
                      <span className={`mini-avatar avatar-${j}`}>d</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <span className="art-sticker">
          shared spending, clearly <span>↗</span>
        </span>
      </div>
    );
  if (id === "sports-analytics-agent")
    return (
      <div className="project-art art-sports-agent" aria-hidden="true">
        <div className="mini-document">
          <div>
            <FileText size={16} />
            <span>mlb-agent.py</span>
            <MoreHorizontal size={13} />
          </div>
          <h4>
            Baseball questions.
            <br />
            Connected data.
          </h4>
          <i />
          <i />
          <i className="short-line" />
          <div className="highlighted-lines">
            <i />
            <i />
          </div>
          <i />
          <i className="short-line" />
        </div>
        <div className="mini-answer">
          <span className="answer-mark">
            <Sparkles size={14} />
          </span>
          <p>
            Gemini meets
            <br />
            <strong>MLB data in BigQuery.</strong>
          </p>
          <span className="source-pill">
            <FileText size={10} /> BQML prediction <ArrowUpRight size={10} />
          </span>
        </div>
        <div className="mini-search">
          <Search size={13} />
          <span>Ask about the matchup…</span>
          <span>↵</span>
        </div>
      </div>
    );
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
