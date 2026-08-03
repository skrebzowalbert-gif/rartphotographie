import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getAdminUser } from "@/lib/portal/session";
import {
  abortMultipartUpload,
  beginMultipartUpload,
  finishMultipartUpload,
  objectKey,
  signUploadPart,
} from "@/lib/portal/r2";

/*
  Erlaubnisscheine für den Upload.

  Dieser Endpunkt sieht nie eine Bilddatei. Er prüft, ob Regina angemeldet ist
  und ob das Projekt ihr gehört, und stellt dann kurzlebige, signierte Adressen
  aus, gegen die ihr Browser direkt bei Cloudflare hochlädt.

  Warum vier Schritte statt eines: Ein 40-MB-Bild in einem Rutsch bedeutet bei
  abbrechender Verbindung 40 MB umsonst. In 10-MB-Stücken geht nur das laufende
  Stück verloren, und die Teile laufen parallel – das ist der Unterschied
  zwischen "600 Bilder über Nacht" und "600 Bilder in zwanzig Minuten".
*/

/**
 * Erlaubte Formate.
 *
 * HEIC steht bewusst NICHT dabei, obwohl es die Voreinstellung jedes iPhones
 * ist – und das hat einen unangenehm technischen Grund:
 *
 * iPhone-HEICs sind HEVC-kodiert. Die vorgefertigten sharp-Binaerdateien
 * enthalten libheif zwar, aber ohne HEVC-Dekoder, weil dafuer Patentlizenzen
 * faellig waeren. sharp kann die Metadaten lesen – das ist nur Struktur – und
 * scheitert dann am Bildinhalt mit "bad seek". AVIF (AV1) funktioniert,
 * HEIC (H.265) nicht.
 *
 * Eine Datei anzunehmen, aus der wir nie eine Vorschau erzeugen koennen, waere
 * schlimmer als sie abzulehnen: Sie kostet Speicher und erzeugt in der
 * Kundengalerie Luecken statt Bildern.
 */
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

/** Formate, fuer die wir einen brauchbaren Hinweis geben koennen. */
const KNOWN_UNSUPPORTED: Record<string, string> = {
  "image/heic":
    "HEIC vom iPhone lässt sich hier nicht umwandeln. Stelle am iPhone unter " +
    "Einstellungen → Kamera → Formate auf „Maximale Kompatibilität\" – dann " +
    "fotografiert es JPEG. Vorhandene Bilder kannst du in der Fotos-App über " +
    "„Teilen → Kopieren“ als JPEG sichern oder aus Lightroom exportieren.",
  "image/heif":
    "HEIF lässt sich hier nicht umwandeln. Bitte als JPEG exportieren.",
};

/**
 * 300 MB je Datei.
 *
 * Ein Kamera-JPEG liegt bei 8 bis 25 MB. Die Grenze ist bewusst weit darüber,
 * aber nicht offen: Ohne Obergrenze könnte ein Fehler in Reginas Rechner den
 * Bucket vollschreiben, und bei R2 zahlt man für Speicher.
 */
const MAX_BYTES = 300 * 1024 * 1024;

const createSchema = z.object({
  step: z.literal("create"),
  projectId: z.uuid(),
  kind: z.enum(["preview", "final"]),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.string(),
  byteSize: z.number().int().positive().max(MAX_BYTES),
});

const signSchema = z.object({
  step: z.literal("sign"),
  projectId: z.uuid(),
  key: z.string(),
  uploadId: z.string(),
  partNumbers: z.array(z.number().int().min(1).max(10_000)).min(1).max(100),
});

const completeSchema = z.object({
  step: z.literal("complete"),
  projectId: z.uuid(),
  kind: z.enum(["preview", "final"]),
  key: z.string(),
  uploadId: z.string(),
  fileName: z.string().trim().min(1).max(255),
  byteSize: z.number().int().positive().max(MAX_BYTES),
  width: z.number().int().positive().max(30_000).nullable(),
  height: z.number().int().positive().max(30_000).nullable(),
  parts: z
    .array(z.object({ PartNumber: z.number().int().min(1), ETag: z.string() }))
    .min(1),
});

