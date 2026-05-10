import type { Metadata } from "next";
import KontaktPageContent from "@/components/contact/KontaktPageContent";
import PartnersSection from "@/components/sections/PartnersSection";
import { getContactPartners } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Kontakt & Shooting anfragen | R.ArtPhotographie",
  description:
    "Fotografin in Kaufbeuren kontaktieren: Portraitshooting, Hochzeit im Allgäu, Familie, Babybauch oder Newborn bei R.ArtPhotographie anfragen.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt & Shooting anfragen | R.ArtPhotographie",
    description:
      "Sende deine Anfrage für Portrait, Hochzeit, Familie, Babybauch oder Newborn in Kaufbeuren und im Allgäu.",
    url: "/kontakt",
  },
};

export default async function KontaktPage() {
  const partners = await getContactPartners();

  return (
    <>
      <KontaktPageContent />
      <PartnersSection
        partners={partners}
        title="Partner für besondere Anfragen"
        intro="Falls dein Shooting Teil eines größeren Tages ist, findest du hier ausgewählte Kontakte aus unserem Netzwerk."
        compact
      />
    </>
  );
}
