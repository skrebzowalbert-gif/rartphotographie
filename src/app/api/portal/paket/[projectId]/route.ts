import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import {
  ausgewaehlteOriginale,
  darfEnddateien,
  enddateien,
} from "@/lib/portal/downloads";
import { objectStream } from "@/lib/portal/r2";
import { getAdminUser } from "@/lib/portal/session";
import { record } from "@/lib/portal/audit";
import {
  eindeutigeNamen,
  paketStrom,
  PAKET_GRENZE_BYTES,
} from "@/lib/portal/zip";

/*
  Alle Bilder auf einmal, als ZIP.

  Zwei Verwendungen mit derselben Mechanik:

    ?was=auswahl  – die vom Paar gewählten Originale, nur für Regina
    ?was=final    – die bearbeiteten Bilder, für die Kundschaft

  Das Paket wird nicht gebaut und dann geschickt, sondern im Fluss erzeugt:
  Der erste Kopf geht raus, bevor die letzte Datei gelesen ist. Sonst läge ein
  Gigabyte im Arbeitsspeicher einer Funktion, die davon deutlich weniger hat.
*/

export const dynamic = "force-dynamic";
// Ein Paket über mehrere hundert Megabyte braucht länger als die
// Grundeinstellung von 15 Sekunden. 800 ist, was der Vertrag hergibt.
export const maxDuration = 800;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const was = new URL(request.url).searchParams.get("was") ?? "final";

  const [projekt] = await db()
    .select({ title: schema.projects.title })
    .from(schema.projects)
    .where(eq(schema.projects.id, projectId))
    .limit(1);

  if (!projekt) return new NextResponse(null, { status: 404 });

  const admin = await getAdminUser();

  let dateien: { fileName: string; r2Key: string; byteSize: number }[];

  if (was === "auswahl") {
    // Die Originale sind unbearbeitet und tragen kein Wasserzeichen. Die
    // bekommt ausschließlich Regina.
    if (!admin) return new NextResponse(null, { status: 404 });
    dateien = await ausgewaehlteOriginale(projectId);
  } else {
    const berechtigung = await darfEnddateien(projectId);
    if (!berechtigung.erlaubt) {
      return new NextResponse(null, {
        status: berechtigung.grund === "abgelaufen" ? 410 : 404,
      });
    }
    dateien = await enddateien(projectId);
  }

  if (dateien.length === 0) return new NextResponse(null, { status: 404 });

  const gesamt = dateien.reduce((summe, d) => summe + d.byteSize, 0);
  if (gesamt > PAKET_GRENZE_BYTES) {
    /*
      Lieber ehrlich absagen als mittendrin sterben.

      Oberhalb dieser Grenze bricht die Funktion ab, bevor das Paket fertig
      ist – und der Nutzer hat eine unbrauchbare Datei ohne Erklärung. Die
      Oberfläche bietet in dem Fall die Einzeldateien an.
    */
    return NextResponse.json(
      {
        error:
          "Dieses Paket wäre zu groß. Lade die Bilder bitte einzeln herunter.",
        bytes: gesamt,
      },
      { status: 413 }
    );
  }

  const namen = eindeutigeNamen(dateien.map((d) => d.fileName));
  const eintraege = dateien.map((d, i) => ({ name: namen[i], key: d.r2Key }));

  if (admin) {
    await record({
      actor: "admin",
      actorId: admin.userId,
      projectId,
      action: "download.paket",
      detail: { was, dateien: dateien.length },
    });
  } else {
    await record({
      actor: "client",
      projectId,
      action: "download.paket",
      detail: { was, dateien: dateien.length },
    });
  }

  const dateiname = `${projekt.title.replace(/[^\p{L}\p{N} _-]/gu, "").trim() || "Galerie"}${
    was === "auswahl" ? " Auswahl" : ""
  }.zip`;

  return new NextResponse(paketStrom(eintraege, objectStream), {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${dateiname}"`,
      "cache-control": "no-store",
      // Ohne das puffern manche Zwischenstationen die Antwort, bis sie
      // vollständig ist – und genau das soll hier nicht passieren.
      "x-content-type-options": "nosniff",
    },
  });
}
