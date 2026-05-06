"use client";

import dynamic from "next/dynamic";
import config from "../../../sanity.config";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <main style={{ minHeight: "100vh", background: "#111", color: "#fff" }} />
    ),
  }
);

export default function SanityStudio() {
  return <NextStudio config={config} />;
}
