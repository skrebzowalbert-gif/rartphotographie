import Link from "next/link";
import type { Metadata } from "next";
import { instagramUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich",
  description: "Die Gutschein-Zahlung bei R.ArtPhotographie war erfolgreich.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GutscheinErfolgPage() {
  return (
    <main className="bg-[#e7dfd3] px-6 pb-24 text-black md:px-10">
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-black/38">
          Gutschein
        </p>
        <h1 className="mt-5 text-4xl font-light leading-[1] md:text-6xl">
          Zahlung erfolgreich
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/64 md:text-lg">
          Deine Gutschein-Zahlung ist eingegangen. Der Gutschein wird
          hochwertig vorbereitet und versendet. Falls noch Details offen sind,
          melden wir uns bei dir.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-black/58">
          Du bekommst eine Bestätigung per E-Mail. Der Gutschein wird
          anschließend vorbereitet.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90"
            style={{ color: "#ffffff" }}
          >
            Zur Startseite
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/25 bg-transparent px-8 py-4 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
          >
            Kontakt
          </Link>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/25 bg-transparent px-8 py-4 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
          >
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
