import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventfotografie Kaufbeuren",
  description:
    "Eventfotografie von R.ArtPhotographie: Stimmung, Licht und besondere Augenblicke professionell festgehalten.",
  alternates: { canonical: "/portfolio/events" },
  openGraph: {
    title: "Eventfotografie | R.ArtPhotographie",
    description:
      "Eventfotos mit Dynamik, Stimmung und einem Blick für Details.",
    url: "/portfolio/events",
  },
};

const images = [
  "/images/events/event-1.jpg",
  "/images/events/event-2.jpg",
  "/images/events/event-3.jpg",
  "/images/events/event-4.jpg",
  "/images/events/event-5.jpg",
  "/images/events/event-6.jpg",
  "/images/events/event-7.jpg",
  "/images/events/event-8.jpg",
  "/images/events/event-9.jpg",
  "/images/events/event-10.jpg",
  "/images/events/event-11.jpg",
  "/images/events/event-12.JPG",
  "/images/events/event-13.JPG",
  "/images/events/event-14.JPG",
  "/images/events/event-15.jpg",
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd3] text-black">
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.35em] text-black/40">
            Portfolio / Events
          </p>
          <h1 className="mt-6 text-4xl font-light md:text-6xl">
            Events mit Energie, Licht und Präsenz
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-black/60">
            Feiern, Veranstaltungen und besondere Abende mit Dynamik, Stimmung
            und klarer Bildsprache.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/kontakt?shooting=Eventfotografie"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:opacity-85"
            >
              Event anfragen
            </Link>
            <Link
              href="/preise"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-black/25 bg-transparent px-8 py-3 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
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
                  alt={`Event ${index + 1}`}
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
