import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portraitshooting Kaufbeuren",
  description:
    "Ausdrucksstarke Portraitshootings bei R.ArtPhotographie in Kaufbeuren. Klare Bildsprache, ruhige Anleitung und hochwertige Portraits.",
  alternates: { canonical: "/portfolio/portrait" },
  openGraph: {
    title: "Portrait Portfolio | R.ArtPhotographie",
    description:
      "Portraitshootings mit klarer Bildsprache in Kaufbeuren und Umgebung.",
    url: "/portfolio/portrait",
  },
};

const images = [
  "/images/portrait/portrait-1.jpg",
  "/images/portrait/portrait-2.jpg",
  "/images/portrait/portrait-3.jpg",
  "/images/portrait/portrait-4.jpg",
  "/images/portrait/portrait-5.jpg",
  "/images/portrait/portrait-6.jpg",
  "/images/portrait/portrait-7.jpg",
  "/images/portrait/portrait-8.jpg",
  "/images/portrait/portrait-9.jpg",
  "/images/portrait/portrait-10.jpg",
  "/images/portrait/portrait-11.jpg",
  "/images/portrait/portrait-12.jpg",
  "/images/portrait/portrait-13.jpg",
  "/images/portrait/portrait-14.jpg",
  "/images/portrait/portrait-15.jpg",
  "/images/portrait/portrait-16.jpg",
  "/images/portrait/portrait-17.jpg",
  "/images/portrait/portrait-18.jpg",
  "/images/portrait/portrait-19.jpg",
  "/images/portrait/portrait-20.jpg",
  "/images/portrait/portrait-21.jpg",
  "/images/portrait/portrait-22.jpg",
  "/images/portrait/portrait-23.jpg",
  "/images/portrait/portrait-24.jpg",
  "/images/portrait/portrait-25.jpg",
  "/images/portrait/portrait-26.jpg",
  "/images/portrait/portrait-27.jpg",
  "/images/portrait/portrait-28.jpg",
  "/images/portrait/portrait-29.jpg",
  "/images/portrait/portrait-30.jpg",
  "/images/portrait/portrait-31.jpg",
];

export default function PortraitPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd3] text-black">
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.35em] text-black/40">
            Portfolio / Portrait
          </p>
          <h1 className="mt-6 text-4xl font-light md:text-6xl">
            Ausdrucksstarke Portraits mit klarer Bildsprache
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-black/60">
            Editoriale Looks, dunkle Ästhetik und saubere Inszenierung.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/kontakt?shooting=Portraitshooting"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:opacity-85"
            >
              Shooting anfragen
            </Link>
            <Link
              href="/preise"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-black/12 px-8 py-3 text-sm text-black transition hover:border-black/25 hover:bg-black/5"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, index) => (
            <Link
              key={src}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden bg-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={src}
                  alt={`Portraitshooting Kaufbeuren R.ArtPhotographie Bild ${
                    index + 1
                  }`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
