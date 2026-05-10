const productionSiteUrl = "https://rartphotographie.de";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteUrl =
  configuredSiteUrl &&
  !configuredSiteUrl.includes("localhost") &&
  !configuredSiteUrl.includes("vercel.app")
    ? configuredSiteUrl
    : productionSiteUrl;

export const instagramUrl =
  process.env.INSTAGRAM_URL ||
  "https://www.instagram.com/r.artphotographie?igsh=MWgwYWM2bzl2dWNpOQ==";

export const publicContactEmail = "reginaackermann11@gmail.com";
