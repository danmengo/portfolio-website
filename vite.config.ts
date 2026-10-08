import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pageMetadata, renderMetadata } from "./src/lib/seo";

export default defineConfig({
  plugins: [react(), {
    name: "portfolio-page-metadata",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n    ${renderMetadata("/")}\n    <!-- seo:end -->`);
    },
    closeBundle() {
      const output = resolve("dist");
      const html = readFileSync(resolve(output, "index.html"), "utf8");
      for (const path of Object.keys(pageMetadata).filter(path => path !== "/")) {
        const directory = resolve(output, path.slice(1));
        mkdirSync(directory, { recursive: true });
        writeFileSync(resolve(directory, "index.html"), html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n    ${renderMetadata(path)}\n    <!-- seo:end -->`));
      }
      const urls = Object.entries(pageMetadata).filter(([, page]) => page.index).map(([path]) => `  <url><loc>https://danmengo.com${path}</loc></url>`);
      writeFileSync(resolve(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
    },
  }],
  server: { proxy: { "/api": "http://127.0.0.1:8787" } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
