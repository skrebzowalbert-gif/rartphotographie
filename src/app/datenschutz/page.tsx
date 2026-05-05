import { publicContactEmail } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von R.ArtPhotographie in Kaufbeuren.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd3] px-6 pb-24 text-black md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.35em] text-black/40">
          Rechtliches
        </p>

        <h1 className="mt-4 text-4xl font-light md:text-6xl">
          Datenschutzerklärung
        </h1>

        <div className="mt-12 space-y-10 text-base leading-8 text-black/75">
          <section>
            <h2 className="text-2xl font-medium text-black">
              1. Allgemeine Hinweise
            </h2>
            <p className="mt-4">
              Der Schutz deiner persönlichen Daten ist wichtig. Personenbezogene Daten
              werden auf dieser Website nur im technisch notwendigen Umfang sowie im
              Rahmen deiner Anfrage verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              2. Verantwortliche Stelle
            </h2>
            <div className="mt-4">
              <p>Regina Gerdt</p>
              <p>R.ArtPhotographie</p>
              <p>Hirtenstraße 16</p>
              <p>87600 Kaufbeuren</p>
              <p className="break-words [overflow-wrap:anywhere]">
                E-Mail: {publicContactEmail}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              3. Erhebung und Verarbeitung personenbezogener Daten
            </h2>
            <p className="mt-4">
              Personenbezogene Daten werden nur dann erhoben, wenn du sie im Rahmen
              einer Anfrage freiwillig mitteilst, zum Beispiel über das Kontaktformular.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              4. Kontaktformular
            </h2>
            <p className="mt-4">
              Wenn du das Kontaktformular nutzt, werden die von dir eingegebenen Daten
              zur Bearbeitung deiner Anfrage und für den Fall von Anschlussfragen
              gespeichert und verarbeitet.
            </p>
            <p className="mt-4">
              Dazu gehören insbesondere Name, E-Mail-Adresse, Telefonnummer
              (sofern angegeben), Kategorie der Anfrage und der Inhalt deiner Nachricht.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              5. Zweck der Datenverarbeitung
            </h2>
            <p className="mt-4">
              Die Verarbeitung erfolgt ausschließlich zum Zweck der Bearbeitung
              von Anfragen, der Kommunikation mit Interessenten und der
              Vorbereitung möglicher Aufträge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              6. Externe Links
            </h2>
            <p className="mt-4">
              Auf dieser Website befinden sich Links zu externen Plattformen,
              insbesondere zu Instagram. Beim Anklicken eines solchen Links verlässt
              du diese Website. Für die Datenverarbeitung auf den externen Plattformen
              sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              7. Speicherung und Löschung
            </h2>
            <p className="mt-4">
              Personenbezogene Daten werden nur so lange gespeichert, wie dies zur
              Bearbeitung der Anfrage erforderlich ist oder gesetzliche
              Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              8. Rechte der betroffenen Personen
            </h2>
            <p className="mt-4">
              Du hast das Recht auf Auskunft über die bei uns gespeicherten
              personenbezogenen Daten sowie auf Berichtigung, Löschung,
              Einschränkung der Verarbeitung und Widerspruch gegen die Verarbeitung
              im Rahmen der gesetzlichen Vorschriften.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              9. Beschwerderecht
            </h2>
            <p className="mt-4">
              Du hast das Recht, dich bei einer zuständigen Datenschutzaufsichtsbehörde
              über die Verarbeitung deiner personenbezogenen Daten zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              10. Hosting
            </h2>
            <p className="mt-4">
              Diese Website wird technisch über die Agentur KS Web Performance
              betreut und gehostet. Im Rahmen des Hostings können technisch
              erforderliche Verbindungsdaten verarbeitet werden.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
