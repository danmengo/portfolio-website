import { useRef, useState } from "react";
import { ArrowUpRight, Braces, Database, Sparkles } from "lucide-react";

const layers = [
  {
    name: "Interface",
    label: "01 / THE EXPERIENCE",
    description: "A thoughtful interface makes a complex idea feel simple.",
    icon: Braces,
  },
  {
    name: "Intelligence",
    label: "02 / THE POSSIBILITY",
    description:
      "A little curiosity. A useful question. Room to explore what AI can do.",
    icon: Sparkles,
  },
  {
    name: "Foundation",
    label: "03 / THE SYSTEM",
    description:
      "Good software starts with clear connections and dependable foundations.",
    icon: Database,
  },
];

export default function StackDiagram() {
  const [active, setActive] = useState(1);
  const controls = useRef<(HTMLButtonElement | null)[]>([]);
  const current = layers[active];
  return (
    <div className="stack-visual">
      <div className="visual-topline">
        <span>
          <span className="status-dot" /> EXPLORING THE POSSIBILITIES
        </span>
        <span>FIG. 001</span>
      </div>
      <div className="stack-stage">
        <div className="stage-axis axis-x" />
        <div className="stage-axis axis-y" />
        <div className="stage-orbit orbit-one" />
        <div className="stage-orbit orbit-two" />
        <div
          className="stack-planes"
          aria-label="Explore the layers of a software system"
        >
          {layers.map((layer, index) => (
            <button
              type="button"
              key={layer.name}
              className={`stack-plane plane-${index} ${active === index ? "plane-active" : ""}`}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              aria-label={`Explore ${layer.name.toLowerCase()}`}
            >
              <span className="plane-grid" />
              <span className="plane-cross cross-one">+</span>
              <span className="plane-cross cross-two">+</span>
              <span className="plane-core">
                <layer.icon size={30} strokeWidth={1.3} />
              </span>
              <span className="plane-index">0{index + 1}</span>
            </button>
          ))}
        </div>
        <span className="coordinate coordinate-top">x: curiosity</span>
        <span className="coordinate coordinate-bottom">y: possibility</span>
        <div className="floating-label label-interface">
          <Braces size={15} /> human-friendly
        </div>
        <div className="floating-label label-built">
          <span className="mini-orange-dot" /> built to connect
        </div>
      </div>
      <div className="visual-caption" aria-live="polite">
        <div key={active} className="layer-caption-copy">
          <span className="eyebrow">{current.label}</span>
          <p>{current.description}</p>
        </div>
        <ArrowUpRight size={23} />
      </div>
      <div className="layer-selector" role="group" aria-label="Select a software layer">
        {layers.map((layer, index) => (
          <button
            type="button"
            ref={(element) => { controls.current[index] = element; }}
            key={layer.name}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next = event.key === "ArrowRight" ? (index + 1) % layers.length
                : event.key === "ArrowLeft" ? (index + layers.length - 1) % layers.length
                : event.key === "Home" ? 0 : event.key === "End" ? layers.length - 1 : undefined;
              if (next === undefined) return;
              event.preventDefault();
              setActive(next);
              controls.current[next]?.focus();
            }}
            aria-pressed={active === index}
            className={active === index ? "selected" : ""}
          >
            <span>0{index + 1}</span>
            {layer.name}
          </button>
        ))}
      </div>
    </div>
  );
}
