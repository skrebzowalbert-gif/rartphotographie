import "server-only";

import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Anbindung an Cloudflare R2.
 *
 * Der Grundsatz des ganzen Portals: Dateibytes laufen NIE durch Next.js.
 * Reginas Browser lädt direkt in den Bucket, die Kundschaft lädt direkt aus
 * dem Bucket. Diese Datei stellt nur die Erlaubnisscheine dafür aus.
 *
 * Eine Serverless-Funktion, durch die ein 8-MB-JPEG fließt, ist bei 600
 * Bildern nicht langsam – sie läuft in die Zeitgrenze und in die
 * Speichergrenze. Vercel nimmt ohnehin nur 4,5 MB Anfragekörper an.
 */

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} fehlt – ohne sie kein Bilderspeicher.`);
  return value;
}

/**
 * Buckets mit EU-Jurisdiktion sprechen einen eigenen Endpunkt an.
 *
 * Ohne das zusätzliche ".eu" antwortet R2 mit NoSuchBucket, obwohl der Bucket
 * existiert – ein Fehler, bei dem man lange in die falsche Richtung sucht.
 * Deshalb wird der Endpunkt hier abgeleitet und nicht separat konfiguriert:
 * So kann er gar nicht erst auseinanderlaufen.
 */
export function endpoint(): string {
  return `https://${required("R2_ACCOUNT_ID")}.eu.r2.cloudflarestorage.com`;
}

export function bucket(): string {
  return required("R2_BUCKET");
}

let client: S3Client | null = null;

export function r2(): S3Client {
  if (client) return client;

  client = new S3Client({
    region: "auto",
    endpoint: endpoint(),
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });

  return client;
}

/**
 * Ablageort einer Datei.
 *
 * Nach Projekt und Art getrennt, mit einer Zufallsfolge im Namen. Der
 * Originaldateiname wandert NICHT in den Schlüssel: "Julia_und_Max_Kuss.jpg"
 * im Pfad wäre eine Aussage über Dritte, die in Protokollen und Fehlerberichten
 * auftaucht. Der echte Name steht in der Datenbank, wo er hingehört.
 */
export function objectKey(params: {
  projectId: string;
  kind: "preview" | "final";
  extension: string;
}): string {
  const random = crypto.randomUUID();
  const ext = params.extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";

  return `${params.projectId}/${params.kind}/${random}.${ext}`;
}

/* ------------------------------------------------------------------ */
/* Mehrteiliger Upload                                                 */
/* ------------------------------------------------------------------ */

export async function beginMultipartUpload(params: {
  key: string;
  contentType: string;
}) {
  const result = await r2().send(
    new CreateMultipartUploadCommand({
      Bucket: bucket(),
      Key: params.key,
      ContentType: params.contentType,
    })
  );

  if (!result.UploadId) throw new Error("R2 hat keine Upload-Kennung geliefert.");
  return result.UploadId;
}

/**
 * Erlaubnisschein für ein einzelnes Teilstück.
 *
 * Fünf Minuten Gültigkeit reichen: Ein 10-MB-Stück ist auch bei schlechter
 * Verbindung schneller oben, und eine kurze Frist begrenzt den Schaden, falls
 * eine dieser Adressen je abhandenkommt.
 */
export function signUploadPart(params: {
  key: string;
  uploadId: string;
  partNumber: number;
}) {
  return getSignedUrl(
    r2(),
    new UploadPartCommand({
      Bucket: bucket(),
      Key: params.key,
      UploadId: params.uploadId,
      PartNumber: params.partNumber,
    }),
    { expiresIn: 300 }
  );
}

export async function finishMultipartUpload(params: {
  key: string;
  uploadId: string;
  parts: { PartNumber: number; ETag: string }[];
}) {
  await r2().send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket(),
      Key: params.key,
      UploadId: params.uploadId,
      MultipartUpload: {
        // R2 verlangt aufsteigende Teilnummern; Uppy liefert sie nicht
        // zwingend sortiert, wenn Teile parallel fertig werden.
        Parts: [...params.parts].sort((a, b) => a.PartNumber - b.PartNumber),
      },
    })
  );
}

/**
 * Bricht einen Upload ab und gibt die bereits übertragenen Teile frei.
 *
 * Ohne diesen Aufruf bleiben angefangene Uploads unsichtbar im Bucket liegen
 * und kosten Speicher, ohne je in einer Dateiliste aufzutauchen.
 */
export async function abortMultipartUpload(params: {
  key: string;
  uploadId: string;
}) {
  await r2().send(
    new AbortMultipartUploadCommand({
      Bucket: bucket(),
      Key: params.key,
      UploadId: params.uploadId,
    })
  );
}

