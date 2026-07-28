import Image from "next/image";
import Link from "next/link";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
  jsonLdScript,
} from "@/lib/schema";
import { areaServed, phoneDisplay, phoneHref } from "@/lib/site";

export type ShootingLandingContent = {
  /** Pfad, z. B. "/babybauch-shooting-kaufbeuren" */
  path: string;
  /** Sichtbare H1. Enthält das Hauptkeyword. */
  heading: string;
  /** Kurzer Einstieg unter der H1. */
  intro: string;
  /** Name der Leistung für das Service-Markup. */
  serviceName: string;
  serviceDescription: string;
  /** Vorauswahl im Kontaktformular (muss in SHOOTING_TYPES existieren). */
  requestValue: string;
  price: string;
  duration: string;
  included: string;
  image: { src: string; alt: string };
  /** Zweites Motiv, das den Fließtext aufbricht. */
  secondaryImage?: { src: string; alt: string };
  sections: { heading: string; paragraphs: string[] }[];
  facts: { label: string; value: string }[];
  faq: { question: string; answer: string }[];
  related: { href: string; label: string }[];
};

/**
 * Vorlage der Shooting-Landingpages.
 *
 * Der erste Entwurf war typografisch sauber, gestalterisch aber ein
 * Dokument: eine lange Textspalte, ein Kasten mit Eckdaten, ein Kasten mit
 * CTA. Diese Fassung arbeitet mit denselben Mitteln wie die Startseite –
 * randlose Bilder, Kontrastwechsel zwischen den Sektionen, Bewegung beim
 * Scrollen und ein zweites Motiv, das den Lesefluss aufbricht.
 */
export default function ShootingLandingPage({
  content,
}: {
  content: ShootingLandingContent;
}) {
  const [firstBlock, ...restBlocks] = content.sections;

  return (
    <main className="bg-sand text-ink">
      <script
        {...jsonLdScript(
          buildServiceJsonLd({
            name: content.serviceName,
            description: content.serviceDescription,
            path: content.path,
            city: "Kaufbeuren",
          })
        )}
      />
      <script
        {...jsonLdScript(
          buildBreadcrumbJsonLd([
            { name: content.serviceName, path: content.path },
          ])
        )}
      />
      <script {...jsonLdScript(buildFaqJsonLd(content.faq))} />

      {/* HERO – Bild randlos, wie auf der Startseite */}
      <section className="relative overflow-hidden bg-sand">
        <div className="mx-auto grid max-w-[110rem] items-stretch lg:min-h-[84svh] lg:grid-cols-[1fr_1fr]">
          <div className="relative order-1 h-[46svh] min-h-[320px] w-full lg:order-2 lg:h-auto">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="drift object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,var(--color-sand),transparent)] lg:hidden" />
          </div>

          <div className="order-2 flex flex-col justify-center px-[var(--shell-x)] pb-16 pt-12 lg:order-1 lg:py-24 lg:pr-0">
            <p className="eyebrow rise text-ink/55">Kaufbeuren &amp; Ostallgäu</p>

            <h1 className="display-hero rise mt-6 text-ink">
              {content.heading}
            </h1>

            <p className="rise mt-7 max-w-xl text-lg leading-8 text-ink/75">
              {content.intro}
            </p>

            <div className="rise mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={`/kontakt?shooting=${encodeURIComponent(
                  content.requestValue
                )}`}
                className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
              >
                Termin anfragen
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

            <p className="rise mt-8 border-t border-ink/12 pt-6 text-sm text-ink/62">
              {content.duration} · <strong className="font-medium text-ink">
                {content.price}
              </strong>{" "}
              · {content.included} · unverbindliche Anfrage
            </p>
          </div>
        </div>
      </section>

      {/* ECKDATEN – als Linienraster, nicht als Kasten */}
      <section className="bg-sand-deep px-[var(--shell-x)] py-16 md:py-20">
        <dl className="stagger mx-auto grid max-w-[110rem] gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {content.facts.map((fact) => (
            <div key={fact.label} className="border-t border-ink/20 pt-5">
              <dt className="eyebrow text-ink/55">{fact.label}</dt>
              <dd className="mt-3 text-lg leading-7 text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ERSTER TEXTBLOCK + zweites Motiv daneben */}
      <section className="bg-paper px-[var(--shell-x)] py-24 md:py-32">
        <div className="mx-auto grid max-w-[110rem] gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <h2 className="display-lg rise text-ink">{firstBlock.heading}</h2>
            <div className="stagger mt-8 max-w-2xl space-y-6 text-lg leading-8 text-ink/75">
              {firstBlock.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>

          {content.secondaryImage && (
            <div className="unveil relative aspect-[3/4] w-full lg:-mr-[var(--shell-x)]">
              <Image
                src={content.secondaryImage.src}
                alt={content.secondaryImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* WEITERE TEXTBLÖCKE – schmale Lesespalte */}
      <section className="bg-paper px-[var(--shell-x)] pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl">
          {restBlocks.map((section) => (
            <div key={section.heading} className="mb-16 last:mb-0">
              <h2 className="display-lg rise text-ink">{section.heading}</h2>
              <div className="stagger mt-7 space-y-6 text-lg leading-8 text-ink/75">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand px-[var(--shell-x)] py-24 md:py-32">
        <div className="mx-auto grid max-w-[110rem] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <h2 className="display-lg rise text-ink lg:sticky lg:top-32 lg:self-start">
            Häufige
            <br />
            <span className="accent-italic">Fragen</span>
          </h2>

          <div className="divide-y divide-ink/12 border-y border-ink/12">
            {content.faq.map((item) => (
              <details key={item.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <h3 className="font-display text-xl leading-snug text-ink">
                    {item.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-2xl leading-none text-ink/35 transition-transform duration-500 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-base leading-8 text-ink/72">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ABSCHLUSS – dunkel, damit die Seite nicht im Beige ausläuft */}
      <section className="bg-ink px-[var(--shell-x)] py-24 text-paper md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display-lg rise text-paper">
            Termin für dein Shooting
            <br />
            <span className="accent-italic">sichern</span>
          </h2>

          <p className="rise mx-auto mt-7 max-w-2xl text-lg leading-8 text-paper/70">
            Shootings finden in {areaServed.slice(0, 6).join(", ")} und im
            gesamten Ostallgäu statt. Weitere Orte nach Absprache.
          </p>

          <div className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/kontakt?shooting=${encodeURIComponent(
                content.requestValue
              )}`}
              className="group inline-flex min-h-[58px] items-center gap-3 rounded-full bg-paper px-8 text-base font-medium text-ink transition-opacity duration-500 hover:opacity-90"
            >
              Termin anfragen
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
                className="link-sweep text-base font-medium text-paper/75"
              >
                {phoneDisplay}
              </a>
            )}
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-paper/15 pt-8 text-sm text-paper/60">
            {content.related.map((link) => (
              <Link key={link.href} href={link.href} className="link-sweep">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
