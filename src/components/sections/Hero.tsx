import Link from "next/link";
import Image from "next/image";
import { googleReviews, phoneDisplay, phoneHref } from "@/lib/site";

/**
 * Startseiten-Hero.
 *
 * Ersetzt den vorherigen Auto-Slider. Drei Gründe:
 *
 * 1. Motiv: Die drei bisherigen Hero-Bilder waren entsättigte Fashion-
 *    Studioaufnahmen, zwei davon mit Wasserzeichen. Verkauft werden aber
 *    Familien-, Babybauch- und Newborn-Shootings. Bild und Versprechen
 *    widersprachen sich im ersten Moment.
 * 2. Auto-Rotation alle 4,2 s verschiebt das LCP-Element, verhindert ruhiges
 *    Lesen und liest sich als Unentschlossenheit.
 * 3. Ohne Slider ist der Hero eine Server-Komponente: kein Client-JS,
 *    kein useEffect, schnelleres LCP.
 *
 * Layout: Das Motiv liegt im Hochformat (1440x1786) vor. Ein vollflächiger
 * Querformat-Hero würde daraus einen Streifen schneiden und die Gesichter
 * verlieren. Deshalb auf Desktop ein geteiltes Layout mit stehendem Bild,
 * auf Mobile vollflächig – dort passt das Hochformat ohnehin.
 */
const HERO_IMAGE = {
  src: "/images/babybauch/babybauch-1.jpg",
  alt: "Babybauchshooting in Kaufbeuren: werdende Eltern halten gemeinsam Babyschuhe vor dem Bauch – fotografiert von R.ArtPhotographie",
};

export default function Hero() {
  return (
    <section className="relative bg-[#e7dfd3]">
      <div className="mx-auto grid max-w-7xl items-stretch gap-0 lg:grid-cols-2">
        {/* TEXT */}
        <div className="relative z-10 order-2 flex flex-col justify-center px-6 pb-16 pt-10 md:px-10 lg:order-1 lg:py-24 lg:pr-14">
          <p className="text-sm uppercase tracking-[0.3em] text-black/65">
            R.ArtPhotographie
          </p>

          <h1 className="mt-5 text-[2.4rem] font-light leading-[1.04] text-black sm:text-5xl md:mt-6 lg:text-[3.6rem]">
            Fotograf in Kaufbeuren
            <br />
            &amp; im Allgäu
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-black/75 md:text-lg">
            Babybauch, Newborn, Familie, Portrait und Hochzeit. Ruhig
            begleitet, in Kaufbeuren, im Ostallgäu und im gesamten Allgäu.
          </p>

          {/* Preisanker direkt im ersten Bildschirm: qualifiziert vor. */}
          <p className="mt-4 text-base font-medium text-black">
            Feste Preise ab 200 € · 40 bearbeitete Bilder · Antwort in der
            Regel innerhalb von 24 Stunden
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition hover:bg-black/85"
            >
              Shooting anfragen
            </Link>

            {phoneHref && (
              <a
                href={phoneHref}
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/30 px-8 text-base font-medium text-black transition hover:border-black/60"
              >
                {phoneDisplay}
              </a>
            )}
          </div>

          {googleReviews && (
            <p className="mt-7 text-sm leading-6 text-black/70">
              {[
                `★ ${googleReviews.rating.toLocaleString("de-DE", {
                  minimumFractionDigits: 1,
                })} bei Google`,
                `${googleReviews.count} Bewertungen`,
                "Kaufbeuren & Allgäu",
              ].join(" · ")}
            </p>
          )}
        </div>

        {/* BILD */}
        {/*
          Auf Mobile bewusst knapp gehalten: Überschrift, Preisanker und CTA
          sollen ohne Scrollen erreichbar bleiben.
        */}
        <div className="relative order-1 h-[42svh] min-h-[300px] w-full lg:order-2 lg:h-auto lg:min-h-[640px]">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[50%_28%] lg:object-center"
          />
          {/* Nur auf Mobile: weicher Übergang in den Textbereich darunter. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,#e7dfd3_0%,rgba(231,223,211,0)_100%)] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