/* ------------------------------------------------------------------ */
/* Aufräumen                                                           */
/* ------------------------------------------------------------------ */

/**
 * Löscht eine Datei samt aller daraus abgeleiteten Vorschauen.
 *
 * Die Ableitungen tragen die Kennung des Datensatzes im Namen. Ohne diesen
 * Aufruf blieben sie liegen: unsichtbar, unbenutzbar und trotzdem bezahlt.
 *
 * Gesucht wird über den ganzen Ableitungsordner und dann gefiltert, nicht über
 * ein Präfix mit der Kennung. Der Grund ist eine Falle: Vor dem Ablageschlüssel
 * steht seit der Wasserzeichen-Reparatur eine Fassungsnummer ("v2-"). Ein
 * Präfix, das mit der Kennung beginnt, findet seitdem nichts mehr – gelöscht
 * würde nur noch das Original, und die Vorschauen blieben für immer liegen.
 * Diese Art von Fehler meldet sich nie; sie kostet nur.
 */
export async function deleteAssetObjects(params: {
  projectId: string;
  assetId: string;
  r2Key: string;
}) {
  const listing = await r2().send(
    new ListObjectsV2Command({
      Bucket: bucket(),
      Prefix: `${params.projectId}/abgeleitet/`,
    })
  );

  const keys = [
    params.r2Key,
    ...(listing.Contents ?? [])
      .map((o) => o.Key)
      .filter((k): k is string => !!k && k.includes(`-${params.assetId}-`)),
  ];

  await r2().send(
    new DeleteObjectsCommand({
      Bucket: bucket(),
      Delete: { Objects: keys.map((Key) => ({ Key })) },
    })
  );

  return keys.length;
}

/** Löscht alle Dateien eines Projekts – für abgelaufene Galerien. */
export async function deleteProjectObjects(projectId: string) {
  let token: string | undefined;
  let deleted = 0;

  do {
    const listing = await r2().send(
      new ListObjectsV2Command({
        Bucket: bucket(),
        Prefix: `${projectId}/`,
        ContinuationToken: token,
      })
    );

    const keys = (listing.Contents ?? [])
      .map((o) => o.Key)
      .filter((k): k is string => Boolean(k));

    if (keys.length > 0) {
      await r2().send(
        new DeleteObjectsCommand({
          Bucket: bucket(),
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        })
      );
      deleted += keys.length;
    }

    token = listing.IsTruncated ? listing.NextContinuationToken : undefined;
  } while (token);

  return deleted;
}

/* ------------------------------------------------------------------ */
/* Herunterladen                                                       */
/* ------------------------------------------------------------------ */

/**
 * Eine kurzlebige Adresse für genau eine Datei.
 *
 * Bei den Vorschaubildern gehe ich bewusst den anderen Weg: Die laufen durch
 * den Server, damit eine kopierte Adresse wertlos ist. Beim Herunterladen der
 * fertigen Bilder geht das nicht – ein Paket über mehrere Gigabyte durch eine
 * Serverless-Funktion zu schieben, die nach 800 Sekunden abgebrochen wird,
 * endet in einer halb geladenen Datei.
 *
 * Vertretbar ist der Unterschied, weil sich die Lage geändert hat: Wer hier
 * ankommt, hat die Galerie geöffnet UND die Datei ist für ihn bestimmt. Er
 * darf sie ohnehin behalten. Bei der Vorauswahl war beides nicht der Fall.
 *
 * Fünf Minuten sind knapp genug, dass eine weitergeschickte Adresse ins Leere
 * läuft, und lang genug, dass ein Download über Mobilfunk startet.
 */
export function signDownloadUrl(params: {
  key: string;
  fileName: string;
}): Promise<string> {
  return getSignedUrl(
    r2(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: params.key,
      /*
        Ohne das öffnet der Browser das JPEG im Tab, statt es zu speichern –
        und der Dateiname wäre der Ablageschlüssel, also eine Kennung ohne
        Bedeutung. Regina braucht in Lightroom den ursprünglichen Namen.
      */
      ResponseContentDisposition: `attachment; filename="${params.fileName.replace(
        /"/g,
        ""
      )}"`,
    }),
    { expiresIn: 300 }
  );
}

/** Liefert den Inhalt einer Datei als Strom – für das Paket. */
export async function objectStream(
  key: string
): Promise<ReadableStream<Uint8Array>> {
  const result = await r2().send(
    new GetObjectCommand({ Bucket: bucket(), Key: key })
  );

  const body = result.Body;
  if (!body) throw new Error(`Kein Inhalt: ${key}`);

  return body.transformToWebStream() as ReadableStream<Uint8Array>;
}
