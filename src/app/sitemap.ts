import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const routes = [
  { path: "/", priority: 1 },
  { path: "/fotografin-kaufbeuren", priority: 0.9 },
  { path: "/fotografin-allgaeu", priority: 0.9 },
  { path: "/galerie", priority: 0.75 },
  { path: "/preise", priority: 0.9 },
  { path: "/gutscheine", priority: 0.85 },
  { path: "/kontakt", priority: 0.95 },
  { path: "/partner", priority: 0.55 },
  { path: "/impressum", priority: 0.3 },
  { path: "/datenschutz", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-05-03"),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}
