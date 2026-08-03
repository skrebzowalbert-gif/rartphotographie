import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import GalleryClient from "@/components/gallery/GalleryClient";
import GalleryDownload from "@/components/gallery/GalleryDownload";
import ProduktBereich from "@/components/shop/ProduktBereich";
import { enddateien } from "@/lib/portal/downloads";
import { PAKET_GRENZE_BYTES } from "@/lib/portal/zip";
import GalleryLogin from "@/components/gallery/GalleryLogin";
import { getGallerySession } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Eure Galerie",
  /*
    Kundengalerien gehören unter keinen Umständen in eine Suchmaschine.
    Selbst der Titel wäre eine Aussage darüber, wer wann geheiratet hat.
  */
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function GaleriePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project] = await db()
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      status: schema.projects.status,
      selectionLimit: schema.projects.selectionLimit,
      /*
        Ob die Galerie abgelaufen ist, entscheidet die Datenbank.

        Die naheliegende Prüfung im Bauteil – expiresAt < Date.now() – ist beim
        Rendern unrein und benutzt zudem die Zeit des Betrachters statt der des
        Servers. Wer die Uhr seines Rechners zurückstellt, käme sonst in eine
        längst abgelaufene Galerie.
      */
      expired: sql<boolean>`${schema.projects.expiresAt} < now()`,
      selectionSubmittedAt: schema.projects.selectionSubmittedAt,
    })
    .from(schema.projects)
    .where(eq(schema.projects.slug, slug))
    .limit(1);

  if (!project) notFound();

  const session = await getGallerySession(project.id);

  // Ohne Sitzung nur die Passwortseite – und ohne jeden Hinweis darauf, ob es
  // hier überhaupt Bilder gibt.
  if (!session) {
    return (
      <main className="min-h-screen bg-ink px-[var(--shell-x)] text-paper">
        <GalleryLogin slug={slug} title={project.title} />
      </main>
    );
  }

  if (project.expired) {
    return (
      <Hinweis
        titel="Diese Galerie ist abgelaufen"
        text="Die Bilder wurden nach Ablauf der vereinbarten Frist gelöscht. Melde dich bei Regina, wenn du sie noch brauchst."
      />
    );
  }

  const assets = await db()
    .select({
      id: schema.assets.id,
      fileName: schema.assets.fileName,
      width: schema.assets.width,
      height: schema.assets.height,
    })
    .from(schema.assets)
    .where(
      and(
        eq(schema.assets.projectId, project.id),
        eq(schema.assets.kind, "preview")
      )
    )
    .orderBy(asc(schema.assets.sortIndex));

  /*
    Die fertigen Bilder.

    Getrennt von den Auswahlbildern, weil es andere Dateien sind: Regina laedt
    in der zweiten Runde die BEARBEITETEN Aufnahmen hoch, oft unter anderem
    Namen. Sichtbar werden sie erst mit dem Ausliefern.
  */
  const fertige =
    project.status === "delivered" ? await enddateien(project.id) : [];

  if (assets.length === 0) {
    // Ohne Auswahlbilder, aber mit fertigen: Das ist Reginas Weg 1 - die
    // Auswahl lief an der Kamera, das Portal liefert nur noch aus.
    if (fertige.length > 0) {
      return (
        <main className="min-h-screen overflow-visible bg-ink pb-24 text-paper">
          <div className="px-[var(--shell-x)] pt-20">
            <p className="eyebrow text-paper/50">R.Artphotographie</p>
            <h1 className="display-xl mt-4 max-w-[16ch] text-paper">
              {project.title}
            </h1>
          </div>
          <div className="mt-12">
            <GalleryDownload
              projectId={project.id}
              dateien={fertige.map((d) => ({
                id: d.id,
                fileName: d.fileName,
                byteSize: d.byteSize,
              }))}
              paketZuGross={
                fertige.reduce((s, d) => s + d.byteSize, 0) > PAKET_GRENZE_BYTES
              }
            />
            <ProduktBereich
              bilder={fertige.map((d) => ({
                id: d.id,
                fileName: d.fileName,
                width: d.width,
                height: d.height,
              }))}
            />
          </div>
        </main>
      );
    }

    return (
      <Hinweis
        titel="Gleich geht es los"
        text="Regina bereitet eure Bilder noch vor. Schau in ein paar Tagen wieder rein."
      />
    );
  }

  const favorites = await db()
    .select({ assetId: schema.favorites.assetId })
    .from(schema.favorites)
    .where(eq(schema.favorites.projectId, project.id));

  const abgeschickt = project.status !== "selecting";

  const intro = abgeschickt ? (
    <>
      Eure Auswahl ist bei Regina angekommen –{" "}
      <strong className="font-medium text-paper">{favorites.length}</strong>{" "}
      {favorites.length === 1 ? "Bild" : "Bilder"}. Sie meldet sich, sobald die
      bearbeiteten Aufnahmen bereitstehen. Anschauen könnt ihr hier weiterhin
      alles.
    </>
  ) : (
    <>
      Tippt auf das Herz bei den Bildern, die ihr haben möchtet. Ihr könnt
      jederzeit wieder abwählen – erst mit &bdquo;Auswahl abschicken&ldquo; geht
      sie an Regina.
      {project.selectionLimit !== null && (
        <>
          {" "}
          In eurem Paket sind{" "}
          <strong className="font-medium text-paper">
            {project.selectionLimit}
          </strong>{" "}
          bearbeitete Bilder enthalten.
        </>
      )}
    </>
  );

  /*
    Kein px, kein max-width, kein Container.

    Die Bilder sollen die Kante berühren – jede Fassung, die sie in eine Spalte
    mit Rand setzt, lässt eine Hochzeitsgalerie wie eine Dateiliste aussehen.
    Die Innenabstände setzt jeder Abschnitt selbst.
  */
  return (
    /*
      overflow-visible ist hier kein Detail, sondern die Bedingung dafür, dass
      die Auswahlleiste beim Scrollen oben stehen bleibt: Die Basisregel
      "main { overflow-x: clip }" macht aus dem Element einen eigenen
      Ausschnitt, und darin verliert position: sticky seinen Bezugsrahmen. Die
      Galerie läuft ohnehin nicht seitlich über.
    */
    <main className="min-h-screen overflow-visible bg-ink pb-24 text-paper">
      {fertige.length > 0 && (
        <GalleryDownload
          projectId={project.id}
          dateien={fertige.map((d) => ({
            id: d.id,
            fileName: d.fileName,
            byteSize: d.byteSize,
          }))}
          paketZuGross={
            fertige.reduce((s, d) => s + d.byteSize, 0) > PAKET_GRENZE_BYTES
          }
        />
      )}

      {fertige.length > 0 && (
        <ProduktBereich
          bilder={fertige.map((d) => ({
            id: d.id,
            fileName: d.fileName,
            width: d.width,
            height: d.height,
          }))}
        />
      )}

      <GalleryClient
        projectId={project.id}
        title={project.title}
        intro={intro}
        assets={assets}
        initialFavorites={favorites.map((f) => f.assetId)}
        selectionLimit={project.selectionLimit}
        locked={abgeschickt}
      />
    </main>
  );
}

function Hinweis({ titel, text }: { titel: string; text: string }) {
  return (
    <main className="min-h-screen bg-ink px-[var(--shell-x)] text-paper">
      <div className="mx-auto max-w-lg py-24">
        <h1 className="display-lg text-paper">{titel}</h1>
        <p className="mt-6 text-base leading-8 text-paper/70">{text}</p>
      </div>
    </main>
  );
}
