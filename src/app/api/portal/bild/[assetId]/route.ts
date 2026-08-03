import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getAdminUser, getGallerySession } from "@/lib/portal/session";
import { getPreviewImage, WIDTHS, type Width } from "@/lib/portal/images";

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
    // Regina sieht ihre Bilder ohne Wasserzeichen – sie muss beurteilen
    // können, was sie hochgeladen hat.
    watermark = false;
  }

  const requested = Number(new URL(request.url).searchParams.get("w"));
  const width: Width = (WIDTHS as readonly number[]).includes(requested)
    ? (requested as Width)
    : 800;

  try {
    const image = await getPreviewImage({
      projectId: asset.projectId,
      assetId: asset.id,
      sourceKey: asset.r2Key,
      width,
      watermark,
    });

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
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
