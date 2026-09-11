import { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { ArrowUpRight, Github, Menu, Sparkles, X } from "lucide-react";
import HomePage from "./components/HomePage";
import ProjectPage from "./components/ProjectPage";
import ChatPage from "./components/ChatPage";
import ResumePage from "./components/ResumePage";
import ThemeToggle from "./components/ThemeToggle";

function NavigationEffects() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "full-stack & AI/ML engineer",
      "/chat": "meet my AI · portfolio guide",
      "/resume": "résumé",
      "/projects/splitsmart": "SplitSmart · full-stack project",
      "/projects/sports-analytics-agent": "Sports Analytics Agent · AI/ML project",
      "/projects/fabflix": "Fabflix · full-stack project",
    };
    document.title = `Daniel Meng — ${titles[pathname] ?? "page not found"}`;
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
        }
      } else {
        window.scrollTo(0, 0);
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className="site-header">
      <div className="header-inner page-width">
        <Link
          className="brand"
          to="/"
          aria-label="Daniel Meng home"
          onClick={() => setOpen(false)}
        >
          <span className="brand-mark">
            d<span>/</span>m
          </span>
          <span>
            Daniel Meng<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="header-controls">
          <nav
            id="site-navigation"
            className={open ? "navigation nav-open" : "navigation"}
            aria-label="Main navigation"
          >
            <Link
              to="/#work"
              className={pathname.startsWith("/projects") ? "nav-active" : ""}
              onClick={() => setOpen(false)}
            >
              Work
            </Link>
            <Link to="/#about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/#experience" onClick={() => setOpen(false)}>
              Experience
            </Link>
            <Link
              to="/resume"
              className={
                pathname === "/resume" ? "nav-active resume-nav" : "resume-nav"
              }
              onClick={() => setOpen(false)}
            >
              Résumé <ArrowUpRight size={13} />
            </Link>
            <Link
              to="/chat"
              className={`nav-ai ${pathname === "/chat" ? "nav-ai-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <Sparkles size={15} /> Ask my AI <span className="nav-ai-dot" />
            </Link>
          </nav>
          <ThemeToggle />
          <button
            className="mobile-menu-button"
            aria-expanded={open}
            aria-controls="site-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

function ChatRoute() {
  const [params] = useSearchParams();
  const project = params.get("project") ?? undefined;
  return <ChatPage key={project ?? "general"} initialProject={project} />;
}

function NotFound() {
  return (
    <section className="not-found page-width">
      <span className="eyebrow">404 / A SMALL DETOUR</span>
      <h1>
        This idea hasn’t
        <br />
        been built yet.
      </h1>
      <p>
        The page you’re looking for isn’t here. There’s more to explore back at
        the studio.
      </p>
      <Link className="button button-dark" to="/">
        Back to the portfolio <ArrowUpRight size={17} />
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <NavigationEffects />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/chat" element={<ChatRoute />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer page-width">
        <Link to="/" className="footer-brand">
          Daniel Meng<span>.</span>
        </Link>
        <span>A little curiosity. A lot of possibility.</span>
        <div>
          <span className="footer-edition">PORTFOLIO / 2026</span>
          <a
            href="https://github.com/danmengo"
            target="_blank"
            rel="noreferrer"
            aria-label="Daniel Meng on GitHub"
          >
            <Github size={17} />
          </a>
        </div>
      </footer>
    </>
  );
}
