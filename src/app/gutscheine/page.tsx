import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import VoucherCheckout from "@/components/vouchers/VoucherCheckout";
import VoucherPreview from "@/components/vouchers/VoucherPreview";
import { getVoucherDiscountPromotion } from "@/lib/promotions";
import { getActivePromotions } from "@/sanity/queries";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVoucherProductJsonLd,
  jsonLdScript,
} from "@/lib/schema";
import { phoneDisplay, phoneHref } from "@/lib/site";

export const metadata: Metadata = {
  /*
    Geschenksuchende formulieren anders als Shooting-Suchende: sie suchen nach
    "verschenken", "Geschenkidee", "Gutschein" – nicht nach "Fotograf". Und sie
    suchen oft kurzfristig, deshalb steht "sofort" im Titel.
  */
  title: "Gutschein Fotoshooting Kaufbeuren – sofort als PDF verschenken",
  description:
    "Fotoshooting verschenken in Kaufbeuren & Allgäu: Wertgutschein ab 50 € für Portrait, Paare, Familie, Babybauch oder Hochzeit. Sofort als PDF per E-Mail – auch als Last-Minute-Geschenk. 3 Jahre gültig.",
  keywords: [
    "Gutschein Fotoshooting Kaufbeuren",
    "Fotoshooting schenken Allgäu",
    "Geschenkidee Kaufbeuren",
    "Geschenkidee für Frauen Kaufbeuren",
    "Geschenkidee für Paare Allgäu",
    "Last Minute Geschenk Kaufbeuren",
    "Fotogutschein Allgäu",
    "Babybauch Shooting verschenken",
  ],
  alternates: { canonical: "/gutscheine" },
  openGraph: {
    title: "Gutschein Fotoshooting Kaufbeuren – sofort als PDF verschenken",
    description:
      "Wertgutschein ab 50 € für ein Fotoshooting in Kaufbeuren und im Allgäu. Sofort per E-Mail, 3 Jahre gültig.",
    url: "/gutscheine",
    images: [{ url: "/images/gutschein/gutschein-main.jpg" }],
  },
};

export const revalidate = 300;

/** Muss mit den Vorschlägen im Checkout übereinstimmen. */
const tiers = [
  { amount: 100, label: "Wertgutschein 100 €" },
  { amount: 200, label: "Wertgutschein 200 € – Portraitshooting" },
  { amount: 250, label: "Wertgutschein 250 € – Familienshooting" },
  { amount: 350, label: "Wertgutschein 350 € – Hochzeit Mini-Paket" },
];

/**
 * Anlässe. Jeder Block bedient eine eigene Suchintention und nennt einen
 * konkreten Betrag – ohne Anker orientiert sich der Käufer am Minimum.
 */
