import type { Metadata } from "next";
import Link from "next/link";
import PartnersSection from "@/components/sections/PartnersSection";
import { getActivePartners } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Partner rund um Hochzeit & Shooting | R.ArtPhotographie",
  description:
    "Ausgewählte Partner von R.ArtPhotographie rund um Hochzeit, Locations, Floristik, Make-up, Video, Musik und besondere Momente in Kaufbeuren und im Allgäu.",
  alternates: { canonical: "/partner" },
  openGraph: {
    title: "Partner | R.ArtPhotographie",
    description:
      "Eine kuratierte Auswahl an Dienstleistern und Orten, mit denen R.ArtPhotographie vertrauensvoll zusammenarbeitet.",
    url: "/partner",
  },
};

export default async function PartnerPage() {
  const partners = await getActivePartners();

  return (
    <main className="bg-[#e7dfd3] text-black">
      <section className="px-6 pb-10 md:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-black/38">
            Netzwerk
          </p>
          <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
            Partner rund um besondere Momente
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-black/62 md:text-lg">
            Eine kuratierte Auswahl an Dienstleistern und Orten, mit denen wir
            vertrauensvoll zusammenarbeiten.
          </p>
        </div>
      </section>

      {partners.length > 0 ? (
        <PartnersSection
          partners={partners}
          eyebrow="Übersicht"
          title="Ausgewählte Partner"
          intro="Die externen Angebote werden direkt über den jeweiligen Partner angefragt. R.ArtPhotographie bleibt dabei klar Fotografie-Ansprechpartner."
        />
      ) : (
        <section className="px-6 py-16 md:px-10">
          <div className="mx-auto max-w-3xl border-y border-black/10 py-12 text-center">
            <p className="text-base leading-8 text-black/62">
              Die Partnerübersicht wird gerade vorbereitet.
            </p>
            <Link
              href="/kontakt"
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ color: "#ffffff" }}
            >
              Anfrage senden
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
