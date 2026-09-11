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
    <div className="chat-page">
      <div className="chat-page-heading">
        <div className="chat-eyebrow">
          <span /> A DIFFERENT WAY TO EXPLORE
        </div>
        <h1>
          A portfolio.
          <br className="chat-mobile-break" /> A conversation.
        </h1>
        <p>Curious about the work? Start with a question.</p>
      </div>

      <div className="chat-layout">
        <aside className="chat-profile" aria-label="About this conversation">
          <div className="chat-profile-visual" aria-hidden="true">
            <div className="chat-orbit chat-orbit-one" />
            <div className="chat-orbit chat-orbit-two" />
            <div className="chat-profile-monogram">
              dm<span>✳</span>
            </div>
            <div className="chat-orbit-point" />
          </div>
          <div className="chat-profile-name">
            Daniel Meng<span className="chat-profile-tag">AI GUIDE</span>
          </div>
          <p className="chat-profile-description">
            Full-stack curiosity.
            <br /> An interest in AI.
            <br /> A lot to build.
          </p>
          <div className="chat-profile-rule" />
          <h2>A little context</h2>
          <p className="chat-profile-note">
            I'm exploring entry-level SWE roles in full-stack development and
            AI/ML. This is a new way to get to know the portfolio.
          </p>
          <Link className="chat-profile-link" to="/#work">
            <Code2 size={16} /> Browse projects{" "}
            <ArrowUpRight size={15} />
          </Link>
          <a
            className="chat-profile-link"
            href="https://github.com/danmengo"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} /> Find me on GitHub <ArrowUpRight size={15} />
          </a>
          <div className="chat-preview-note">
            <Sparkles size={16} />
            <p>
              <strong>A work in progress.</strong> These are curated replies
              based on verified résumé and project details. A live AI guide
              comes later.
            </p>
          </div>
        </aside>

        <section
          className="chat-window"
          aria-label="Portfolio AI conversation"
        >
          <header className="chat-window-header">
            <div>
              <span className="chat-window-icon">
                <MessageCircle size={18} />
              </span>
              <div>
                <h2>Ask my AI</h2>
                <p>
                  <span /> AI · answers with sources
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
                  message.role === "user" ? "Your question" : "AI guide response"
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
                        Daniel's guide <span>{message.id === 0 ? "WELCOME" : "AI"}</span>
                      </>
                    ) : (
                      "You"
                    )}
                  </div>
                  {message.text && <p>{message.text}</p>}
                  {message.reply?.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {Boolean(message.reply?.sources.length) && (
                    <div
                      className="chat-sources"
                      aria-label="Related portfolio pages"
                    >
                      {message.reply?.sources.map((source) =>
                        !source.href.startsWith("/") ? (
                          <a
                            className="chat-source"
                            key={source.href}
                            href={source.href}
                            {...(source.href.startsWith("http")
                              ? { target: "_blank", rel: "noreferrer" }
                              : {})}
                          >
                            <span>
                              <strong>{source.label}</strong>
                              <small>{source.detail}</small>
                            </span>
                            <ArrowUpRight size={16} />
                          </a>
                        ) : (
                          <Link
                            className="chat-source"
                            key={source.href}
                            to={source.href}
                          >
                            <span>
                              <strong>{source.label}</strong>
                              <small>{source.detail}</small>
                            </span>
                            <ArrowUpRight size={16} />
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {error && <p className="chat-error" role="alert">{error}</p>}
            {pending && (
              <div className="chat-thinking" role="status">
                <span />
                <span />
                <span />
                <span className="chat-sr-only">Searching the portfolio and preparing an answer</span>
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
                rows={2}
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
