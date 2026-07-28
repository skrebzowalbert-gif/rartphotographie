import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import VoucherCheckout from "@/components/vouchers/VoucherCheckout";
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
  // Geschenksuchende suchen anders als Shooting-Suchende: nach "verschenken",
  // "Geschenkidee" und "Gutschein", nicht nach "Fotograf".
  title: "Fotoshooting Gutschein Kaufbeuren – sofort als PDF verschenken",
  description:
    "Fotoshooting verschenken: Wertgutschein ab 50 € für Portrait, Familie, Babybauch, Newborn oder Hochzeit in Kaufbeuren und im Allgäu. Sofort als PDF per E-Mail, 3 Jahre gültig.",
  keywords: [
    "Gutschein Fotoshooting Kaufbeuren",
    "Fotoshooting verschenken Allgäu",
    "Geschenkidee Fotoshooting",
    "Fotogutschein Kaufbeuren",
    "Babybauch Shooting verschenken",
  ],
  alternates: { canonical: "/gutscheine" },
  openGraph: {
    title: "Fotoshooting Gutschein Kaufbeuren – sofort als PDF",
    description:
      "Wertgutschein ab 50 € für ein Fotoshooting in Kaufbeuren und im Allgäu. Sofort per E-Mail, 3 Jahre gültig.",
    url: "/gutscheine",
    images: [{ url: "/images/gutschein/gutschein-main.jpg" }],
  },
};

export const revalidate = 300;

const faq = [
  {
    question: "Wie schnell bekomme ich den Gutschein?",
    answer:
      "Sofort. Direkt nach der Zahlung kannst du den Gutschein als PDF herunterladen, zusätzlich bekommst du ihn per E-Mail. Damit eignet er sich auch als Geschenk in letzter Minute.",
  },
  {
    question: "Muss ich eine Adresse angeben?",
    answer:
      "Nein. Der digitale Versand als PDF ist der Standard und braucht nur deine E-Mail-Adresse. Eine Anschrift wird nur benötigt, wenn du zusätzlich einen gedruckten Gutschein per Post möchtest.",
  },
  {
    question: "Wie lange ist der Gutschein gültig?",
    answer:
      "Drei Jahre. Die Frist beginnt mit dem Schluss des Jahres, in dem der Gutschein ausgestellt wurde. Das Ablaufdatum steht auf dem Gutschein.",
  },
  {
    question: "Wofür kann der Gutschein eingelöst werden?",
    answer:
      "Für jedes Shooting: Portrait, Familie, Babybauch, Newborn, Event oder Hochzeit. Der Betrag wird auf den Preis des gewählten Pakets angerechnet.",
  },
  {
    question: "Wie wird der Gutschein eingelöst?",
    answer:
      "Die beschenkte Person nennt bei der Anfrage einfach den Gutscheincode. Danach stimmen wir Termin, Ort und Ablauf ab.",
  },
  {
    question: "Kann ich einen beliebigen Betrag wählen?",
    answer:
      "Ja, ab 50 € ist jeder Betrag möglich. Als Orientierung: Ein Portraitshooting kostet 200 €, ein Familienshooting 250 €, Hochzeiten starten bei 350 €.",
  },
  {
    question: "Ist ein Restbetrag verfügbar?",
    answer:
      "Ja. Liegt der Gutscheinwert über dem Preis des Shootings, bleibt das Restguthaben bis zum Ablauf der Gültigkeit erhalten. Eine Barauszahlung ist nicht möglich.",
  },
];

export default async function GutscheinePage() {
  const activePromotions = await getActivePromotions();
  const voucherPromotion = getVoucherDiscountPromotion(activePromotions);

  return (
    <main className="bg-sand text-ink">
      <script
        {...jsonLdScript(
          buildVoucherProductJsonLd({ lowPrice: 50, highPrice: 1200 })
        )}
      />
      <script {...jsonLdScript(buildFaqJsonLd(faq))} />
      <script
        {...jsonLdScript(
          buildBreadcrumbJsonLd([
            { name: "Gutscheine", path: "/gutscheine" },
          ])
        )}
      />

      <PageHeader
        eyebrow="Geschenkidee"
        heading="Ein Fotoshooting"
        accent="verschenken"
        intro="Wertgutschein ab 50 € für Portrait, Familie, Babybauch, Newborn oder Hochzeit in Kaufbeuren und im Allgäu."
        image={{
          src: "/images/gutschein/gutschein-main.jpg",
          alt: "Fotoshooting-Gutschein von R.ArtPhotographie aus Kaufbeuren",
        }}
        meta="Sofort als PDF per E-Mail · zum Ausdrucken oder digital verschenken · 3 Jahre gültig"
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

      <Suspense fallback={<div className="min-h-[60svh]" />}>
        <VoucherCheckout promotion={voucherPromotion} />
      </Suspense>

      <section className="bg-paper px-[var(--shell-x)] py-24 md:py-32">
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
