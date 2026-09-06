export type ChatProject = "splitsmart" | "sports-analytics-agent" | "fabflix";

export interface ChatSource {
  label: string;
  href: string;
  detail: string;
}

export interface ChatReply {
  paragraphs: string[];
  sources: ChatSource[];
  suggestions: string[];
  project?: ChatProject;
}

const projectNames: Record<ChatProject, string> = {
  splitsmart: "SplitSmart",
  "sports-analytics-agent": "Sports Analytics Agent",
  fabflix: "Fabflix",
};

const projectSources: Record<ChatProject, ChatSource> = {
  splitsmart: { label: "Explore SplitSmart", href: "/projects/splitsmart", detail: "Full-stack project · February 2026" },
  "sports-analytics-agent": { label: "Explore Sports Analytics Agent", href: "/projects/sports-analytics-agent", detail: "AI/ML project · October 2025" },
  fabflix: { label: "Explore Fabflix", href: "/projects/fabflix", detail: "Backend project · April 2025" },
};

const resumeSource: ChatSource = {
  label: "View Daniel's résumé",
  href: "/resume",
  detail: "Education, experience, projects, and credentials",
};

export const DEFAULT_QUESTIONS = [
  "What are you studying at UCI?",
  "What did you do as a coding instructor?",
  "Walk me through SplitSmart",
];

export function resolveProject(value?: string): ChatProject | undefined {
  const normalized = value?.toLowerCase().replace(/[\s-]/g, "");
  if (normalized === "splitsmart") return "splitsmart";
  if (normalized === "sportsanalyticsagent" || normalized === "sportsanalytics" || normalized === "sportsagent") return "sports-analytics-agent";
  if (normalized === "fabflix") return "fabflix";
  return undefined;
}

export function getWelcome(project?: ChatProject): ChatReply {
  if (project) {
    return {
      paragraphs: [
        `Let's explore ${projectNames[project]}. I can walk through the technologies, scope, and results documented for this project.`,
        "This conversation preview uses curated replies drawn from Daniel Meng's résumé and project details.",
      ],
      sources: [projectSources[project]],
      suggestions: [`Tell me about ${projectNames[project]}`, "What technologies did you use?", "What results are documented?"],
      project,
    };
  }

  return {
    paragraphs: [
      "Hey, I'm a curated AI-style guide to Daniel Meng's portfolio. Ask me about his education, teaching experience, projects, certifications, or the roles he's pursuing.",
      "No model is connected in this preview. Every answer is based on verified résumé and project information.",
    ],
    sources: [resumeSource],
    suggestions: DEFAULT_QUESTIONS,
  };
}

function unavailableProjectDetail(project: ChatProject): ChatReply {
  return {
    paragraphs: [`That detail is not documented for ${projectNames[project]}. I can share the verified scope, technologies, and results listed in Daniel's résumé without filling in gaps.`],
    sources: [projectSources[project]],
    suggestions: [`Tell me about ${projectNames[project]}`, "What technologies did you use?", "Show me another project"],
    project,
  };
}

