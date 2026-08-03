"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

/**
 * Die Galerie, die das Brautpaar sieht.
 *
 * Gestaltungsentscheidungen, die den Unterschied machen:
 *
 * – Dunkler Grund, randlose Bilder. Eine Hochzeitsgalerie ist kein Formular:
 *   Auf Sand mit Kästchen und Abständen sieht jedes Foto aus wie ein Beleg.
 *   Dunkel tritt die Oberfläche zurück, und was leuchtet, sind die Bilder.
 *
 * – Ein großes Auftaktbild mit den Namen darüber. Der erste Bildschirm gehört
 *   dem Paar, nicht der Bedienung.
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
 *
 * – Jede Bildadresse trägt "ansicht=kunde". Das ist keine Zierde: Die
 *   Bildroute entschied bisher allein danach, WER fragt – wer als Regina
 *   angemeldet war, bekam die Fassung ohne Wasserzeichen, auch hier in der
 *   Kundengalerie. Genau darüber sind Regina und Albert gestolpert: Sie
 *   öffneten die Galerie im selben Browser, in dem sie in der Verwaltung
 *   angemeldet waren, sahen keine Wasserzeichen und mussten annehmen, dass
 *   die Kundschaft auch keine sieht. Nicht die Person entscheidet über die
 *   Darstellung, sondern die Seite.
 */

export type GalleryAsset = {
  id: string;
  fileName: string;
  width: number | null;
  height: number | null;
};

