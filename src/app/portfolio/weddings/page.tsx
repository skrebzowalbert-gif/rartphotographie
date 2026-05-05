import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hochzeitsfotografie Kaufbeuren & Allgäu",
  description:
    "Hochzeitsfotografie von R.ArtPhotographie in Kaufbeuren und Umgebung. Emotionale Reportagen, elegante Bildsprache und klare Pakete.",
  alternates: { canonical: "/portfolio/weddings" },
  openGraph: {
    title: "Hochzeitsfotografie | R.ArtPhotographie",
    description:
      "Emotionale Hochzeitsreportagen in Kaufbeuren, Allgäu und Umgebung.",
    url: "/portfolio/weddings",
  },
};

const images = [
  "/images/weddings/wedding-1.jpg",
  "/images/weddings/wedding-2.jpg",
  "/images/weddings/wedding-3.jpg",
  "/images/weddings/wedding-4.jpg",
  "/images/weddings/wedding-5.JPG",
  "/images/weddings/wedding-6.jpg",
  "/images/weddings/wedding-7.jpg",
  "/images/weddings/wedding-8.jpg",
  "/images/weddings/wedding-9.jpg",
  "/images/weddings/wedding-10.jpg",
  "/images/weddings/wedding-11.jpg",
  "/images/weddings/wedding-12.jpg",
  "/images/weddings/wedding-13.jpg",
  "/images/weddings/wedding-14.jpg",
  "/images/weddings/wedding-15.jpg",
  "/images/weddings/wedding-16.jpg",
  "/images/weddings/wedding-17.JPG",
  "/images/weddings/wedding-18.JPG",
  "/images/weddings/wedding-19.JPG",
  "/images/weddings/wedding-20.JPG",
];

export default function WeddingsPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd3] text-black">
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.35em] text-black/40">
            Portfolio / Hochzeiten
          </p>
          <h1 className="mt-6 text-4xl font-light md:text-6xl">
            Hochzeiten mit Gefühl und klarer Eleganz
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-black/60">
            Emotionale Reportagen und hochwertige Bildserien mit moderner Hochzeitsästhetik.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/kontakt?shooting=Hochzeit"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:opacity-85"
            >
              Hochzeit anfragen
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
                  alt={`Hochzeitsfotografin Allgäu R.ArtPhotographie Bild ${
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
