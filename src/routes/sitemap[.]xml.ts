import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { listPecas } from "@/lib/public-data.functions";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const pecas = await listPecas();
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/pecas", changefreq: "weekly", priority: "0.8" },
          { path: "/bilhetes", changefreq: "daily", priority: "0.9" },
          { path: "/contactos", changefreq: "monthly", priority: "0.5" },
          ...pecas.map((p) => ({
            path: `/pecas/${p.slug}`,
            changefreq: "monthly",
            priority: "0.7",
          })),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});