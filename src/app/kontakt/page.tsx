import type { Metadata } from "next";
import KontaktPageContent from "@/components/contact/KontaktPageContent";

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

export default function KontaktPage() {
  return <KontaktPageContent />;
}
