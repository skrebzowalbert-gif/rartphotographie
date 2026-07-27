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
  /** Pfad ohne führenden Slash-Trailing, z. B. "/babybauch-shooting-kaufbeuren" */
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
  /** Fließtext-Abschnitte mit echtem Informationsgehalt. */
  sections: { heading: string; paragraphs: string[] }[];
  /** Stichpunkte "Das solltest du wissen". */
  facts: { label: string; value: string }[];
  faq: { question: string; answer: string }[];
  /** Verwandte Seiten für die interne Verlinkung. */
  related: { href: string; label: string }[];
};

export default function ShootingLandingPage({
  content,
}: {
  content: ShootingLandingContent;
}) {
  return (
    <main className="bg-[#e7dfd3] pb-24 text-black">
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

      {/* HERO */}
      <section className="px-6 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-black/65">
              Kaufbeuren &amp; Ostallgäu
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-light leading-[1.03] md:text-[3.4rem]">
              {content.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/78">
              {content.intro}
            </p>

            <p className="mt-5 text-base font-medium">
              {content.duration} · {content.price} · {content.included}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/kontakt?shooting=${encodeURIComponent(
                  content.requestValue
                )}`}
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-7 text-base font-medium text-white transition hover:bg-black/85"
              >
                Termin anfragen
              </Link>
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/30 px-7 text-base font-medium transition hover:border-black/60"
                >
                  {phoneDisplay}
                </a>
              )}
            </div>

            <p className="mt-4 text-sm text-black/70">
              Unverbindlich und kostenlos · Antwort in der Regel innerhalb von
              24 Stunden
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* FAKTEN */}
      <section className="px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <dl className="grid gap-6 rounded-xl border border-black/12 bg-white/45 p-7 sm:grid-cols-2 lg:grid-cols-4 md:p-9">
            {content.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm font-semibold uppercase tracking-[0.16em] text-black/70">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[15px] leading-7 text-black/80">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FLIESSTEXT */}
      <section className="px-6 pb-4 md:px-10">
        <div className="mx-auto max-w-3xl">
          {content.sections.map((section) => (
            <div key={section.heading} className="mb-12">
              <h2 className="text-3xl font-light leading-tight md:text-4xl">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-black/78 md:text-lg">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-light md:text-4xl">Häufige Fragen</h2>
          <div className="mt-8 divide-y divide-black/12 border-y border-black/12">
            {content.faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-medium">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-xl leading-none text-black/50 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-base leading-8 text-black/78">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* EINZUGSGEBIET + ABSCHLUSS-CTA */}
      <section className="px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl rounded-xl border border-black/12 bg-white/45 p-8 text-center md:p-12">
          <h2 className="text-3xl font-light md:text-4xl">
            Termin für dein Shooting sichern
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-black/78">
            Shootings finden in {areaServed.slice(0, 6).join(", ")} und im
            gesamten Ostallgäu statt. Weitere Orte nach Absprache.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/kontakt?shooting=${encodeURIComponent(
                content.requestValue
              )}`}
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition hover:bg-black/85"
            >
              Termin anfragen
            </Link>
            <Link
              href="/preise"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/30 px-8 text-base font-medium transition hover:border-black/60"
            >
              Alle Preise ansehen
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-black/70">
            {content.related.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline underline-offset-4 hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