const abortSchema = z.object({
  step: z.literal("abort"),
  projectId: z.uuid(),
  key: z.string(),
  uploadId: z.string(),
});

const bodySchema = z.discriminatedUnion("step", [
  createSchema,
  signSchema,
  completeSchema,
  abortSchema,
]);

/**
 * Gehört der Schlüssel zu diesem Projekt?
 *
 * Ohne diese Prüfung könnte eine manipulierte Anfrage mit einem fremden
 * Schlüssel Dateien einer anderen Galerie überschreiben – angemeldet ist ja
 * nur eine Person, aber der Schlüssel kommt vom Browser.
 */
function keyBelongsToProject(key: string, projectId: string) {
  return key.startsWith(`${projectId}/`);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const body = parsed.data;

  const [project] = await db()
    .select({ id: schema.projects.id })
    .from(schema.projects)
    .where(eq(schema.projects.id, body.projectId))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Galerie nicht gefunden." }, { status: 404 });
  }

  if ("key" in body && !keyBelongsToProject(body.key, body.projectId)) {
    return NextResponse.json({ error: "Ungültiger Ablageort." }, { status: 403 });
  }

  switch (body.step) {
    case "create": {
      if (!ALLOWED.has(body.contentType)) {
        return NextResponse.json(
          {
            error:
              KNOWN_UNSUPPORTED[body.contentType] ??
              "Format nicht unterstützt. Möglich sind JPEG, PNG, WebP und AVIF – " +
                "RAW-Dateien bitte vorher als JPEG exportieren.",
          },
          { status: 415 }
        );
      }

      const extension = body.fileName.split(".").pop() ?? "jpg";
      const key = objectKey({
        projectId: body.projectId,
        kind: body.kind,
        extension,
      });

      const uploadId = await beginMultipartUpload({
        key,
        contentType: body.contentType,
      });

      return NextResponse.json({ key, uploadId });
    }

    case "sign": {
      const urls: Record<number, string> = {};

      // Alle angefragten Teile in einem Rutsch signieren: Bei 100 Teilen wären
      // 100 einzelne Anfragen an unseren Server reine Verschwendung.
      await Promise.all(
        body.partNumbers.map(async (partNumber) => {
          urls[partNumber] = await signUploadPart({
            key: body.key,
            uploadId: body.uploadId,
            partNumber,
          });
        })
      );

      return NextResponse.json({ urls });
    }

    case "complete": {
      await finishMultipartUpload({
        key: body.key,
        uploadId: body.uploadId,
        parts: body.parts,
      });

      /*
        Erst nach dem erfolgreichen Abschluss in die Datenbank.

        Andersherum entstünden Datensätze für Dateien, die es nicht gibt – und
        die Kundengalerie zeigte Lücken statt Bildern.
      */
      const [asset] = await db()
        .insert(schema.assets)
        .values({
          projectId: body.projectId,
          kind: body.kind,
          r2Key: body.key,
          fileName: body.fileName,
          byteSize: body.byteSize,
          width: body.width,
          height: body.height,
          sortIndex: sql`(
            select coalesce(max(${schema.assets.sortIndex}), 0) + 1
            from ${schema.assets}
            where ${schema.assets.projectId} = ${body.projectId}
              and ${schema.assets.kind} = ${body.kind}
          )`,
        })
        .returning({ id: schema.assets.id });

      return NextResponse.json({ ok: true, assetId: asset.id });
    }

    case "abort": {
      await abortMultipartUpload({ key: body.key, uploadId: body.uploadId });
      return NextResponse.json({ ok: true });
    }
  }
}

/** Entfernt ein einzelnes Bild wieder aus einer Galerie. */
export async function DELETE(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get("assetId");
  const projectId = searchParams.get("projectId");

  if (!assetId || !projectId) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const deleted = await db()
    .delete(schema.assets)
    .where(
      and(
        eq(schema.assets.id, assetId),
        // Die Projektzugehörigkeit gehört in die WHERE-Bedingung, nicht in
        // eine vorgelagerte Prüfung: So kann zwischen Prüfung und Löschung
        // nichts dazwischenkommen.
        eq(schema.assets.projectId, projectId)
      )
    )
    .returning({ r2Key: schema.assets.r2Key });

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