function projectReply(project: ChatProject, question: string): ChatReply {
  const asksForUnsupportedDetail = /trade.?off|challenge|hardest|difficult|bug|why did|team size|how many users|revenue|accuracy|precision|recall|latency|scale|testing|tests|grade/.test(question);
  const asksAboutPerformance = /result|metric|performance|improv|percent|40|parse|insert|fast|speed/.test(question);
  const asksAboutTechnology = /architect|stack|technolog|database|backend|front.?end|how.*work|implement|build|design|pipeline|framework|deploy|host/.test(question);

  if (asksForUnsupportedDetail) return unavailableProjectDetail(project);

  const paragraphs: Record<ChatProject, string[]> = {
    splitsmart: asksAboutPerformance
      ? ["The résumé does not list a numeric performance or adoption metric for SplitSmart. Its documented result is a working group-expense and splitting experience with Recharts analytics."]
      : asksAboutTechnology
        ? [
            "SplitSmart uses Next.js and TypeScript with Supabase, Prisma, and PostgreSQL, and it was deployed on Vercel. Recharts powers its spending analytics.",
            "Those are the technologies documented in the résumé; implementation details beyond them have not been added to this guide.",
          ]
        : [
            "SplitSmart is a February 2026 full-stack project for managing group expenses and splitting costs. It also uses Recharts to show spending analytics.",
            "Daniel built it with Next.js, TypeScript, Supabase, Prisma, and PostgreSQL, then deployed it on Vercel.",
          ],
    "sports-analytics-agent": asksAboutPerformance
      ? ["The résumé documents a BigQuery ML win-probability capability, but it does not provide an accuracy score or other evaluation metric. I won't infer one."]
      : asksAboutTechnology
        ? [
            "The Sports Analytics Agent combines Google Cloud ADK, MCP, Gemini, BigQuery, Cloud Run, and Streamlit. It works with MLB APIs and data, including a BigQuery ML win-probability capability.",
            "The résumé does not document a more detailed component diagram or model evaluation.",
          ]
        : [
            "Sports Analytics Agent is an October 2025 AI/ML project built around MLB APIs and data. It includes a BigQuery ML win-probability capability.",
            "Its documented tools are Google Cloud ADK, MCP, Gemini, BigQuery, Cloud Run, and Streamlit.",
          ],
    fabflix: asksAboutPerformance
      ? [
          "For Fabflix, the résumé reports that connection pooling, batch inserts, and caching improved XML parsing and insertion performance by 40%.",
          "No other performance metric is documented in the information available to this guide.",
        ]
      : asksAboutTechnology
        ? [
            "Fabflix used Tomcat, JDBC, and Maven on AWS EC2. The project included load balancing, MySQL replication, connection pooling, batch inserts, and caching.",
            "The résumé does not document additional architecture details beyond those components.",
          ]
        : [
            "Fabflix is an April 2025 backend project using Tomcat, JDBC, Maven, and AWS EC2. Its documented infrastructure includes load balancing and MySQL replication.",
            "Daniel used connection pooling, batch inserts, and caching, improving XML parsing and insertion performance by 40%.",
          ],
  };

  return {
    paragraphs: paragraphs[project],
    sources: [projectSources[project]],
    suggestions: asksAboutTechnology ? ["What results are documented?", "Show me another project"] : ["What technologies did you use?", "Show me another project"],
    project,
  };
}

