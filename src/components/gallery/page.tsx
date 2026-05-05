import Image from "next/image";

const images = [
  "/images/portrait/portrait-1.jpg",
  "/images/portrait/portrait-2.jpg",
  "/images/portrait/portrait-3.jpg",
  "/images/portrait/portrait-4.jpg",
  "/images/portrait/portrait-5.jpg",
  "/images/portrait/portrait-6.jpg",

  "/images/events/event-1.jpg",
  "/images/events/event-2.jpg",
  "/images/events/event-3.jpg",
  "/images/events/event-4.jpg",
  "/images/events/event-5.jpg",
  "/images/events/event-6.jpg",

  "/images/weddings/wedding-1.jpg",
  "/images/weddings/wedding-2.jpg",
  "/images/weddings/wedding-3.jpg",
  "/images/weddings/wedding-4.jpg",
  "/images/weddings/wedding-5.JPG",
  "/images/weddings/wedding-6.jpg",
];

export default function GaleriePage() {
  return (
    <main className="min-h-screen bg-[#e7dfd3] text-black">
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.35em] text-black/40">
            Galerie
          </p>

          <h1 className="mt-6 text-4xl font-light md:text-6xl">
            Alle Bilder auf einen Blick
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-black/60">
            Portraits, Events und Hochzeiten in einer durchgehenden Gesamtansicht.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto columns-1 gap-6 sm:columns-2 xl:columns-3">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="mb-6 overflow-hidden bg-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >
              <Image
                src={src}
                alt={`Galerie Bild ${index + 1}`}
                width={1200}
                height={1600}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
