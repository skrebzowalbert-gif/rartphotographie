import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { record } from "@/lib/portal/audit";
import { getGallerySession } from "@/lib/portal/session";
import { notifySelection } from "@/lib/portal/notify";

/*
  Favoriten setzen und die Auswahl abschicken.

  Jede Anfrage prüft die Sitzung dieser einen Galerie. Ein Cookie für Galerie A
  ist hier wertlos – ohne diese Bindung könnte ein Kunde in fremden Auswahlen
  herumklicken.
*/

const toggleSchema = z.object({
  action: z.literal("toggle"),
  projectId: z.uuid(),
  assetId: z.uuid(),
  selected: z.boolean(),
});

const submitSchema = z.object({
  action: z.literal("submit"),
  projectId: z.uuid(),
});

const bodySchema = z.discriminatedUnion("action", [toggleSchema, submitSchema]);

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const body = parsed.data;
  const session = await getGallerySession(body.projectId);
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const [project] = await db()
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      clientName: schema.projects.clientName,
      status: schema.projects.status,
      expiresAt: schema.projects.expiresAt,
    })
    .from(schema.projects)
    .where(eq(schema.projects.id, body.projectId))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  if (project.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Galerie abgelaufen." }, { status: 410 });
  }

  /*
    Nach dem Abschicken ist die Auswahl fest.

    Sonst könnte jemand nachträglich umwählen, während Regina schon bearbeitet –
    und am Ende passt die Lieferung nicht zu dem, was auf dem Bildschirm steht.
  */
  if (project.status !== "selecting") {
    return NextResponse.json(
      { error: "Die Auswahl wurde bereits abgeschickt." },
      { status: 409 }
    );
  }

  if (body.action === "toggle") {
    // Gehört das Bild überhaupt zu dieser Galerie?
    const [asset] = await db()
      .select({ id: schema.assets.id })
      .from(schema.assets)
      .where(
        and(
          eq(schema.assets.id, body.assetId),
          eq(schema.assets.projectId, body.projectId),
          eq(schema.assets.kind, "preview")
        )
      )
      .limit(1);

    if (!asset) {
      return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
    }

    if (body.selected) {
      /*
        onConflictDoNothing statt vorher zu prüfen: Zwei Personen, die
        gleichzeitig dasselbe Bild antippen, würden sonst je nach Zeitpunkt
        einen Fehler auslösen. Beim Brautpaar am selben Küchentisch ist das
        kein Randfall.
      */
      await db()
        .insert(schema.favorites)
        .values({
          projectId: body.projectId,
          assetId: body.assetId,
          sessionId: session.id,
        })
        .onConflictDoNothing();
    } else {
      await db()
        .delete(schema.favorites)
        .where(
          and(
            eq(schema.favorites.projectId, body.projectId),
            eq(schema.favorites.assetId, body.assetId)
          )
        );
    }

    const [{ count }] = await db()
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.favorites)
      .where(eq(schema.favorites.projectId, body.projectId));

    return NextResponse.json({ ok: true, count: Number(count) });
  }

  /* ---------------------------------------------------------------- */
  /* Auswahl abschicken                                                */
  /* ---------------------------------------------------------------- */

  const chosen = await db()
    .select({ fileName: schema.assets.fileName })
    .from(schema.favorites)
    .innerJoin(schema.assets, eq(schema.assets.id, schema.favorites.assetId))
    .where(eq(schema.favorites.projectId, body.projectId))
    .orderBy(schema.assets.sortIndex);

  if (chosen.length === 0) {
    return NextResponse.json(
      { error: "Es ist noch kein Bild ausgewählt." },
      { status: 400 }
    );
  }

  await db()
    .update(schema.projects)
    .set({
      status: "selected",
      selectionSubmittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.projects.id, body.projectId));

  await record({
    actor: "client",
    projectId: body.projectId,
    action: "gallery.selection.submitted",
    detail: { anzahl: chosen.length },
  });

  // Der Versand darf das Abschicken nicht zum Scheitern bringen: Die Auswahl
  // steht bereits in der Datenbank und ist im Portal sichtbar.
  await notifySelection({
    title: project.title,
    clientName: project.clientName,
    projectId: project.id,
    fileNames: chosen.map((c) => c.fileName),
  }).catch((error) => {
    console.error("Benachrichtigung fehlgeschlagen:", error);
  });

  return NextResponse.json({ ok: true, count: chosen.length });
}

/** Wieder freigeben – nur Regina, nicht die Kundschaft. */
export async function DELETE() {
  return NextResponse.json({ error: "Nicht erlaubt." }, { status: 405 });
}
