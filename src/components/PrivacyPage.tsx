import { Link } from "react-router-dom";
import "./privacy.css";

export default function PrivacyPage() {
  return (
    <article className="privacy-page page-width">
      <Link to="/">← Back to the portfolio</Link>
      <h1>Privacy policy</h1>
      <p className="privacy-date">Effective September 13, 2026</p>
      <p>This policy explains how Daniel Meng’s portfolio website and mengoAI handle information when you visit or send a message.</p>

      <section>
        <h2>When you use mengoAI</h2>
        <p>Your question and the current project context are sent to Cloudflare Workers AI to find relevant portfolio information and generate an answer. This includes creating a numerical representation of the question for search. The full conversation history is not sent with each request.</p>
        <p>Please avoid entering sensitive personal information or private information about other people. mengoAI is an AI assistant, and its answers can be inaccurate.</p>
      </section>
      <section>
        <h2>What is stored</h2>
        <p>The app keeps the visible conversation in your browser tab’s memory. It does not save chat transcripts in a server database or intentionally write questions and answers to application logs. Reloading the page or leaving the chat clears that conversation. This does not mean your messages stay on your device: they are processed by Cloudflare to answer you.</p>
        <p>The search index stores Daniel’s public portfolio information, not visitor chat history. A shared daily request count is stored for usage limits; it contains a date and count, not your messages. The count is replaced when a request is counted on a new day.</p>
      </section>
      <section>
        <h2>Hosting and abuse prevention</h2>
        <p>Cloudflare hosts this site and processes network information, such as IP addresses and request metadata, to deliver and protect it. The chat uses your IP address as a rate-limit key to help prevent abuse. Cloudflare may retain operational and security data under its applicable policies; the app’s lack of transcript storage is not a promise of zero provider retention.</p>
        <p>Cloudflare states that Workers AI customer content is not used to train models or improve its or third-party services without explicit consent. Read <a href="https://developers.cloudflare.com/workers-ai/platform/data-usage/">Cloudflare’s Workers AI data practices</a> and <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare’s privacy policy</a> for details.</p>
      </section>
      <section>
        <h2>Browser storage and tracking</h2>
        <p>The site uses local storage to remember your light, dark, or automatic theme preference. You can remove it by clearing this site’s browser data. The app does not use advertising cookies or implement cross-site behavioral tracking, and does not change its behavior in response to browser Do Not Track signals.</p>
        <p>Information is processed by service providers to operate the site, not sold or shared for targeted advertising. External sites linked from this portfolio have their own privacy practices and may collect information when you visit them.</p>
      </section>
      <section>
        <h2>Your choices and contacting Daniel</h2>
        <p>You can browse the portfolio without using the AI. If you email Daniel, your email address and the information you choose to send are processed by the email provider to deliver the message and support a reply. Email correspondence may be retained to handle your inquiry and related follow-up.</p>
        <p>For privacy questions or requests to access, correct, or delete personal information Daniel holds, email <a href="mailto:danielmeng530@gmail.com">danielmeng530@gmail.com</a>. Applicable rights depend on your location. Since the app does not maintain chat transcripts, Daniel cannot retrieve a conversation from a chat-history database.</p>
      </section>
      <section>
        <h2>Changes to this policy</h2>
        <p>Updates will be published on this page with a revised effective date. Material changes to how the site handles personal information will also be announced through a notice on the site.</p>
      </section>
    </article>
  );
}
