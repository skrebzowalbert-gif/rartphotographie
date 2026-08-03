"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Die Galerie, die das Brautpaar sieht.
 *
 * Gestaltungsentscheidungen, die den Unterschied machen:
 *
 * – Mehrspaltiger Textfluss statt starres Raster. Hoch- und Querformate stehen
 *   nebeneinander, ohne beschnitten zu werden. Ein Raster mit festem
 *   Seitenverhältnis würde jedes Hochformat anschneiden – bei Portraits
 *   ausgerechnet die Köpfe.
 *
 * – content-visibility: auto statt einer Virtualisierungs-Bibliothek. Der
 *   Browser überspringt das Zeichnen dessen, was außerhalb des Sichtfelds
 *   liegt. Bei 600 Bildern bringt das den Unterschied zwischen zähem und
 *   flüssigem Scrollen – ohne eine weitere Abhängigkeit im Pfad, über den
 *   fremde Hochzeitsbilder laufen.
 *
 * – Das Seitenverhältnis steht fest, bevor ein Bild geladen ist. Ohne das
 *   springt beim Scrollen alles, und die Seite wirkt billig.
 */

export type GalleryAsset = {
  id: string;
  fileName: string;
  width: number | null;
  height: number | null;
};

export default function GalleryClient({
  projectId,
  assets,
  initialFavorites,
  selectionLimit,
  locked,
}: {
  projectId: string;
  assets: GalleryAsset[];
  initialFavorites: string[];
  selectionLimit: number | null;
  locked: boolean;
}) {
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(initialFavorites)
  );
  const [open, setOpen] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
    Noch laufende Herz-Anfragen.

    Ohne das gibt es ein Wettrennen: Wer ein Bild antippt und sofort auf
    "Auswahl abschicken" drückt, schickt ab, bevor der Favorit gespeichert ist –
    der Server sieht eine leere Auswahl und lehnt ab. Beim Brautpaar, das beim
    letzten Bild gleich fertig werden will, ist das kein Randfall.
  */
  const [pendingToggles] = useState<Set<Promise<unknown>>>(() => new Set());

  const toggle = useCallback(
    async (assetId: string) => {
      if (locked) return;

      const selected = !favorites.has(assetId);

      // Sofort umschalten, dann erst melden. Auf ein Herz zu tippen und eine
      // halbe Sekunde auf Antwort zu warten fühlt sich kaputt an.
      setFavorites((current) => {
        const next = new Set(current);
        if (selected) next.add(assetId);
        else next.delete(assetId);
        return next;
      });

      const request = fetch("/api/portal/favoriten", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "toggle",
          projectId,
          assetId,
          selected,
        }),
      });

      pendingToggles.add(request);

      try {
        const response = await request;
        if (!response.ok) throw new Error();
      } catch {
        // Fehlgeschlagen: zurücknehmen, damit die Anzeige nicht lügt.
        setFavorites((current) => {
          const next = new Set(current);
          if (selected) next.delete(assetId);
          else next.add(assetId);
          return next;
        });
        setError("Das hat nicht geklappt. Bist du noch online?");
      } finally {
        pendingToggles.delete(request);
      }
    },
    [favorites, locked, pendingToggles, projectId]
  );

  async function submit() {
    if (favorites.size === 0) return;

    if (
      !confirm(
        `${favorites.size} ${
          favorites.size === 1 ? "Bild" : "Bilder"
        } an Regina schicken? Danach lässt sich die Auswahl nicht mehr ändern.`
      )
    ) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      // Erst die noch laufenden Herzen abwarten, dann abschicken.
      await Promise.allSettled([...pendingToggles]);

      const response = await fetch("/api/portal/favoriten", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "submit", projectId }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? "Unbekannter Fehler.");

      /*
        Voll neu laden statt router.refresh().

        Nach dem Abschicken ändert sich die ganze Seite: Der einleitende Text
        wird zur Bestätigung, die Leiste verschwindet, die Herzen werden
        gesperrt. Ein sanftes Aktualisieren hat das im Test nicht zuverlässig
        durchgereicht – und an dieser Stelle ist ein sauberer Neuaufbau
        ohnehin das, was man erwartet.
      */
      window.location.reload();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Das hat nicht geklappt."
      );
    } finally {
      setSending(false);
    }
  }

  /* Tastatur in der Großansicht: blättern, schließen, Herz setzen. */
  useEffect(() => {
    if (open === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight")
        setOpen((i) => (i === null ? null : Math.min(i + 1, assets.length - 1)));
      if (event.key === "ArrowLeft")
        setOpen((i) => (i === null ? null : Math.max(i - 1, 0)));
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (open !== null) void toggle(assets[open].id);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, assets, toggle]);

  const over = selectionLimit !== null && favorites.size > selectionLimit;

  return (
    <>
      <div className="mt-14 gap-4 [column-count:2] md:[column-count:3] xl:[column-count:4]">
        {assets.map((asset, index) => {
          const isFavorite = favorites.has(asset.id);
          const ratio =
            asset.width && asset.height ? asset.width / asset.height : 3 / 4;

          return (
            <figure
              key={asset.id}
              className="mb-4 break-inside-avoid"
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: `auto ${Math.round(400 / ratio)}px`,
              }}
            >
              <div className="group relative overflow-hidden rounded-lg bg-paper/40">
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  className="block w-full"
                  aria-label={`${asset.fileName} groß ansehen`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/portal/bild/${asset.id}?w=800`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={asset.width ?? undefined}
                    height={asset.height ?? undefined}
                    style={{ aspectRatio: String(ratio) }}
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    /*
                      Rechtsklick und Ziehen sind Bequemlichkeitsbremsen, keine
                      Sicherheit – ein Bildschirmfoto geht immer. Der echte
                      Schutz ist, dass hier nur eine verkleinerte, mit
                      Wasserzeichen versehene Fassung liegt.
                    */
                    onContextMenu={(event) => event.preventDefault()}
                    draggable={false}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => void toggle(asset.id)}
                  disabled={locked}
                  aria-pressed={isFavorite}
                  aria-label={
                    isFavorite ? "Aus der Auswahl nehmen" : "Zur Auswahl hinzufügen"
                  }
                  className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 disabled:opacity-40 ${
                    isFavorite
                      ? "bg-paper text-ink"
                      : "bg-black/30 text-paper opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
                  }`}
                >
                  <Heart filled={isFavorite} />
                </button>
              </div>
            </figure>
          );
        })}
      </div>

      {/* Großansicht */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setOpen(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/portal/bild/${assets[open].id}?w=1600`}
            alt=""
            onClick={(event) => event.stopPropagation()}
            onContextMenu={(event) => event.preventDefault()}
            draggable={false}
            className="max-h-[88svh] max-w-full object-contain"
          />

          <div
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(Math.max(0, open - 1))}
              disabled={open === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/15 text-paper disabled:opacity-30"
              aria-label="Vorheriges Bild"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => void toggle(assets[open].id)}
              disabled={locked}
              className={`flex h-12 items-center gap-3 rounded-full px-6 text-sm font-medium transition-colors duration-300 ${
                favorites.has(assets[open].id)
                  ? "bg-paper text-ink"
                  : "bg-paper/15 text-paper"
              }`}
            >
              <Heart filled={favorites.has(assets[open].id)} />
              {favorites.has(assets[open].id) ? "Ausgewählt" : "Auswählen"}
            </button>

            <button
              type="button"
              onClick={() => setOpen(Math.min(assets.length - 1, open + 1))}
              disabled={open === assets.length - 1}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/15 text-paper disabled:opacity-30"
              aria-label="Nächstes Bild"
            >
              →
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Schließen"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-paper/15 text-paper"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mitlaufende Leiste */}
      {!locked && (
        <div className="sticky bottom-0 z-40 -mx-[var(--shell-x)] mt-10 border-t border-ink/12 bg-sand/95 px-[var(--shell-x)] py-4 backdrop-blur">
          <div className="mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-4">
            <p className="text-sm leading-6 text-ink/75">
              <strong className="text-ink">{favorites.size}</strong>
              {selectionLimit !== null
                ? ` von ${selectionLimit} ausgewählt`
                : favorites.size === 1
                ? " Bild ausgewählt"
                : " Bilder ausgewählt"}
              {over && (
                <span className="block text-ink/60">
                  Mehr als im Paket enthalten – Regina meldet sich dazu.
                </span>
              )}
            </p>

            <button
              type="button"
              onClick={() => void submit()}
              disabled={favorites.size === 0 || sending}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft disabled:opacity-40"
            >
              {sending ? "Wird geschickt…" : "Auswahl abschicken"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-ink/70">
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden
    >
      <path d="M12 20.5s-7.5-4.6-7.5-9.7a4.3 4.3 0 0 1 7.5-2.9 4.3 4.3 0 0 1 7.5 2.9c0 5.1-7.5 9.7-7.5 9.7Z" />
    </svg>
  );
}
