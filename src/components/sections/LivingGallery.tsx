import Image from "next/image";
import Link from "next/link";

/**
 * Bewegte Galerie.
 *
 * Die frühere Bilderwand war das Einzige auf der Seite, das andere Fotografen
 * in der Region nicht hatten – sie hatte nur zwei Probleme: die Bilder waren
 * briefmarkengroß, und sie war unkuratiert (bis hin zu einem Nachtclubfoto in
 * Lila zwischen Hochzeitsbildern).
 *
 * Diese Fassung behält die Bewegung und behebt beides:
 * - große Motive statt Miniaturen
 * - kuratierter Satz, nach gemessener Helligkeit ausgewählt
 * - räumliche Tiefe über Perspektive statt flacher Kacheln
 * - zwei Bänder in Gegenrichtung mit unterschiedlichem Tempo
 * - Bewegung stoppt beim Überfahren, damit man ein Bild ansehen kann
 *
 * Umgesetzt in reinem CSS. Kein Slider-Skript, keine Bibliothek, kein
 * JavaScript im Bundle – das Band läuft auch, wenn kein JS ausgeführt wird.
 */
const rowOne = [
  { src: "/images/weddings/wedding-13.jpg", alt: "Braut im Mohnfeld, Hochzeitsfotografie im Allgäu" },
  { src: "/images/portrait/portrait-30.jpg", alt: "Portraitshooting in Kaufbeuren im natürlichen Licht" },
  { src: "/images/newborn/newborn-2.jpg", alt: "Newborn-Shooting in Kaufbeuren, Neugeborenes in den ersten Lebenstagen" },
  { src: "/images/weddings/wedding-12.jpg", alt: "Brautpaar im Freien, Hochzeitsreportage im Allgäu" },
  { src: "/images/portrait/portrait-7.jpg", alt: "Portraitfotografie in Kaufbeuren" },
  { src: "/images/family/family-2.jpg", alt: "Familienshooting in Kaufbeuren" },
  { src: "/images/weddings/wedding-14.jpg", alt: "Detail vom Hochzeitstag, Hochzeitsfotografie Kaufbeuren" },
  { src: "/images/portrait/portrait-12.jpg", alt: "Portraitshooting im Allgäu" },
];

const rowTwo = [
  { src: "/images/babybauch/babybauch-2.jpg", alt: "Babybauchshooting in Kaufbeuren im weichen Seitenlicht" },
  { src: "/images/weddings/wedding-1.jpg", alt: "Hochzeitsfotografie in Kaufbeuren" },
  { src: "/images/portrait/portrait-24.jpg", alt: "Portraitfotografie im Ostallgäu" },
  { src: "/images/weddings/wedding-15.jpg", alt: "Hochzeitsreportage im Allgäu" },
  { src: "/images/portrait/portrait-17.jpg", alt: "Portraitshooting in Kaufbeuren" },
  { src: "/images/weddings/wedding-8.jpg", alt: "Brautpaar, Hochzeitsfotografie Allgäu" },
  { src: "/images/family/family-1.jpg", alt: "Familienfotografie in Kaufbeuren, mehrere Generationen" },
  { src: "/images/portrait/portrait-11.jpg", alt: "Portraitfotografie in Kaufbeuren" },
];

function Track({
  images,
  reverse = false,
}: {
  images: { src: string; alt: string }[];
  reverse?: boolean;
}) {
  // Der Satz wird verdoppelt, damit der Durchlauf nahtlos schließt.
  const doubled = [...images, ...images];

  return (
    <div className="living-gallery__row">
      <div
        className={`living-gallery__track${
          reverse ? " living-gallery__track--reverse" : ""
        }`}
      >
        {doubled.map((image, index) => (
          <Link
            key={`${image.src}-${index}`}
            href="/galerie"
            className="living-gallery__item"
            tabIndex={index < images.length ? 0 : -1}
            aria-hidden={index >= images.length}
          >
            <Image
              src={image.src}
              alt={index < images.length ? image.alt : ""}
              width={420}
              height={560}
              sizes="(max-width: 768px) 240px, 340px"
              className="h-full w-full object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function LivingGallery() {
  return (
    <section className="living-gallery bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-[110rem] px-[var(--shell-x)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow rise text-paper/50">Aus dem Archiv</p>
            <h2 className="display-lg rise mt-5 max-w-2xl text-paper">
              Ein Jahr in
              <br />
              <span className="accent-italic">Bildern</span>
            </h2>
          </div>

          <p className="rise max-w-sm text-base leading-8 text-paper/65">
            Hochzeiten, erste Lebenstage, Babybäuche und Portraits – aus
            Kaufbeuren und dem ganzen Allgäu.
          </p>
        </div>
      </div>

      {/* Bänder laufen randlos über die volle Breite. */}
      <div className="living-gallery__stage mt-14">
        <Track images={rowOne} />
        <Track images={rowTwo} reverse />
      </div>

      <div className="mx-auto mt-14 max-w-[110rem] px-[var(--shell-x)]">
        <Link
          href="/galerie"
          className="group inline-flex min-h-[58px] items-center gap-3 rounded-full bg-paper px-8 text-base font-medium text-ink transition-opacity duration-500 hover:opacity-90"
        >
          Zur vollständigen Galerie
          <span
            aria-hidden="true"
            className="transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