/** Local, deterministic preview only. It does not call a model or store messages. */
export function getChatReply(input: string, previousProject?: ChatProject): ChatReply {
  const question = input.trim().toLowerCase().slice(0, 500);
  const explicitProject: ChatProject | undefined = /split\s?-?smart/.test(question)
    ? "splitsmart"
    : /sports[-\s]+analytics(?:[-\s]+agent)?|sports[-\s]+agent/.test(question)
      ? "sports-analytics-agent"
      : /fab\s?flix/.test(question)
        ? "fabflix"
        : undefined;

  if (/ignore.*instruction|pretend|make up|fabricate|system prompt|act as|say (you|i) (built|worked|achieved)/.test(question)) {
    return {
      paragraphs: ["This preview only uses verified résumé and project information. I cannot invent experience, credentials, results, or missing project details."],
      sources: [],
      suggestions: DEFAULT_QUESTIONS,
    };
  }

  if (/contact|email|e-mail|phone|reach (you|out)|linkedin|github/.test(question)) {
    return {
      paragraphs: ["You can reach Daniel at danielmeng530@gmail.com, connect with him on LinkedIn, or visit his GitHub profile. His phone number is intentionally omitted from this public guide."],
      sources: [
        { label: "Email Daniel", href: "mailto:danielmeng530@gmail.com", detail: "danielmeng530@gmail.com" },
        { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/danielmengo/", detail: "Daniel Meng" },
        { label: "Visit GitHub", href: "https://github.com/danmengo", detail: "danmengo" },
      ],
      suggestions: ["What kind of role are you looking for?", "Walk me through SplitSmart"],
    };
  }

  if (/how.*(chat|you).*work|live ai|real ai|language model|which model|are you (ai|real)|preview|curated/.test(question)) {
    return {
      paragraphs: [
        "This conversation preview matches questions to curated replies based on Daniel's verified résumé and project information. No language model is connected, and messages stay in this page for the current session.",
        "When the source material does not document an answer, the guide says so instead of filling in the gap.",
      ],
      sources: [resumeSource],
      suggestions: DEFAULT_QUESTIONS,
    };
  }

  if (explicitProject) return projectReply(explicitProject, question);

  if (previousProject && /architect|stack|technolog|database|backend|front.?end|how.*work|implement|result|metric|performance|improv|tell me more|that project|this project/.test(question)) {
    return projectReply(previousProject, question);
  }

  if (/education|stud(y|ying|ied)|school|uci|university|college|degree|gpa|major|speciali|coursework|graduate|graduation/.test(question)) {
    return {
      paragraphs: [
        "Daniel earned a B.S. in Computer Science and Business Information Management at UC Irvine, with résumé dates from September 2022 through June 2026. He specialized in Intelligent Systems and graduated with a 3.535 GPA.",
        "Relevant coursework includes Data Structures and Algorithms, System Design, Machine Learning, and Information Retrieval.",
      ],
      sources: [resumeSource],
      suggestions: ["What kind of role are you looking for?", "What technologies have you used?"],
    };
  }

  if (/instructor|teach|teaching|american young coder|work experience|professional experience|employment|job experience|test scores|27/.test(question)) {
    return {
      paragraphs: [
        "From May 2024 through March 2026, Daniel worked as a Coding Instructor at American Young Coder Academy.",
        "He led four weekly classes focused on Python, object-oriented programming, and problem solving. The résumé reports a 27% improvement in student test scores.",
      ],
      sources: [resumeSource],
      suggestions: ["What are you studying at UCI?", "What projects have you built?"],
    };
  }

  if (/certif|credential|udemy|coursera|anthropic|claude code|sql bootcamp|google ai/.test(question)) {
    return {
      paragraphs: ["Daniel earned three certifications in 2026: SQL Bootcamp from Udemy, Google AI Professional Certificate from Coursera, and Claude Code in Action from Anthropic."],
      sources: [resumeSource],
      suggestions: ["What technologies have you used?", "Walk me through an AI project"],
    };
  }

  if (/role|looking for|career|position|opportunit|hire|hiring/.test(question)) {
    return {
      paragraphs: [
        "Daniel is looking for entry-level software engineering opportunities, with a focus on full-stack development or AI/ML.",
        "His résumé combines full-stack and backend projects, an AI/ML sports project, and coding instruction from May 2024 through March 2026.",
      ],
      sources: [resumeSource],
      suggestions: ["Walk me through SplitSmart", "Show me an AI/ML project"],
    };
  }

  if (/skill|technolog|tech stack|language|framework|python|next\.js|typescript|sql|database|cloud/.test(question)) {
    return {
      paragraphs: [
        "Daniel's documented project technologies include Next.js, TypeScript, Supabase, Prisma, PostgreSQL, Recharts, Tomcat, JDBC, Maven, AWS EC2, Google Cloud ADK, MCP, Gemini, BigQuery, Cloud Run, and Streamlit.",
        "His teaching experience covers Python, object-oriented programming, and problem solving. His coursework includes Data Structures and Algorithms, System Design, Machine Learning, and Information Retrieval.",
      ],
      sources: [resumeSource, ...Object.values(projectSources)],
      suggestions: ["Walk me through SplitSmart", "Show me an AI/ML project"],
    };
  }

  if (/accomplish|achievement|result|metric|impact|proud/.test(question)) {
    return {
      paragraphs: [
        "Two documented results stand out: Daniel's four weekly coding classes were associated with a 27% improvement in student test scores, and his work on Fabflix improved XML parsing and insertion performance by 40% through connection pooling, batch inserts, and caching.",
        "The résumé does not provide additional quantified results, so this guide does not infer any.",
      ],
      sources: [resumeSource, projectSources.fabflix],
      suggestions: ["Tell me about your teaching experience", "Tell me about Fabflix"],
    };
  }

  if (/about (you|yourself)|introduc|who are you|who is daniel/.test(question)) {
    return {
      paragraphs: [
        "Daniel Meng is a UC Irvine graduate with a B.S. in Computer Science and Business Information Management and a specialization in Intelligent Systems.",
        "He is pursuing entry-level full-stack or AI/ML software engineering roles, with experience teaching Python and building full-stack, backend, and AI/ML projects.",
      ],
      sources: [resumeSource],
      suggestions: DEFAULT_QUESTIONS,
    };
  }

  if (/another project|all (the )?projects|what.*projects|list.*projects|show.*work|what.*(built|made|created)/.test(question)) {
    return {
      paragraphs: ["Daniel's résumé includes SplitSmart, a full-stack group-expense app; Sports Analytics Agent, an MLB-focused AI/ML project; and Fabflix, a load-balanced backend project with MySQL replication."],
      sources: Object.values(projectSources),
      suggestions: ["Tell me about SplitSmart", "Tell me about Sports Analytics Agent", "Tell me about Fabflix"],
    };
  }
  if (/full.?stack|group expense|split expenses/.test(question)) return projectReply("splitsmart", question);
  if (/machine learning|ai project|ai\/ml|baseball|mlb|win probability/.test(question)) return projectReply("sports-analytics-agent", question);
  if (/backend project|load balanc|mysql replication|xml/.test(question)) return projectReply("fabflix", question);
  if (/^(hi|hello|hey|thanks|thank you)[!. ]*$/.test(question)) return getWelcome(previousProject);

  return {
    paragraphs: [
      "That answer is not documented in Daniel's verified résumé or current project information, so I won't fill in the gap.",
      "Try asking about his education, teaching experience, certifications, projects, technologies, or target roles.",
    ],
    sources: [resumeSource],
    suggestions: DEFAULT_QUESTIONS,
    project: previousProject,
  };
}
