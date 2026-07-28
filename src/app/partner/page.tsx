import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import PartnersSection from "@/components/sections/PartnersSection";
import { getActivePartners } from "@/sanity/queries";
import { phoneDisplay, phoneHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner rund um Hochzeit & Shooting",
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
    <main className="bg-sand text-ink">
      <PageHeader
        eyebrow="Partner"
        heading="Menschen, mit denen wir"
        accent="zusammenarbeiten"
        intro="Für einen besonderen Tag braucht es mehr als Fotografie. Diese Partner empfehlen wir aus eigener Zusammenarbeit."
      />

      {partners.length > 0 ? (
        <PartnersSection
          partners={partners}
          eyebrow="Übersicht"
          title="Ausgewählte Partner"
          intro="Die externen Angebote werden direkt über den jeweiligen Partner angefragt. R.ArtPhotographie bleibt dabei klar Fotografie-Ansprechpartner."
        />
      ) : (
        <section className="px-[var(--shell-x)] py-16 md:py-24">
          <p className="mx-auto max-w-3xl border-y border-ink/12 py-12 text-center text-lg leading-8 text-ink/70">
            Die Partnerübersicht wird gerade vorbereitet.
          </p>
        </section>
      )}

      {/*
        Vorher endete diese Seite ohne Abschluss – jede Partnerkarte verlinkt
        nach extern, die Seite holte den Besucher aber nie zurück.
      */}
      <section className="bg-ink px-[var(--shell-x)] py-24 text-paper md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display-lg rise text-paper">
            Und die <span className="accent-italic">Fotos?</span>
          </h2>
          <p className="rise mx-auto mt-7 max-w-2xl text-lg leading-8 text-paper/70">
            Die übernehme ich. Erzähl kurz, was ihr vorhabt – unverbindlich
            und in der Regel innerhalb von 24 Stunden beantwortet.
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
