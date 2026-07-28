import Link from "next/link";
import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import SelectedWork from "@/components/sections/SelectedWork";
import ReviewsSection from "@/components/sections/ReviewsSection";
import VoucherSection from "@/components/sections/VoucherSection";
import AboutEditorial from "@/components/sections/AboutEditorial";
import ServicesAccordion from "@/components/sections/ServicesAccordion";
import PromotionBar from "@/components/sections/PromotionBar";
import PartnersSection from "@/components/sections/PartnersSection";
import { getActivePromotions, getHomepagePartners } from "@/sanity/queries";
import { buildFaqJsonLd, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  // Der Root-Title greift hier bewusst ohne Template, damit das wichtigste
  // Keyword ganz vorne steht.
  title: {
    absolute: "Fotograf Kaufbeuren – Portrait, Hochzeit & Familie | R.ArtPhotographie",
  },
  description:
    "Fotograf in Kaufbeuren für Portrait, Hochzeit, Familie, Babybauch und Newborn. Feste Preise ab 200 €, persönliche Begleitung. Jetzt Shooting anfragen.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fotograf Kaufbeuren – Portrait, Hochzeit & Familie",
    description:
      "Fotograf in Kaufbeuren und im Allgäu für Portrait, Hochzeit, Familie, Babybauch und Newborn. Feste Preise ab 200 €.",
    url: "/",
  },
};

// Die Startseite ist bis auf Aktionsbanner und Partnerliste statisch.
// revalidate = 0 hat sie bei JEDEM Aufruf neu rendern lassen (kein CDN-Cache).
export const revalidate = 600;

const faqItems = [
  {
    question: "Was kostet ein Fotoshooting in Kaufbeuren?",
    answer:
      "Ein Portraitshooting startet bei 200 €, ein Familienshooting bei 250 €. Hochzeiten beginnen bei 350 € für das Mini-Paket und reichen bis 1.200 € für die ganztägige Begleitung. Alle Preise stehen offen auf der Preis-Seite, es gibt keine versteckten Kosten.",
  },
  {
    question: "Muss ich vor der Kamera Erfahrung haben?",
    answer:
      "Nein. Du musst nicht wissen, wie du posieren sollst. Ich leite dich ruhig an und gebe dir Orientierung.",
  },
  {
    question: "Wo finden Shootings statt?",
    answer:
      "In Kaufbeuren, Neugablonz, Marktoberdorf, Buchloe, Biessenhofen, Kempten, Füssen und im gesamten Ostallgäu. Nach Absprache auch in München oder an deinem Wunschort.",
  },
  {
    question: "Wie schnell bekomme ich eine Antwort auf meine Anfrage?",
    answer:
      "In der Regel innerhalb von 24 Stunden. Du bekommst sofort nach dem Absenden eine Bestätigung per E-Mail, danach meldet sich Regina persönlich.",
  },
  {
    question: "Wie lange dauert die Bildbearbeitung?",
    answer:
      "Das hängt vom Shooting ab. Du bekommst vorab eine realistische Einschätzung.",
  },
  {
    question: "Wie viele Bilder bekomme ich?",
    answer:
      "Bei den meisten Shootings sind 40 bearbeitete Bilder enthalten. Details findest du auf der Preis-Seite.",
  },
  {
    question: "Was passiert bei schlechtem Wetter?",
    answer:
      "Wir prüfen gemeinsam, ob ein anderer Ort, ein Indoor-Shooting oder ein neuer Termin sinnvoll ist.",
  },
  {
    question: "Kann ich einen Gutschein verschenken?",
    answer:
      "Ja. Wertgutscheine sind direkt online kaufbar und können für Portrait, Familie, Babybauch, Newborn oder Hochzeit eingesetzt werden.",
  },
];

export default async function Home() {
  const [promotions, partners] = await Promise.all([
    getActivePromotions(),
    getHomepagePartners(),
  ]);
  const activePromotion = promotions[0] || null;

  return (
    <main className="bg-sand text-ink">
      <script {...jsonLdScript(buildFaqJsonLd(faqItems))} />
      <PromotionBar promotion={activePromotion} />
      <Hero />

      {/*
        Reihenfolge nach Kaufentscheidung: erst zeigen, was sie bekommt
        (Arbeiten), dann was es gibt (Leistungen), dann wer dahintersteht,
        dann der Beleg von Dritten.
      */}
      <SelectedWork />
      <ServicesAccordion />
      <AboutEditorial />

      <ReviewsSection />

      <PartnersSection
        partners={partners}
        title="Partner, denen wir vertrauen"
        intro="Für besondere Tage ist oft mehr wichtig als Fotografie. Hier zeigen wir ausgewählte Partner, mit denen R.ArtPhotographie vertrauensvoll zusammenarbeitet."
        compact
      />

      <section className="bg-sand px-[var(--shell-x)] py-24 md:py-36">
        <div className="mx-auto grid max-w-[110rem] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow rise text-ink/55">Fragen</p>
            <h2 className="display-lg rise mt-5 text-ink">
              Bevor du
              <br />
              <span className="accent-italic">anfragst</span>
            </h2>
            <p className="rise mt-6 max-w-md text-lg leading-8 text-ink/72">
              Die häufigsten Fragen, offen beantwortet. Alles Weitere klären
              wir persönlich.
            </p>

            <Link
              href="/kontakt"
              className="group rise mt-8 inline-flex min-h-[58px] items-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
            >
              Shooting anfragen
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          {/* Aufklappbar statt acht offene Blöcke: die Sektion war vorher
              die längste der Seite und drückte den Abschluss nach unten. */}
          <div className="divide-y divide-ink/12 border-y border-ink/12">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-xl text-ink">
                  <h3 className="font-display text-xl leading-snug">
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

      <VoucherSection compact />
    </main>
  );
}
