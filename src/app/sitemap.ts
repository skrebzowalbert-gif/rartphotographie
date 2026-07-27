import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Alle indexierbaren Routen. Fehlende Einträge werden von Google deutlich
 * seltener gecrawlt – die vier Portfolio-Seiten fehlten bisher komplett.
 */
const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/fotografin-kaufbeuren", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/fotografin-allgaeu", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/kontakt", priority: 0.95, changeFrequency: "monthly" as const },
  { path: "/preise", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/gutscheine", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/galerie", priority: 0.75, changeFrequency: "weekly" as const },
  { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/portfolio/portrait", priority: 0.65, changeFrequency: "monthly" as const },
  { path: "/portfolio/weddings", priority: 0.65, changeFrequency: "monthly" as const },
  { path: "/portfolio/events", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/partner", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/agb", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/widerruf", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Build-Zeitpunkt statt hartkodiertem Datum: sonst meldet die Sitemap
  // dauerhaft denselben Stand, auch nach echten Inhaltsänderungen.
  const lastModified = new Date();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
