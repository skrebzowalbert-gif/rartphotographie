import PageHeader from "@/components/layout/PageHeader";
import type { Metadata } from "next";
import { Suspense } from "react";
import VoucherSection from "@/components/sections/VoucherSection";
import VoucherCheckout from "@/components/vouchers/VoucherCheckout";
import { getVoucherDiscountPromotion } from "@/lib/promotions";
import { getActivePromotions } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Wertgutschein Kaufbeuren kaufen",
  description:
    "Wertgutschein ab 50 € für Fotografie bei R.ArtPhotographie in Kaufbeuren und im Allgäu kaufen. Sicher bezahlen und hochwertig vorbereiten lassen.",
  alternates: { canonical: "/gutscheine" },
  openGraph: {
    title: "Gutscheine | R.ArtPhotographie",
    description:
      "Frei wählbarer Wertgutschein ab 50 € für Fotografie in Kaufbeuren und im Allgäu.",
    url: "/gutscheine",
  },
};

// Gutscheinseite haengt nur an der Aktionsliste - ISR statt Rendern pro Aufruf.
export const revalidate = 300;

export default async function GutscheinePage() {
  const activePromotions = await getActivePromotions();
  const voucherPromotion = getVoucherDiscountPromotion(activePromotions);

  return (
    <main className="bg-sand pb-24 text-ink">
      <PageHeader
        eyebrow="Gutscheine"
        heading="Ein Shooting"
        accent="verschenken"
        intro="Ein Wertgutschein ab 50 €, frei einsetzbar für Portrait, Familie, Babybauch, Newborn oder Hochzeit. Drei Jahre gültig."
        image={{
          src: "/images/gutschein/gutschein-main.jpg",
          alt: "Fotogutschein von R.ArtPhotographie aus Kaufbeuren",
        }}
        primaryAction={{ href: "#checkout", label: "Wertgutschein kaufen" }}
      />

      {/* VoucherCheckout liest Suchparameter und braucht daher eine Grenze. */}
      <Suspense fallback={<div className="min-h-[60svh]" />}>
        <VoucherCheckout promotion={voucherPromotion} />
      </Suspense>

      <VoucherSection compact />
    </main>
  );
}
