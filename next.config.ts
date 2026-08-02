import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.app", "*.ngrok.io"],

  // Die Schriftdateien des Gutscheins werden zur Laufzeit gelesen. Ohne
  // diesen Eintrag landen sie nicht im Serverless-Bundle und das PDF fiele
  // still auf die Standardschriften zurück.
  outputFileTracingIncludes: {
    "/api/gutschein/pdf": ["src/lib/fonts/**/*"],
    "/api/stripe/webhook": ["src/lib/fonts/**/*"],
  },

  images: {
    // AVIF vor WebP: bei Fotomotiven typisch 20–30 % kleiner als WebP.
    // Ohne diese Angabe liefert Next ausschließlich WebP aus.
    formats: ["image/avif", "image/webp"],

    // Das größte Originalbild ist 2560 px breit – 3840er-Kandidaten im
    // srcset wären reine Platzverschwendung.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Fotos ändern sich nicht mehr. Der Standardwert von 4 Stunden lässt den
    // Optimizer-Cache mehrfach täglich unnötig neu laufen.
    minimumCacheTTL: 60 * 60 * 24 * 30,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