export default function GalleryClient({
  projectId,
  title,
  intro,
  assets,
  initialFavorites,
  selectionLimit,
  locked,
}: {
  projectId: string;
  title: string;
  intro: ReactNode;
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
  const [nurAuswahl, setNurAuswahl] = useState(false);

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

  /*
    Die gezeigten Bilder.

    "Nur Auswahl" ist keine Spielerei: Wer aus 400 Aufnahmen 40 herausgesucht
    hat, will vor dem Abschicken sehen, was er da eigentlich zusammengestellt
    hat – ohne durch alles andere zu scrollen.
  */
  const sichtbar = nurAuswahl
    ? assets.filter((asset) => favorites.has(asset.id))
    : assets;

  /* Tastatur in der Großansicht: blättern, schließen, Herz setzen. */
  useEffect(() => {
    if (open === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight")
        setOpen((i) =>
          i === null ? null : Math.min(i + 1, sichtbar.length - 1)
        );
      if (event.key === "ArrowLeft")
        setOpen((i) => (i === null ? null : Math.max(i - 1, 0)));
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (open !== null) void toggle(sichtbar[open].id);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, sichtbar, toggle]);

  // Die Großansicht darf nicht offen bleiben, wenn darunter gefiltert wird –
  // sonst zeigt sie plötzlich ein anderes Bild als das angetippte.
  useEffect(() => {
    setOpen(null);
  }, [nurAuswahl]);

  const over = selectionLimit !== null && favorites.size > selectionLimit;
  const hero = assets[0];

  return (
    <>
      {/* ---------------------------------------------------------------
          Auftakt: ein Bild über den ganzen Bildschirm, die Namen darüber.
          --------------------------------------------------------------- */}
      <header className="relative h-[78svh] min-h-[26rem] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/portal/bild/${hero.id}?w=1600&ansicht=kunde`}
          alt=""
          /*
            Das erste Bild ist das einzige, das sofort gebraucht wird – und
            deshalb das einzige ohne loading="lazy". fetchPriority hebt es vor
            die Vorschaubilder darunter, die der Browser sonst parallel zieht.
          */
          fetchPriority="high"
          decoding="async"
          onContextMenu={(event) => event.preventDefault()}
          draggable={false}
          className="h-full w-full object-cover"
        />

        {/* Verlauf statt Deckschleier: unten dunkel genug für Schrift,
            oben bleibt das Bild unangetastet. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink" />

        {/* Statt der öffentlichen Menüleiste nur der Namenszug – die Galerie
            ist keine Werbefläche, soll aber erkennbar von Regina sein. */}
        <p className="eyebrow absolute left-[var(--shell-x)] top-8 text-paper/75">
          R.Artphotographie
        </p>

        <div className="absolute inset-x-0 bottom-0 px-[var(--shell-x)] pb-14">
          <p className="eyebrow text-paper/65">Eure Galerie</p>
          <h1 className="display-xl mt-4 max-w-[16ch] text-paper">{title}</h1>
        </div>
      </header>

      {/* ---------------------------------------------------------------
          Mitlaufende Leiste: Zählstand und der Weg nach draußen.
          --------------------------------------------------------------- */}
      <div className="sticky top-0 z-40 border-b border-paper/10 bg-ink/85 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-[var(--shell-x)] py-3.5">
          <div className="flex items-center gap-5">
            <p className="text-sm text-paper/70">
              <strong className="font-medium text-paper">
                {favorites.size}
              </strong>
              {selectionLimit !== null
                ? ` von ${selectionLimit} gewählt`
                : favorites.size === 1
                ? " Bild gewählt"
                : " Bilder gewählt"}
            </p>

            {favorites.size > 0 && (
              <button
                type="button"
                onClick={() => setNurAuswahl((v) => !v)}
                aria-pressed={nurAuswahl}
                className="text-sm text-paper/55 underline decoration-paper/25 underline-offset-4 transition-colors duration-300 hover:text-paper"
              >
                {nurAuswahl ? "Alle zeigen" : "Nur Auswahl"}
              </button>
            )}
          </div>

          {!locked && (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={favorites.size === 0 || sending}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-paper px-6 text-sm font-medium text-ink transition-opacity duration-300 hover:opacity-85 disabled:opacity-30"
            >
              {sending ? "Wird geschickt…" : "Auswahl abschicken"}
            </button>
          )}
        </div>

        {over && (
          <p className="px-[var(--shell-x)] pb-3 text-sm text-paper/55">
            Mehr als im Paket enthalten – Regina meldet sich dazu.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="px-[var(--shell-x)] pb-3 text-sm text-paper/70"
          >
            {error}
          </p>
        )}
      </div>

      {/* Der einleitende Satz bekommt Luft und eine schmale Spalte – auf
          voller Breite läse ihn niemand. */}
      <div className="px-[var(--shell-x)] py-14 md:py-20">
        <p className="mx-auto max-w-2xl text-center text-base leading-8 text-paper/65">
          {intro}
        </p>
      </div>

      {/* ---------------------------------------------------------------
          Das Mosaik. Randlos, mit Haarlinien statt Abständen.
          --------------------------------------------------------------- */}
      <div className="[column-count:2] [column-gap:3px] md:[column-count:3] xl:[column-count:4] 2xl:[column-count:5]">
        {sichtbar.map((asset, index) => {
          const isFavorite = favorites.has(asset.id);
          const ratio =
            asset.width && asset.height ? asset.width / asset.height : 3 / 4;

          return (
            <figure
              key={asset.id}
              className="mb-[3px] break-inside-avoid"
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: `auto ${Math.round(400 / ratio)}px`,
              }}
            >
              <div className="group relative overflow-hidden bg-ink-soft">
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  className="block w-full"
                  aria-label={`${asset.fileName} groß ansehen`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/portal/bild/${asset.id}?w=800&ansicht=kunde`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={asset.width ?? undefined}
                    height={asset.height ?? undefined}
                    style={{ aspectRatio: String(ratio) }}
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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

                {/* Ausgewähltes bleibt auch ohne Herz erkennbar: ein feiner
                    heller Rahmen, der beim Überfliegen sofort ins Auge fällt. */}
                {isFavorite && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-paper/85"
                  />
                )}

                <button
                  type="button"
                  onClick={() => void toggle(asset.id)}
                  disabled={locked}
                  aria-pressed={isFavorite}
                  aria-label={
                    isFavorite
                      ? "Aus der Auswahl nehmen"
                      : "Zur Auswahl hinzufügen"
                  }
                  className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 disabled:opacity-40 ${
                    isFavorite
                      ? "bg-paper text-ink"
                      : "bg-ink/45 text-paper opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
                  }`}
                >
                  <Heart filled={isFavorite} />
                </button>
              </div>
            </figure>
          );
        })}
      </div>

      {nurAuswahl && sichtbar.length === 0 && (
        <p className="px-[var(--shell-x)] py-20 text-center text-paper/55">
          Hier ist noch nichts. Tippe auf die Herzen, was ihr haben möchtet.
        </p>
      )}

      {/* Großansicht */}
      {open !== null && sichtbar[open] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/97 p-4"
          onClick={() => setOpen(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/portal/bild/${sichtbar[open].id}?w=1600&ansicht=kunde`}
            alt=""
            onClick={(event) => event.stopPropagation()}
            onContextMenu={(event) => event.preventDefault()}
            draggable={false}
            className="max-h-[86svh] max-w-full object-contain"
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
              onClick={() => void toggle(sichtbar[open].id)}
              disabled={locked}
              className={`flex h-12 items-center gap-3 rounded-full px-6 text-sm font-medium transition-colors duration-300 ${
                favorites.has(sichtbar[open].id)
                  ? "bg-paper text-ink"
                  : "bg-paper/15 text-paper"
              }`}
            >
              <Heart filled={favorites.has(sichtbar[open].id)} />
              {favorites.has(sichtbar[open].id) ? "Ausgewählt" : "Auswählen"}
            </button>

            <button
              type="button"
              onClick={() => setOpen(Math.min(sichtbar.length - 1, open + 1))}
              disabled={open === sichtbar.length - 1}
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
