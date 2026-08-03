import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { darfEnddateien } from "@/lib/portal/downloads";
import { getAdminUser } from "@/lib/portal/session";
import { signDownloadUrl } from "@/lib/portal/r2";

/*
  Eine einzelne Datei in voller Auflösung.

  Die Route prüft die Berechtigung und leitet dann auf eine Adresse weiter, die
  fünf Minuten gilt. Die Bytes selbst laufen direkt von Cloudflare zum Browser
  und nicht durch diese Funktion – bei 30 MB pro Bild ist das der Unterschied
  zwischen "lädt" und "bricht ab".

  Bewusst anders als bei den Vorschaubildern: Dort läuft alles durch den
  Server, damit eine kopierte Adresse wertlos ist. Hier hat der Aufrufer die
  Datei ohnehin zu Recht – er darf sie behalten.
*/

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;

  const [asset] = await db()
    .select({
      id: schema.assets.id,
      kind: schema.assets.kind,
      r2Key: schema.assets.r2Key,
      fileName: schema.assets.fileName,
      projectId: schema.assets.projectId,
    })
    .from(schema.assets)
    .where(eq(schema.assets.id, assetId))
    .limit(1);

  // Dieselbe Antwort für "gibt es nicht" und "darfst du nicht": Sonst ließe
  // sich durch Ausprobieren herausfinden, welche Galerien existieren.
  if (!asset) return new NextResponse(null, { status: 404 });

  /*
    Auswahlbilder bekommt nur Regina.

    Sie braucht sie, um die Auswahl zu bearbeiten. Für die Kundschaft wären
    sie die unbearbeiteten Rohfassungen aus dem Shooting – genau das, was
    hinter dem Wasserzeichen nicht herauskommen soll.
  */
  if (asset.kind === "preview") {
    if (!(await getAdminUser())) return new NextResponse(null, { status: 404 });
  } else {
    const berechtigung = await darfEnddateien(asset.projectId);
    if (!berechtigung.erlaubt) {
      return new NextResponse(null, {
        status: berechtigung.grund === "abgelaufen" ? 410 : 404,
      });
    }
  }

  const url = await signDownloadUrl({
    key: asset.r2Key,
    fileName: asset.fileName,
  });

  return NextResponse.redirect(url, {
    status: 302,
    // Eine Weiterleitung auf eine Adresse mit Frist darf nirgends liegen
    // bleiben – weder im Browser noch in einer Zwischenstation.
    headers: { "cache-control": "no-store" },
  });
}
