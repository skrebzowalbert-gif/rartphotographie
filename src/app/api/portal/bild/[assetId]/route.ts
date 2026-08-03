import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getAdminUser, getGallerySession } from "@/lib/portal/session";
import {
  getPreviewImage,
  MissingOriginalError,
  WIDTHS,
  type Width,
} from "@/lib/portal/images";

/*
  Die einzige Adresse, unter der ein Kundenbild den Speicher verlässt.

  Bewusst KEINE vorsignierte Cloudflare-Adresse: Eine solche URL IST die
  Berechtigung. Wer sie kopiert und weiterschickt, gibt vollen Zugriff weiter,
  bis sie abläuft – und bei einer Galerie, die eine Woche offen ist, klickt der
  Empfänger ja sofort.

  Hier hängt der Zugriff dagegen am Sitzungs-Cookie. Die Adresse allein ist
  wertlos: In einem anderen Browser kommt 403. Damit ist "direktes Verlinken
  der Bild-URLs unterbinden" nicht kosmetisch geloest, sondern strukturell.
*/

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;

  const rows = await db()
    .select({
      id: schema.assets.id,
      kind: schema.assets.kind,
      r2Key: schema.assets.r2Key,
      width: schema.assets.width,
      projectId: schema.projects.id,
      status: schema.projects.status,
      watermarkEnabled: schema.projects.watermarkEnabled,
      expiresAt: schema.projects.expiresAt,
    })
    .from(schema.assets)
    .innerJoin(schema.projects, eq(schema.projects.id, schema.assets.projectId))
    .where(eq(schema.assets.id, assetId))
    .limit(1);

  const asset = rows[0];
  // Dieselbe Antwort für "gibt es nicht" und "darfst du nicht": Sonst liesse
  // sich durch Ausprobieren herausfinden, welche Galerien existieren.
  if (!asset) return new NextResponse(null, { status: 404 });

  const admin = await getAdminUser();
  let watermark = asset.watermarkEnabled;

  if (!admin) {
    const session = await getGallerySession(asset.projectId);
    if (!session) return new NextResponse(null, { status: 404 });

    if (asset.expiresAt.getTime() < Date.now()) {
      return new NextResponse(null, { status: 410 });
    }

    // Enddateien sind erst nach der Freigabe sichtbar.
    if (asset.kind === "final" && asset.status !== "delivered") {
      return new NextResponse(null, { status: 404 });
    }
  } else {
    /*
      Regina sieht ihre Bilder standardmäßig OHNE Wasserzeichen – sie muss
      beurteilen können, was sie hochgeladen hat.

      Mit ?ansicht=kunde bekommt sie dieselbe Fassung wie die Kundschaft.
      Ohne diesen Schalter könnte sie nie prüfen, wie das Wasserzeichen auf
      ihren eigenen Motiven wirkt – und genau das ist eine Geschmacksfrage,
      die sie entscheiden muss, nicht ich.
    */
    const alsKunde =
      new URL(request.url).searchParams.get("ansicht") === "kunde";
    watermark = alsKunde && asset.watermarkEnabled;
  }

  const requested = Number(new URL(request.url).searchParams.get("w"));
  const width: Width = (WIDTHS as readonly number[]).includes(requested)
    ? (requested as Width)
    : 800;

  try {
    const { image, sourceWidth, sourceHeight } = await getPreviewImage({
      projectId: asset.projectId,
      assetId: asset.id,
      sourceKey: asset.r2Key,
      width,
      watermark,
    });

    /*
      Maße nachtragen, falls sie fehlen.

      Bei HEIC kann der Browser sie beim Hochladen nicht auslesen. Hier fallen
      sie beim ersten Erzeugen der Vorschau ohnehin an – also mitnehmen, statt
      dafür eine eigene Runde zu drehen.
    */
    if (sourceWidth && sourceHeight && asset.width === null) {
      await db()
        .update(schema.assets)
        .set({ width: sourceWidth, height: sourceHeight })
        .where(eq(schema.assets.id, asset.id))
        .catch(() => {});
    }

    return new NextResponse(new Uint8Array(image), {
      headers: {
        "content-type": "image/jpeg",
        "content-length": String(image.length),
        /*
          private: Nur der Browser des Betrachters darf zwischenspeichern,
          keine gemeinsame Zwischenstation. Ohne das könnte ein Zwischenspeicher
          ein Bild an jemanden ausliefern, dessen Sitzung längst abgelaufen ist.
        */
        "cache-control": "private, max-age=3600, must-revalidate",
        "content-disposition": "inline",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    /*
      Hier stand einmal ein stilles 404 für jeden erdenklichen Fehler.

      Das war bequem und falsch: Als der Speicher tatsächlich leer war, sah die
      Galerie exakt so aus wie bei einem Bild, das es nie gab – und in den
      Protokollen stand nichts. Ein Fehler, den man nicht sieht, wird nicht
      behoben. Also getrennte Antworten und in beiden Fällen eine Zeile im Log.
    */
    if (error instanceof MissingOriginalError) {
      console.error(
        "Bild fehlt im Speicher:",
        JSON.stringify({ assetId: asset.id, projectId: asset.projectId, key: asset.r2Key })
      );
      // 502: Die Berechtigung stimmt, die Quelle dahinter nicht.
      return new NextResponse(null, { status: 502 });
    }

    console.error("Vorschau fehlgeschlagen:", asset.id, error);
    return new NextResponse(null, { status: 500 });
  }
}
