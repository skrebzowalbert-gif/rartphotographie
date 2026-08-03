"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Hochladen direkt nach Cloudflare, ohne Umweg über unseren Server.
 *
 * Bewusst selbst geschrieben statt mit einer Upload-Bibliothek: Der Ablauf ist
 * überschaubar, und eine weitere Abhängigkeit im Pfad, über den fremde
 * Hochzeitsbilder laufen, will ich nicht mitschleppen.
 *
 * Je Datei vier Schritte:
 *   1. Erlaubnis holen      → Schlüssel und Upload-Kennung
 *   2. Teile signieren      → kurzlebige Adressen für 10-MB-Stücke
 *   3. Teile hochladen      → direkt zu Cloudflare, parallel
 *   4. Abschließen          → Cloudflare fügt zusammen, wir schreiben in die DB
 */

/**
 * 10 MB je Teilstück.
 *
 * Kleiner wäre mehr Verwaltungsaufwand, größer verlöre bei einem Abbruch mehr.
 * S3-kompatible Speicher verlangen mindestens 5 MB für alle Teile außer dem
 * letzten – darunter bricht der Abschluss ab.
 */
const PART_SIZE = 10 * 1024 * 1024;

/** Wie viele Teile gleichzeitig unterwegs sind. */
const PARALLEL = 4;

type Status = "wartet" | "laeuft" | "fertig" | "fehler";

type Item = {
  id: string;
  file: File;
  status: Status;
  progress: number;
  message?: string;
};

export default function Uploader({
  projectId,
  kind,
}: {
  projectId: string;
  kind: "preview" | "final";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);

  const update = useCallback((id: string, patch: Partial<Item>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }, []);

  async function post(body: unknown) {
    const response = await fetch("/api/portal/uploads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error ?? "Der Server hat abgelehnt.");
    return data;
  }

  /**
   * Bildmaße im Browser auslesen.
   *
   * Sie landen in der Datenbank, damit die Kundengalerie das Raster aufbauen
   * kann, BEVOR ein Bild geladen ist. Ohne bekannte Seitenverhältnisse springt
   * beim Scrollen alles – bei 600 Bildern der Unterschied zwischen "wirkt
   * teuer" und "wirkt billig".
   */
  async function readSize(file: File) {
    try {
      const bitmap = await createImageBitmap(file);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return size;
    } catch {
      return { width: null, height: null };
    }
  }

  async function uploadOne(item: Item) {
    update(item.id, { status: "laeuft", progress: 0 });

    const { key, uploadId } = await post({
      step: "create",
      projectId,
      kind,
      fileName: item.file.name,
      contentType: item.file.type,
      byteSize: item.file.size,
    });

    try {
      const total = Math.max(1, Math.ceil(item.file.size / PART_SIZE));
      const numbers = Array.from({ length: total }, (_, i) => i + 1);
      const { urls } = await post({
        step: "sign",
        projectId,
        key,
        uploadId,
        partNumbers: numbers,
      });

      const parts: { PartNumber: number; ETag: string }[] = [];
      let done = 0;

      // Teile in Wellen hochladen, statt alle auf einmal loszuschicken.
      for (let start = 0; start < numbers.length; start += PARALLEL) {
        const wave = numbers.slice(start, start + PARALLEL);

        await Promise.all(
          wave.map(async (partNumber) => {
            const from = (partNumber - 1) * PART_SIZE;
            const chunk = item.file.slice(from, from + PART_SIZE);

            const response = await fetch(urls[partNumber], {
              method: "PUT",
              body: chunk,
            });

            if (!response.ok) {
              throw new Error(`Teil ${partNumber} abgelehnt (${response.status}).`);
            }

            /*
              Das ETag muss der Browser lesen können. Dafür braucht der Bucket
              eine CORS-Regel mit ExposeHeaders: ["ETag"] – fehlt sie, ist der
              Wert null und der Abschluss scheitert mit einer Meldung, die
              nichts über die Ursache verrät.
            */
            const etag = response.headers.get("ETag");
            if (!etag) {
              throw new Error(
                "Cloudflare gibt das ETag nicht frei. Im Bucket fehlt die CORS-Regel."
              );
            }

            parts.push({ PartNumber: partNumber, ETag: etag });
            done += 1;
            update(item.id, { progress: Math.round((done / total) * 100) });
          })
        );
      }

      const { width, height } = await readSize(item.file);

      await post({
        step: "complete",
        projectId,
        kind,
        key,
        uploadId,
        fileName: item.file.name,
        byteSize: item.file.size,
        width,
        height,
        parts,
      });

      update(item.id, { status: "fertig", progress: 100 });
    } catch (error) {
      // Angefangene Uploads freigeben, sonst liegen die Teile unsichtbar im
      // Bucket und kosten Speicher.
      await post({ step: "abort", projectId, key, uploadId }).catch(() => {});

      update(item.id, {
        status: "fehler",
        message: error instanceof Error ? error.message : "Unbekannter Fehler.",
      });
    }
  }

  async function start(files: File[]) {
    const fresh: Item[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "wartet",
      progress: 0,
    }));

    setItems((current) => [...current, ...fresh]);
    setRunning(true);

    // Dateien nacheinander, Teile innerhalb einer Datei parallel. Alles
    // gleichzeitig würde die Leitung überfahren und jeden Fortschritt
    // unleserlich machen.
    for (const item of fresh) {
      await uploadOne(item);
    }

    setRunning(false);
    router.refresh();
  }

  const fertig = items.filter((i) => i.status === "fertig").length;
  const fehler = items.filter((i) => i.status === "fehler");

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const files = Array.from(event.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/")
          );
          if (files.length > 0) void start(files);
        }}
        className={`rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-colors duration-300 ${
          dragging ? "border-ink/50 bg-paper/60" : "border-ink/20 bg-paper/30"
        }`}
      >
        <p className="text-base leading-8 text-ink/75">
          Bilder hierher ziehen
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={running}
          className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft disabled:opacity-60"
        >
          {running ? "Lädt hoch…" : "Dateien auswählen"}
        </button>
        <p className="mt-5 text-sm leading-6 text-ink/55">
          JPEG, PNG, WebP oder AVIF · bis 300 MB je Datei · abgebrochene
          Uploads setzen automatisch wieder auf
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length > 0) void start(files);
            event.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-ink/70">
            {fertig} von {items.length} hochgeladen
            {fehler.length > 0 && ` · ${fehler.length} fehlgeschlagen`}
          </p>

          <ul className="mt-4 space-y-2">
            {items
              .filter((item) => item.status !== "fertig")
              .map((item) => (
                <li key={item.id} className="text-sm leading-6 text-ink/70">
                  <span className="font-mono text-xs">{item.file.name}</span>
                  {item.status === "laeuft" && ` · ${item.progress} %`}
                  {item.status === "wartet" && " · wartet"}
                  {item.status === "fehler" && (
                    <span className="text-ink"> · {item.message}</span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
