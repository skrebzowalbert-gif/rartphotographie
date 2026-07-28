import Link from "next/link";
import Image from "next/image";
import { googleReviews, phoneDisplay, phoneHref } from "@/lib/site";

/**
 * Startseiten-Hero.
 *
 * Gestaltungsprinzip: kein Bild in einer Box. Das Hauptmotiv läuft randlos
 * bis an die obere, rechte und untere Kante, ein zweites Motiv überlappt
 * versetzt die Kante. Diese Asymmetrie erzeugt Tiefe – ein zentriertes
 * Zwei-Spalten-Raster mit abgerundetem Bild sieht immer nach Vorlage aus.
 *
 * Beide Motive liegen im Hochformat vor. Deshalb bekommt das Bild eine
 * eigene, volle Spalte statt eines Querformat-Ausschnitts, in dem die
 * Gesichter verloren gingen.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sand">
      <div className="mx-auto grid max-w-[110rem] items-stretch lg:min-h-[92svh] lg:grid-cols-[1fr_1.05fr]">
        {/* BILD – randlos, ohne Rahmen, ohne Radius */}
        <div className="relative order-1 h-[52svh] min-h-[340px] w-full lg:order-2 lg:h-auto">
          <Image
            src="/images/babybauch/babybauch-1.jpg"
            alt="Babybauchshooting in Kaufbeuren: werdende Eltern halten gemeinsam ein Paar Babyschuhe vor dem Bauch"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="drift object-cover object-[50%_25%] lg:object-center"
          />
          {/* Nur auf Mobile ein weicher Auslauf nach unten. Auf Desktop
              bewusst eine harte Kante: der Verlauf über dem Gesicht sah aus
              wie ein Bildfehler. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,var(--color-sand),transparent)] lg:hidden" />
        </div>

        {/* TEXT */}
        <div className="relative order-2 flex flex-col justify-center px-[var(--shell-x)] pb-20 pt-12 lg:order-1 lg:py-28 lg:pr-0">
          <p className="eyebrow rise text-ink/55">Kaufbeuren &amp; Allgäu</p>

          <h1 className="display-hero rise mt-6 text-ink">
            Bilder, die sich
            <br />
            <span className="accent-italic">nach euch</span> anfühlen
          </h1>

          <p className="rise mt-8 max-w-lg text-lg leading-8 text-ink/72">
            Babybauch, Newborn, Familie und Hochzeit – ruhig begleitet, ohne
            gestellte Posen. Damit ihr euch auf den Bildern wiedererkennt und
            nicht bloß gut aussehen müsst.
          </p>

          <div className="rise mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/kontakt"
              className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
            >
              Shooting anfragen
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            {phoneHref && (
              <a
                href={phoneHref}
                className="link-sweep self-start text-base font-medium text-ink/80 sm:ml-4 sm:self-auto"
              >
                {phoneDisplay}
              </a>
            )}
          </div>

          {/* Preisanker und Beleg – ohne Kasten, als ruhige Fußzeile. */}
          <div className="rise mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/12 pt-6 text-sm text-ink/62">
            <span>
              <strong className="font-medium text-ink">ab 200 €</strong> · feste
              Preise
            </span>
            <span>40 bearbeitete Bilder</span>
            {googleReviews && (
              <span>
                ★ {googleReviews.rating.toLocaleString("de-DE", {
                  minimumFractionDigits: 1,
                })}{" "}
                bei Google · {googleReviews.count} Bewertungen
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