const occasions = [
  {
    title: "Zum Geburtstag",
    audience: "Für Frauen, Männer, beste Freundinnen",
    text: "Ein Geschenk, das nicht im Schrank landet. Statt eines Gegenstands ein Nachmittag, an dem sich jemand für zwei Stunden nur um schöne Bilder von dir kümmert. Besonders beliebt für runde Geburtstage.",
    hint: "Passender Betrag: 200 € für ein Portraitshooting",
  },
  {
    title: "Zur Schwangerschaft & zum Muttertag",
    audience: "Für werdende Mütter",
    text: "Der Babybauch ist nach ein paar Wochen weg – die Bilder bleiben. Ein Gutschein lässt sich schon früh verschenken, weil der Termin erst zwischen der 30. und 36. Woche stattfindet.",
    hint: "Passender Betrag: 200 € für ein Babybauchshooting",
  },
  {
    title: "Zur Geburt",
    audience: "Für frischgebackene Eltern",
    text: "Newborn-Aufnahmen gelingen am besten zwischen dem 5. und 14. Lebenstag. Mit einem Gutschein müssen die Eltern nichts planen, solange sie noch im Krankenhaus sind – sie melden sich einfach, wenn es passt.",
    hint: "Passender Betrag: 250 € für ein Newbornshooting",
  },
  {
    title: "Zur Hochzeit & zum Jahrestag",
    audience: "Für Paare",
    text: "Als Geschenk für das Brautpaar oder für den eigenen Jahrestag. Auch als Beitrag mehrerer Gäste zusammen – der Betrag ist frei wählbar und wird auf das gebuchte Paket angerechnet.",
    hint: "Passender Betrag: ab 350 € für Hochzeitsfotografie",
  },
  {
    title: "Zu Weihnachten",
    audience: "Für die ganze Familie",
    text: "Familienbilder, auf denen alle drauf sind – auch die, die sonst fotografieren. Der Gutschein kommt sofort als PDF, du kannst ihn ausdrucken und unter den Baum legen.",
    hint: "Passender Betrag: 250 € für ein Familienshooting",
  },
  {
    title: "Last Minute",
    audience: "Wenn es heute noch sein muss",
    text: "Kein Versand, keine Wartezeit, keine Öffnungszeiten. Nach der Zahlung liegt der Gutschein sofort zum Herunterladen bereit und zusätzlich in deinem Postfach. Auch am 24. Dezember um 22 Uhr.",
    hint: "Jeder Betrag ab 50 € möglich",
  },
];

const faq = [
  {
    question: "Wie schnell bekomme ich den Gutschein?",
    answer:
      "Sofort. Direkt nach der Zahlung kannst du den Gutschein als PDF herunterladen, zusätzlich bekommst du ihn per E-Mail. Damit eignet er sich auch als Geschenk in letzter Minute – es gibt keine Versandzeit und keine Öffnungszeiten.",
  },
  {
    question: "Muss ich eine Adresse angeben?",
    answer:
      "Nein. Der digitale Versand als PDF ist der Standard und braucht nur deine E-Mail-Adresse. Eine Anschrift wird ausschließlich dann abgefragt, wenn du zusätzlich einen gedruckten Gutschein per Post möchtest.",
  },
  {
    question: "Wie lange ist der Gutschein gültig?",
    answer:
      "Drei Jahre. Die Frist beginnt mit dem Schluss des Jahres, in dem der Gutschein ausgestellt wurde. Das genaue Ablaufdatum steht auf dem Gutschein.",
  },
  {
    question: "Wofür kann der Gutschein eingelöst werden?",
    answer:
      "Für jedes Shooting im Angebot: Portrait, Paarshooting, Familie, Babybauch, Newborn, Event oder Hochzeit. Der Betrag wird auf den Preis des gewählten Pakets angerechnet.",
  },
  {
    question: "Wie wird der Gutschein eingelöst?",
    answer:
      "Die beschenkte Person nennt bei der Anfrage einfach den Gutscheincode, der auf dem Gutschein steht. Danach stimmen wir Termin, Ort und Ablauf ab. Shootings finden in Kaufbeuren und im gesamten Ostallgäu statt.",
  },
  {
    question: "Kann ich einen beliebigen Betrag wählen?",
    answer:
      "Ja, ab 50 € ist jeder Betrag möglich. Als Orientierung: Ein Portraitshooting kostet 200 €, ein Familienshooting 250 €, Hochzeiten starten bei 350 €.",
  },
  {
    question: "Was passiert mit einem Restbetrag?",
    answer:
      "Liegt der Gutscheinwert über dem Preis des Shootings, bleibt das Restguthaben bis zum Ablauf der Gültigkeit erhalten. Eine Barauszahlung ist nicht möglich.",
  },
  {
    question: "Kann ich den Gutschein auch digital verschenken?",
    answer:
      "Ja. Das PDF lässt sich per Messenger oder E-Mail weiterleiten, genauso gut kannst du es ausdrucken. Auf Wunsch schicken wir zusätzlich einen gedruckten Gutschein per Post.",
  },
  {
    question: "Kann ich eine persönliche Nachricht daraufschreiben?",
    answer:
      "Ja. Beim Kauf kannst du eine Nachricht eingeben, die direkt auf dem Gutschein gedruckt wird – zusammen mit dem Namen der beschenkten Person.",
  },
];

