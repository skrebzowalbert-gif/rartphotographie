import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import GalleryClient from "@/components/gallery/GalleryClient";
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
      <main className="min-h-screen bg-sand px-[var(--shell-x)] text-ink">
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

  if (assets.length === 0) {
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

  return (
    <main className="min-h-screen bg-sand px-[var(--shell-x)] pb-4 text-ink">
      <div className="mx-auto max-w-[110rem] pt-16">
        <p className="eyebrow text-ink/55">Eure Auswahl</p>
        <h1 className="display-lg mt-5 text-ink">{project.title}</h1>

        {abgeschickt ? (
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink/75">
            Eure Auswahl ist bei Regina angekommen –{" "}
            <strong className="text-ink">{favorites.length}</strong>{" "}
            {favorites.length === 1 ? "Bild" : "Bilder"}. Sie meldet sich, sobald
            die bearbeiteten Aufnahmen bereitstehen. Anschauen könnt ihr hier
            weiterhin alles.
          </p>
        ) : (
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink/75">
            Tippt auf das Herz bei den Bildern, die ihr haben möchtet. Ihr könnt
            jederzeit wieder abwählen – erst mit &bdquo;Auswahl abschicken&ldquo;
            geht sie an Regina.
            {project.selectionLimit !== null && (
              <>
                {" "}
                In eurem Paket sind{" "}
                <strong className="text-ink">{project.selectionLimit}</strong>{" "}
                bearbeitete Bilder enthalten.
              </>
            )}
          </p>
        )}

        <GalleryClient
          projectId={project.id}
          assets={assets}
          initialFavorites={favorites.map((f) => f.assetId)}
          selectionLimit={project.selectionLimit}
          locked={abgeschickt}
        />
      </div>
    </main>
  );
}

function Hinweis({ titel, text }: { titel: string; text: string }) {
  return (
    <main className="min-h-screen bg-sand px-[var(--shell-x)] text-ink">
      <div className="mx-auto max-w-lg py-24">
        <h1 className="display-lg text-ink">{titel}</h1>
        <p className="mt-6 text-base leading-8 text-ink/75">{text}</p>
      </div>
    </main>
  );
}
