import Link from "next/link";
import type { Metadata } from "next";
import HeroSlider from "@/components/sections/HeroSlider";
import FeaturedImageWall from "@/components/sections/FeaturedImageWall";
import ReviewsSection from "@/components/sections/ReviewsSection";
import VoucherSection from "@/components/sections/VoucherSection";
import AboutEditorial from "@/components/sections/AboutEditorial";
import ServicesAccordion from "@/components/sections/ServicesAccordion";
import PromotionBar from "@/components/sections/PromotionBar";
import { getActivePromotions } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Fotografin Kaufbeuren & Allgäu | R.ArtPhotographie",
  description:
    "Professionelle Fotografin in Kaufbeuren & Allgäu für Portraits, Hochzeiten, Familie, Babybauch und Newborn. 5,0 Google Bewertung · 47 Rezensionen.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fotografin Kaufbeuren & Allgäu | R.ArtPhotographie",
    description:
      "Professionelle Fotografin in Kaufbeuren & Allgäu für Portraits, Hochzeiten, Familie, Babybauch und Newborn.",
    url: "/",
  },
};

export const revalidate = 0;

const faqItems = [
  {
    question: "Muss ich vor der Kamera Erfahrung haben?",
    answer:
      "Nein. Du musst nicht wissen, wie du posieren sollst. Ich leite dich ruhig an und gebe dir Orientierung.",
  },
  {
    question: "Wo finden Shootings statt?",
    answer:
      "In Kaufbeuren, im Allgäu, in Kempten, Marktoberdorf, Füssen und nach Absprache auch in München oder an deinem Wunschort.",
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
  const promotions = await getActivePromotions();
  const activePromotion = promotions[0] || null;

  return (
    <main className="bg-[#e7dfd3] text-black">
      <PromotionBar promotion={activePromotion} />
      <HeroSlider />

      <FeaturedImageWall />
      <ServicesAccordion />
      <AboutEditorial />

      <ReviewsSection />

      <section className="px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl border-y border-black/10 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-black/38">
                FAQ
              </p>
              <h2 className="mt-5 text-4xl font-light leading-[1] md:text-6xl">
                Fragen, bevor
                <br />
                du anfragst?
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-black/62 md:text-lg">
                Hier findest du die wichtigsten Antworten. Alles Weitere klären
                wir persönlich.
              </p>
            </div>

            <div className="divide-y divide-black/10">
              {faqItems.map((item) => (
                <div key={item.question} className="py-8 first:pt-0">
                  <h3 className="text-xl font-medium leading-tight text-black">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-black/64 md:text-base md:leading-8">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 lg:ml-[calc(42.5%+2rem)]">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90"
              style={{ color: "#ffffff" }}
            >
              Shooting anfragen
            </Link>

            <Link
              href="/gutscheine"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/25 bg-transparent px-8 py-4 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
            >
              Gutschein ansehen
            </Link>
          </div>
        </div>
      </section>

      <VoucherSection compact />
    </main>
  );
}