export default async function GutscheinePage() {
  const activePromotions = await getActivePromotions();
  const voucherPromotion = getVoucherDiscountPromotion(activePromotions);

  return (
    <main className="bg-sand text-ink">
      <script
        {...jsonLdScript(
          buildVoucherProductJsonLd({ lowPrice: 50, highPrice: 1200, tiers })
        )}
      />
      <script {...jsonLdScript(buildFaqJsonLd(faq))} />
      <script
        {...jsonLdScript(
          buildBreadcrumbJsonLd([{ name: "Gutscheine", path: "/gutscheine" }])
        )}
      />

      <PageHeader
        eyebrow="Geschenkidee aus Kaufbeuren"
        heading="Ein Fotoshooting"
        accent="verschenken"
        intro="Wertgutschein ab 50 € für Portrait, Paare, Familie, Babybauch, Newborn oder Hochzeit – in Kaufbeuren und im ganzen Allgäu."
        image={{
          src: "/images/gutschein/gutschein-main.jpg",
          alt: "Fotoshooting-Gutschein von R.ArtPhotographie aus Kaufbeuren",
        }}
        meta="Sofort als PDF per E-Mail · zum Ausdrucken oder digital verschenken · 3 Jahre gültig · Endpreis, gemäß § 19 UStG ohne Umsatzsteuer"
        primaryAction={{ href: "#checkout", label: "Gutschein kaufen" }}
      />

      {/* Die drei Fragen, die Geschenksuchende zuerst stellen. */}
      <section className="bg-sand-deep px-[var(--shell-x)] py-16 md:py-20">
        <dl className="stagger mx-auto grid max-w-[110rem] gap-x-10 gap-y-10 sm:grid-cols-3">
          {[
            {
              label: "Sofort verfügbar",
              value:
                "Direkt nach der Zahlung als PDF. Auch am 24. Dezember noch rechtzeitig.",
            },
            {
              label: "Frei wählbar",
              value:
                "Jeder Betrag ab 50 €, einlösbar für jedes Shooting im Angebot.",
            },
            {
              label: "3 Jahre gültig",
              value:
                "Bis zum Schluss des dritten Jahres nach dem Kauf. Kein Zeitdruck.",
            },
          ].map((item) => (
            <div key={item.label} className="border-t border-ink/20 pt-5">
              <dt className="eyebrow text-ink/55">{item.label}</dt>
              <dd className="mt-3 text-lg leading-7 text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* VORSCHAU – zeigt vor dem Kauf, was der Beschenkte bekommt. */}
      <section className="bg-paper px-[var(--shell-x)] py-24 md:py-32">
        <div className="mx-auto grid max-w-[110rem] items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow rise text-ink/55">So sieht er aus</p>
            <h2 className="display-lg rise mt-5 text-ink">
              Kein Zettel.
              <br />
              Ein <span className="accent-italic">Geschenk</span>.
            </h2>
            <p className="rise mt-7 max-w-xl text-lg leading-8 text-ink/75">
              Der Gutschein kommt als fertig gestaltetes PDF im A4-Querformat –
              mit dem Namen der beschenkten Person, deiner persönlichen
              Nachricht und dem Einlösecode. Auf normalem Papier ausgedruckt
              sieht er aus wie hier.
            </p>

            <ul className="stagger mt-8 space-y-3 text-base leading-7 text-ink/78">
              {[
                "Name der beschenkten Person und dein Name stehen darauf",
                "Deine persönliche Nachricht wird mitgedruckt",
                "Ablaufdatum und Einlösecode sind fest vermerkt",
                "Druckt auf jedem Drucker, kein Spezialpapier nötig",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-ink/40">
                    –
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="#checkout"
              className="group rise mt-9 inline-flex min-h-[58px] items-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
            >
              Jetzt gestalten
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <figure className="unveil">
            <VoucherPreview className="w-full shadow-[0_30px_80px_rgba(22,18,15,0.16)]" />
            <figcaption className="mt-4 text-sm text-ink/60">
              Beispielgutschein. Betrag, Namen und Nachricht bestimmst du beim
              Kauf.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ANLÄSSE – je Block eine eigene Suchintention. */}
      <section className="bg-sand px-[var(--shell-x)] py-24 md:py-32">
        <div className="mx-auto max-w-[110rem]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow rise text-ink/55">Anlässe</p>
              <h2 className="display-lg rise mt-5 max-w-2xl text-ink">
                Wann ein Shooting das
                <br />
                <span className="accent-italic">bessere</span> Geschenk ist
              </h2>
            </div>
            <p className="rise max-w-sm text-base leading-8 text-ink/70">
              Für alle, die schon alles haben – und für alle, von denen es zu
              wenige gute Bilder gibt.
            </p>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map((occasion) => (
              <article key={occasion.title} className="border-t border-ink/15 pt-6">
                <h3 className="font-display text-2xl leading-tight text-ink">
                  {occasion.title}
                </h3>
                <p className="eyebrow mt-3 text-ink/55">{occasion.audience}</p>
                <p className="mt-4 text-base leading-7 text-ink/75">
                  {occasion.text}
                </p>
                <p className="mt-4 text-sm font-medium text-ink">
                  {occasion.hint}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[60svh]" />}>
        <VoucherCheckout promotion={voucherPromotion} />
      </Suspense>

      {/* SO LÄUFT ES AB */}
      <section className="bg-paper px-[var(--shell-x)] py-24 md:py-32">
        <div className="mx-auto max-w-[110rem]">
          <h2 className="display-lg rise text-ink">
            In drei Schritten <span className="accent-italic">verschenkt</span>
          </h2>

          <ol className="stagger mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Betrag und Namen eingeben",
                text: "Wunschbetrag wählen, Namen der beschenkten Person eintragen, optional eine persönliche Nachricht dazuschreiben.",
              },
              {
                title: "Sicher bezahlen",
                text: "Die Zahlung läuft über Stripe – Karte, Apple Pay, Klarna und weitere. Zahlungsdaten werden auf dieser Website nicht gespeichert.",
              },
              {
                title: "Sofort herunterladen",
                text: "Der Gutschein steht direkt zum Download bereit und liegt zusätzlich als PDF in deinem E-Mail-Postfach.",
              },
            ].map((step, index) => (
              <li key={step.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-lg text-paper">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-display text-2xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-ink/75">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sand px-[var(--shell-x)] py-24 md:py-32">
        <div className="mx-auto grid max-w-[110rem] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <h2 className="display-lg rise text-ink lg:sticky lg:top-32 lg:self-start">
            Fragen zum
            <br />
            <span className="accent-italic">Gutschein</span>
          </h2>

          <div className="divide-y divide-ink/12 border-y border-ink/12">
            {faq.map((item) => (
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

      <section className="bg-ink px-[var(--shell-x)] py-24 text-paper md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display-lg rise text-paper">
            Lieber selbst ein
            <br />
            <span className="accent-italic">Shooting?</span>
          </h2>
          <p className="rise mx-auto mt-7 max-w-2xl text-lg leading-8 text-paper/70">
            Feste Preise ab 200 €, unverbindliche Anfrage, Antwort in der Regel
            innerhalb von 24 Stunden.
          </p>
          <div className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="group inline-flex min-h-[58px] items-center gap-3 rounded-full bg-paper px-8 text-base font-medium text-ink transition-opacity duration-500 hover:opacity-90"
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
                className="link-sweep text-base font-medium text-paper/75"
              >
                {phoneDisplay}
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
