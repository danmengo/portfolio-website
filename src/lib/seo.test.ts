import { describe, expect, it } from "vitest";
import { projects } from "../data/projects";
import { escapeHtml, metadataForPath, pageMetadata, renderMetadata } from "./seo";

describe("portfolio search metadata", () => {
  it("gives every published project its own accurate metadata", () => {
    for (const project of projects) {
      const path = `/projects/${project.id}`;
      const html = renderMetadata(path);
      expect(html).toContain(escapeHtml(project.description));
      expect(html).toContain(`href="https://danmengo.com${path}"`);
      expect(html).toContain('content="index, follow"');
      expect(metadataForPath(path).title).toContain(project.name);
    }
    const pages = Object.values(pageMetadata);
    expect(new Set(pages.map(page => page.title)).size).toBe(pages.length);
    expect(new Set(pages.map(page => page.description)).size).toBe(pages.length);
  });
  it("normalizes trailing slashes without inventing a canonical for missing pages", () => {
    expect(renderMetadata("/resume/")).toBe(renderMetadata("/resume"));
    expect(renderMetadata("/missing")).not.toContain('rel="canonical"');
    expect(renderMetadata("/missing")).toContain("noindex, follow");
  });
  it("keeps chat and unfinished projects out of search results", () => {
    expect(metadataForPath("/chat").index).toBe(false);
    expect(metadataForPath("/projects/new-project").index).toBe(false);
    expect(metadataForPath("/privacy").index).toBe(true);
  });
  it("escapes text for safe HTML attributes", () => {
    expect(escapeHtml('<hello "world"> &')).toBe('&lt;hello &quot;world&quot;&gt; &amp;');
  });
});
