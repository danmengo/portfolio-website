import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  ArrowUpRight,
  Code2,
  Github,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  resolveProject,
  type ChatProject,
  type ChatReply,
} from "../lib/chat";
import { getLiveWelcome, requestReply } from "../lib/live-chat";
import "./chat.css";

interface ChatMessage {
  id: number;
  role: "assistant" | "user";
  text?: string;
  reply?: ChatReply;
}

const maxLength = 500;

export default function ChatPage({
  initialProject,
}: {
  initialProject?: string;
}) {
  const firstProject = resolveProject(initialProject);
  return (
    <Conversation key={firstProject ?? "general"} firstProject={firstProject} />
  );
}

function Conversation({ firstProject }: { firstProject?: ChatProject }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", reply: getLiveWelcome(firstProject) },
  ]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [project, setProject] = useState<ChatProject | undefined>(firstProject);
  const nextId = useRef(1);
  const sending = useRef(false);
  const activeRequest = useRef<AbortController | undefined>(undefined);
  const [error, setError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const conversation = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const lastReply = [...messages]
    .reverse()
    .find((message) => message.reply)?.reply;

  useEffect(() => {
    return () => {
      activeRequest.current?.abort();
      activeRequest.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (conversation.current)
      conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [messages, pending, error]);

  async function send(value: string) {
    const question = value.trim().slice(0, maxLength);
    if (!question || sending.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    sending.current = true;
    setPending(true);
    setError("");
    setDraft("");
    setMessages((current) => [...current, { id: nextId.current++, role: "user", text: question }]);
    const deadline = setTimeout(() => controller.abort(), 35000);
    try {
      const reply = await requestReply(question, project, controller.signal);
      if (activeRequest.current !== controller) return;
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", reply }]);
      setProject(reply.project);
    } catch (cause) {
      if (activeRequest.current !== controller) return;
      setError(controller.signal.aborted ? "The answer took too long. Please try again." : cause instanceof Error ? cause.message : "Unable to connect. Please try again.");
      setDraft((current) => current || question);
    } finally {
      clearTimeout(deadline);
      if (activeRequest.current === controller) {
        activeRequest.current = undefined;
        sending.current = false;
        setPending(false);
        input.current?.focus({ preventScroll: true });
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      send(draft);
    }
  }

  function reset() {
    activeRequest.current?.abort();
    activeRequest.current = undefined;
    setError("");
    sending.current = false;
    setPending(false);
    setDraft("");
    setProject(firstProject);
    setMessages([
      {
        id: nextId.current++,
        role: "assistant",
        reply: getLiveWelcome(firstProject),
      },
    ]);
    input.current?.focus({ preventScroll: true });
  }

  return (
    <div className="chat-page" onKeyDown={(event) => {
      if (event.key === "Escape" && profileOpen) {
        setProfileOpen(false);
        document.querySelector<HTMLButtonElement>(".chat-panel-toggle")?.focus();
      }
    }}>
      <div className={`chat-layout${profileOpen ? " chat-layout-expanded" : ""}`}>
        {profileOpen && <button className="chat-panel-dismiss" type="button" aria-label="Close profile panel" onClick={() => setProfileOpen(false)} />}
        <div className="chat-profile-shell" inert={!profileOpen} aria-hidden={!profileOpen}>
        <aside id="chat-profile-panel" className="chat-profile" aria-label="About Daniel">
          <div className="chat-panel-identity">
            <span className="chat-panel-avatar" aria-hidden="true">dm</span>
            <div><h2>Daniel Meng</h2><p>Software engineer</p></div>
          </div>
          <p className="chat-panel-intro">Full-stack curiosity. An interest in AI. A lot to build.</p>
          <nav className="chat-panel-links" aria-label="Explore Daniel's portfolio">
            <Link to="/#work"><Code2 size={18} /> Browse projects <ArrowUpRight size={15} /></Link>
            <a href="https://github.com/danmengo" target="_blank" rel="noreferrer"><Github size={18} /> GitHub <ArrowUpRight size={15} /></a>
          </nav>
        </aside>
        </div>

        <section
          className="chat-window"
          aria-label="mengoAI conversation"
        >
          <header className="chat-window-header">
            <div>
              <button
                className="chat-panel-toggle"
                type="button"
                aria-expanded={profileOpen}
                aria-controls="chat-profile-panel"
                aria-label={profileOpen ? "Collapse profile panel" : "Expand profile panel"}
                title={profileOpen ? "Collapse profile panel" : "About Daniel"}
                onClick={() => setProfileOpen((open) => !open)}
              >
                {profileOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
              <span className="chat-window-icon">
                <MessageCircle size={18} />
              </span>
              <div>
                <h1>mengoAI</h1>
                <p>
                  <span /> Your portfolio companion
                </p>
              </div>
            </div>
            <button
              className="chat-reset"
              onClick={reset}
              type="button"
              aria-label="Start a new conversation"
              title="Start a new conversation"
            >
              <RotateCcw size={16} />
              <span>New chat</span>
            </button>
          </header>

          <div
            ref={conversation}
            className="chat-messages"
            role="log"
            aria-label="Conversation messages"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="chat-conversation-label">
              A SMALL INTRODUCTION, A FEW GOOD QUESTIONS.
            </div>
            {messages.map((message) => (
              <article
                className={`chat-message chat-message-${message.role}`}
                key={message.id}
                aria-label={
                  message.role === "user" ? "Your question" : "mengoAI response"
                }
              >
                {message.role === "assistant" && (
                  <div className="chat-message-avatar" aria-hidden="true">
                    ✳
                  </div>
                )}
                <div className="chat-message-content">
                  <div className="chat-message-author">
                    {message.role === "assistant" ? (
                      <>
                        mengoAI <span>{message.id === 0 ? "WELCOME" : "AI"}</span>
                      </>
                    ) : (
                      "You"
                    )}
                  </div>
                  {message.text && <p>{message.text}</p>}
                  {message.reply?.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                </div>
              </article>
            ))}
            {error && <p className="chat-error" role="alert">{error}</p>}
            {pending && (
              <div className="mengo-loading" role="status" aria-label="mengoAI is preparing an answer">
                <span className="mengo-loading-icon" aria-hidden="true"><Sparkles size={20} /></span>
                <div aria-hidden="true">
                  <span className="mengo-loading-label">Thinking<span className="mengo-loading-dots"><i /><i /><i /></span></span>
                  <span className="mengo-loading-line" />
                  <span className="mengo-loading-line mengo-loading-line-short" />
                </div>
              </div>
            )}
          </div>

          <div className="chat-composer-area">
            <div className="chat-suggestions" aria-label="Suggested questions">
              {lastReply?.suggestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => send(question)}
                  disabled={pending}
                >
                  {question}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="chat-composer">
              <label htmlFor="chat-question" className="chat-sr-only">
                Ask about the portfolio
              </label>
              <textarea
                ref={input}
                id="chat-question"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask me about a project, an idea, what's next…"
                maxLength={maxLength}
                rows={1}
                aria-describedby="chat-input-help"
              />
              <div className="chat-composer-bottom">
                <span id="chat-input-help">
                  {draft.length > 400
                    ? `${draft.length}/${maxLength} characters`
                    : "Enter to send · Shift + Enter for a new line"}
                </span>
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!draft.trim() || pending}
                >
                  <ArrowUp size={20} />
                </button>
              </div>
            </form>
            <p className="chat-privacy">
              Questions and project context are processed by Cloudflare AI. Chat history stays in this tab.
            </p>
          </div>
        </section>
      </div>
      <p className="chat-page-footnote">
        Prefer the classic route?{" "}
        <Link to="/#work">
          Explore the projects <ArrowUpRight size={14} />
        </Link>
      </p>
    </div>
  );
}
