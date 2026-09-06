import { ArrowLeft, ArrowUpRight, Download, Printer } from 'lucide-react';
import './resume.css';

const projects = [
  {
    name: 'SplitSmart',
    date: 'Feb. 2026',
    technology: 'Next.js, TypeScript, Supabase, Prisma, PostgreSQL, Vercel',
    bullets: [
      'Built a full-stack accounting app with TypeScript, Prisma ORM, and PostgreSQL, supporting multi-user groups with expense splitting calculations and reducing manual tracking.',
      'Designed an interactive Recharts dashboard showing per-user spending breakdowns and monthly trends across shared expense groups.',
    ],
  },
  {
    name: 'Fabflix',
    date: 'Apr. 2025',
    technology: 'Apache Tomcat, JDBC, Maven, AWS EC2',
    bullets: [
      'Built and deployed a scalable full-stack web app on AWS EC2 with load balancing and master-slave MySQL replication.',
      'Used JDBC connection pooling, batch inserts, and in-memory caching to improve XML parsing and insert speed by 40% and eliminate unnecessary look-ups.',
    ],
  },
  {
    name: 'Sports Analytics Agent',
    date: 'Oct. 2025',
    technology: 'Google Cloud, ADK, MCP, Gemini, BigQuery, Cloud Run, Streamlit',
    bullets: [
      'Built and deployed an end-to-end AI analytics platform with ADK and Cloud Run, integrating real-time MLB APIs and BigQuery for scalable data ingestion and serving.',
      'Developed a BQML Win Probability model in a BigQuery data lake, enabling real-time outcome predictions and detailed performance analysis.',
    ],
  },
];

const skills = [
  ['Languages', 'Python, JavaScript/TypeScript, C/C++, SQL, C#, Java'],
  ['Frameworks', 'React, Node.js, Next.js'],
  ['Databases', 'MySQL, PostgreSQL, MongoDB'],
  ['Cloud', 'AWS (EC2, Load Balancer), Google Cloud (BigQuery, Cloud Run)'],
  ['AI / ML', 'Antigravity CLI, Claude Code, ADK, MCP, BQML, Sci-Kit Learn'],
  ['Tools', 'Git, VS Code, Pycharm'],
];

