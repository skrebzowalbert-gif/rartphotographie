import Image from "next/image";
import Link from "next/link";

/**
 * Ausgewählte Arbeiten.
 *
 * Die Motive sind nach gemessener Helligkeit und Farbigkeit ausgewählt
 * (Luminanz 136–179 von 255). Sehr dunkle Aufnahmen wirken als Kachel wie
 * schwarze Rechtecke und reißen den tonalen Zusammenhang auseinander –
 * genau das war beim ersten Entwurf der Fall.
 *
 * Ersetzt die frühere Bilderwand aus 44 Miniaturen. Ein Mosaik briefmarken-
 * großer Fotos zeigt bei einer Fotografin genau das Falsche: Menge statt
 * Qualität. Niemand erkennt darauf, wie gut jemand fotografiert.
 *
 * Stattdessen wenige große Motive in einem versetzten Raster – jedes groß
 * genug, um zu wirken, und mit unterschiedlichen Höhen, damit keine Rasterlinie
 * entsteht. Die Bilder laufen beim Scrollen auf.
 */
const work = [
  {
    src: "/images/weddings/wedding-13.jpg",
    alt: "Hochzeitsfotografie im Allgäu: Braut im Mohnfeld",
    label: "Hochzeit",
    className: "lg:col-span-5",
    ratio: "aspect-[4/5]",
  },
  {
    src: "/images/portrait/portrait-30.jpg",
    alt: "Portraitfotografie in Kaufbeuren: Portrait im natürlichen Licht",
    label: "Portrait",
    className: "lg:col-span-4 lg:mt-24",
    ratio: "aspect-[3/4]",
  },
  {
    src: "/images/newborn/newborn-2.jpg",
    alt: "Newborn-Fotografie in Kaufbeuren: Neugeborenes in den ersten Lebenstagen",
    label: "Newborn",
    className: "lg:col-span-3 lg:mt-52",
    ratio: "aspect-[3/4]",
  },
  {
    src: "/images/weddings/wedding-12.jpg",
    alt: "Hochzeitsreportage im Allgäu: Brautpaar im Freien",
    label: "Hochzeit",
    className: "lg:col-span-4 lg:-mt-12",
    ratio: "aspect-[3/4]",
  },
  {
    src: "/images/weddings/wedding-14.jpg",
    alt: "Hochzeitsfotografie in Kaufbeuren: Detail vom Hochzeitstag",
    label: "Hochzeit",
    className: "lg:col-span-5 lg:mt-10",
    ratio: "aspect-[4/5]",
  },
  {
    src: "/images/family/family-2.jpg",
    alt: "Familienfotografie in Kaufbeuren: Familie in entspannter Aufnahme",
    label: "Familie",
    className: "lg:col-span-3 lg:mt-32",
    ratio: "aspect-[3/4]",
  },
];

export default function SelectedWork() {
  return (
    <section className="bg-sand px-[var(--shell-x)] py-24 md:py-32">
      <div className="mx-auto max-w-[110rem]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow rise text-ink/55">Ausgewählte Arbeiten</p>
            <h2 className="display-lg rise mt-5 max-w-2xl text-ink">
              Kein Katalog.
              <br />
              <span className="accent-italic">Eure</span> Geschichte.
            </h2>
          </div>

          <Link
            href="/galerie"
            className="link-sweep rise self-start text-base font-medium text-ink/80 md:self-auto"
          >
            Alle Arbeiten ansehen
          </Link>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8">
          {work.map((item) => (
            <figure key={item.src} className={item.className}>
              <Link
                href="/galerie"
                className="zoom-parent group block overflow-hidden"
              >
                <div className={`unveil relative w-full ${item.ratio}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="eyebrow text-ink/55">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-ink/40 transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </figcaption>
              </Link>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
