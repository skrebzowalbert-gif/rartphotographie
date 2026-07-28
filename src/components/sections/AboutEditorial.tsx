import Image from "next/image";
import Link from "next/link";

/**
 * Über Regina.
 *
 * Vorher: ein kleines Portrait mittig, drumherum sechs Stichpunkte in zwei
 * Spalten – das liest sich wie eine Feature-Tabelle, nicht wie ein Mensch.
 * Drei der sechs Punkte sagten dabei dasselbe („ruhige Begleitung",
 * „natürlich statt gestellt", „Sicherheit vor der Kamera").
 *
 * Jetzt eine editoriale Doppelseite: das Portrait läuft randlos aus dem
 * Satzspiegel, ein Zitat trägt die Aussage, der Text ist auf drei echte
 * Gedanken reduziert.
 */
export default function AboutEditorial() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-[110rem] items-center gap-14 px-[var(--shell-x)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
        {/* BILD – bricht links aus dem Satzspiegel aus, kein Rahmen */}
        <div className="relative lg:-ml-[var(--shell-x)]">
          <div className="unveil relative aspect-[4/5] w-full lg:aspect-[3/4]">
            <Image
              src="/images/about/regina_about1.jpg"
              alt="Regina Gerdt, Fotografin bei R.ArtPhotographie in Kaufbeuren"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <p className="mt-5 text-sm text-ink/55">Regina Gerdt · Kaufbeuren</p>
        </div>

        <div>
          <p className="eyebrow rise text-ink/55">Über mich</p>

          <blockquote className="rise mt-8">
            <p className="display-lg text-ink">
              &bdquo;Ich bin nicht
              <br />
              <span className="accent-italic">fotogen</span>&ldquo;
            </p>
          </blockquote>

          <div className="stagger mt-10 max-w-xl space-y-6 text-lg leading-8 text-ink/75">
            <p>
              Diesen Satz höre ich in fast jedem Vorgespräch. Fast nie stimmt
              er. Meistens fehlt nur jemand, der sagt, wohin mit den Händen.
            </p>
            <p>
              Deshalb arbeite ich mit Anleitung statt mit Posen. Ich sage dir,
              wie du stehst, dich drehst, dich bewegst – und fotografiere in den
              Momenten dazwischen. Das dauert etwas länger als ein
              durchgetaktetes Studioshooting. Dafür sieht man den Bildern
              hinterher nicht an, dass jemand mit einer Kamera dabeistand.
            </p>
            <p>
              Bei Babybauch, Newborn und Familien ist Ruhe wichtiger als ein
              Zeitplan. Ein Newborn-Termin dauert bei mir drei Stunden, weil ein
              Baby nicht nach Uhrzeit funktioniert. Pausen zum Stillen und
              Trösten sind eingeplant, nicht geduldet.
            </p>
          </div>

          <div className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/ueber-mich"
              className="group inline-flex min-h-[58px] items-center gap-3 rounded-full border border-ink/25 px-8 text-base font-medium text-ink transition-colors duration-500 hover:border-ink/60"
            >
              Mehr über mich
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <Link
              href="/kontakt"
              className="link-sweep text-base font-medium text-ink/80"
            >
              Shooting anfragen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