export default function ResumePage() {
  return (
    <div className="resume-page">
      <div className="resume-page-intro">
        <a className="resume-back" href="/#work">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to the work
        </a>

        <div className="resume-intro-row">
          <div>
            <p className="resume-eyebrow">THE RÉSUMÉ</p>
            <h1>The short version<span>.</span></h1>
            <p className="resume-intro-copy">
              Education, experience, and selected engineering work in one place.
            </p>
          </div>
          <div className="resume-actions">
            <a
              className="resume-download-button"
              href="/Daniel_Meng_Resume.pdf"
              download
            >
              <Download size={17} aria-hidden="true" />
              Download public PDF
            </a>
            <button
              className="resume-print-button"
              type="button"
              onClick={() => window.print()}
            >
              <Printer size={17} aria-hidden="true" />
              Print this page
            </button>
          </div>
        </div>

        <div className="resume-template-note">
          <span className="resume-status-dot" aria-hidden="true" />
          <p>
            <strong>Public résumé preview.</strong> Download the public PDF or
            browse the same details below.
          </p>
        </div>
      </div>

      <article className="resume-document" aria-labelledby="resume-person">
        <header className="resume-document-header">
          <div className="resume-document-topline">
            <span className="resume-document-label">SOFTWARE ENGINEERING</span>
            <span className="resume-document-mark" aria-hidden="true">[ dm ]</span>
          </div>
          <h2 id="resume-person">Daniel Meng</h2>
          <p className="resume-role">Software engineer</p>
          <div className="resume-contact-row">
            <a href="mailto:danielmeng530@gmail.com">danielmeng530@gmail.com</a>
            <a href="https://www.linkedin.com/in/danielmengo/">
              linkedin.com/in/danielmengo
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href="https://github.com/danmengo">
              github.com/danmengo
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </header>

        <section className="resume-summary" aria-labelledby="resume-summary-title">
          <h3 id="resume-summary-title" className="resume-section-title">Profile</h3>
          <p>
            B.S. in Computer Science and Business Information Management with an
            Intelligent Systems specialization. Full-stack and AI projects span
            TypeScript, cloud deployment, data systems, and machine learning.
          </p>
        </section>

        <div className="resume-document-columns">
          <div className="resume-primary-column">
            <section aria-labelledby="resume-projects-title">
              <div className="resume-section-heading">
                <h3 id="resume-projects-title" className="resume-section-title">Projects</h3>
              </div>
              <div className="resume-projects">
                {projects.map((project) => (
                  <div className="resume-project" key={project.name}>
                    <h4>{project.name}</h4>
                    <p className="resume-project-category">
                      {project.technology} · {project.date}
                    </p>
                    {project.bullets.map((bullet) => (
                      <p key={bullet}>{bullet}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className="resume-experience" aria-labelledby="resume-experience-title">
              <h3 id="resume-experience-title" className="resume-section-title">Experience</h3>
              <div className="resume-project">
                <h4>American Young Coder Academy</h4>
                <p className="resume-project-category">
                  Coding Instructor · San Gabriel, California · May 2024 - Mar. 2026
                </p>
                <p>
                  Led four weekly coding classes teaching Python fundamentals,
                  object-oriented programming, and problem-solving techniques.
                </p>
                <p>
                  Improved students&apos; Python test scores by 27% through structured
                  curriculum and targeted feedback.
                </p>
              </div>
            </section>

            <section className="resume-experience" aria-labelledby="resume-leadership-title">
              <h3 id="resume-leadership-title" className="resume-section-title">Activities and leadership</h3>
              <div className="resume-project">
                <h4>Asian American Christian Fellowship</h4>
                <p className="resume-project-category">
                  Student Leader · Irvine, California · Sept. 2023 - June 2026
                </p>
                <p>Led weekly small-group discussions and coordinated events for a 70+ member organization.</p>
              </div>
              <div className="resume-project">
                <h4>UCI Triathlon Club</h4>
                <p className="resume-project-category">
                  Member · Irvine, California · Sept. 2025 - June 2026
                </p>
                <p>Train and compete in sprint-distance triathlons; maintain a structured endurance training schedule.</p>
              </div>
            </section>
          </div>

          <aside className="resume-secondary-column" aria-label="Education and technical background">
            <section aria-labelledby="resume-education-title">
              <h3 id="resume-education-title" className="resume-section-title">Education</h3>
              <div className="resume-education-block">
                <h4>University of California, Irvine</h4>
                <p>Irvine, California</p>
                <p>Bachelor of Science in Computer Science and Business Information Management</p>
                <p>Sept. 2022 - June 2026</p>
                <p>Specialization: Intelligent Systems</p>
                <p>Cumulative GPA: 3.535</p>
                <p>
                  Coursework: Data Structures &amp; Algorithms, Systems Design,
                  Machine Learning, Information Retrieval
                </p>
              </div>
            </section>

            <section aria-labelledby="resume-skills-title">
              <h3 id="resume-skills-title" className="resume-section-title">Technical skills</h3>
              {skills.map(([label, value]) => (
                <p key={label}>
                  <strong>{label}:</strong> {value}
                </p>
              ))}
            </section>

            <section aria-labelledby="resume-certifications-title">
              <h3 id="resume-certifications-title" className="resume-section-title">Certifications</h3>
              <ul className="resume-focus-list">
                <li>The Complete SQL Bootcamp: Go from Zero to Hero · Udemy · 2026</li>
                <li>Google AI Professional Certificate · Coursera · 2026</li>
                <li>Claude Code in Action · Anthropic · 2026</li>
              </ul>
            </section>
          </aside>
        </div>

        <footer className="resume-document-footer">
          <span>Daniel Meng / software engineering</span>
          <span>github.com/danmengo</span>
        </footer>
      </article>

      <p className="resume-print-help">
        Use your browser’s print dialog to save a PDF. For a clean copy, turn off
        the browser’s headers and footers.
      </p>
    </div>
  );
}
