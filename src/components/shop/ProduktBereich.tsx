"use client";

import { useState } from "react";
import {
  KATALOG,
  preisText,
  type Familie,
  type Variante,
} from "@/lib/shop/katalog";
import {
  berechneZuschnitt,
  hinweisText,
  mindestPixel,
} from "@/lib/shop/zuschnitt";

/**
 * Aus euren Bildern etwas machen.
 *
 * Steht bewusst UNTER dem Download und nicht darüber: Das Paar ist gekommen,
 * um seine Bilder zu holen, nicht um etwas zu kaufen. Wer zuerst einen
 * Verkaufsblock sieht, fühlt sich verkauft.
 *
 * Die Vorschau zeigt den Beschnitt, bevor jemand bestellt. Das ist keine
 * Verzierung: Ein Foto aus der Kamera ist 3:2, eine Leinwand 30 × 41 cm ist
 * 3:4 – irgendetwas fällt weg, und wenn niemand hinsieht, ist es der Kopf.
 */

type Korbeintrag = {
  sku: string;
  bezeichnung: string;
  assetIds: string[];
  preisCent: number;
};

export type ShopBild = {
  id: string;
  fileName: string;
  width: number | null;
  height: number | null;
};

export default function ProduktBereich({
  bilder,
}: {
  bilder: ShopBild[];
}) {
  const [familie, setFamilie] = useState<Familie | null>(null);
  const [sku, setSku] = useState<string | null>(null);
  const [bildId, setBildId] = useState<string | null>(bilder[0]?.id ?? null);

  /*
    Die Seitenfolge des Albums.

    Eine Liste, keine Menge – die Reihenfolge IST die Information. Seite 1 ist
    das erste Element, und wer ein Bild zweimal will, darf das: In einem Album
    kommt dasselbe Motiv durchaus auf die Titelseite und noch einmal gross
    nach hinten.
  */
  const [seiten, setSeiten] = useState<string[]>([]);

  /*
    Der Warenkorb liegt im Bauteil, nicht im Speicher des Browsers.

    Er haelt genau so lange, wie die Seite offen ist. Das ist Absicht: In ihm
    stehen die Kennungen von Hochzeitsbildern. Etwas, das ueber Tage in einem
    fremden Browser liegen bleibt, will ich dafuer nicht anlegen - und wer die
    Seite schliesst, hat die Auswahl in zwei Minuten wieder zusammengeklickt.
  */
  const [warenkorb, setWarenkorb] = useState<Korbeintrag[]>([]);

  const produkt = KATALOG.find((p) => p.id === familie) ?? null;
  // Steht weiter unten, braucht aber produkt/variante/pruefung - deshalb hier
  // nur die Deklaration und die Zuweisung nach der Pruefung.
  const variante: Variante | null =
    produkt?.varianten.find((v) => v.sku === sku) ?? produkt?.varianten[0] ?? null;
  const bild = bilder.find((b) => b.id === bildId) ?? bilder[0] ?? null;

  /*
    Ohne useMemo, mit Absicht.

    Das ist eine Handvoll Divisionen – sie zu merken kostet mehr, als sie zu
    rechnen. Und der React-Compiler kann die Memoisierung hier ohnehin nicht
    erhalten, weil darunter ein frühes return steht.
  */
  function pruefe(v: Variante) {
    if (!bild?.width || !bild?.height) return null;
    return berechneZuschnitt({
      quelleBreitePx: bild.width,
      quelleHoehePx: bild.height,
      zielBreiteCm: v.breiteCm,
      zielHoeheCm: v.hoeheCm,
    });
  }

  const pruefung = variante ? pruefe(variante) : null;

  /*
    Darf dieser Artikel in den Korb?

    Drei Gruende koennen dagegen sprechen, und jeder bekommt einen eigenen
    Satz. "Der Knopf ist grau" ist keine Antwort - der Kunde soll wissen, was
    ihm fehlt.
  */
  let bereit = false;
  let grund = "";

  if (produkt && variante) {
    if (produkt.seiten && seiten.length < produkt.seiten.min) {
      grund = `Es fehlen noch ${produkt.seiten.min - seiten.length} Seiten.`;
    } else if (!produkt.seiten && !bild) {
      grund = "Wähle ein Bild.";
    } else if (pruefung && !pruefung.bestellbar) {
      grund = "Dieses Bild ist für das gewählte Format zu klein.";
    } else {
      bereit = true;
    }
  }

  const summeCent = warenkorb.reduce((s, e) => s + e.preisCent, 0);

  if (bilder.length === 0) return null;

  return (
    <section className="border-b border-paper/10 px-[var(--shell-x)] py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-paper/50">Aus euren Bildern</p>
        <h2 className="display-lg mt-5 text-paper">
          Etwas, das <span className="accent-italic">bleibt</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-8 text-paper/65">
          Album, Leinwand oder gerahmter Druck – mit euren eigenen Bildern.
          Gefertigt in Deutschland und den Niederlanden, geliefert in wenigen
          Tagen.
        </p>

        {/* --- Produktwahl --------------------------------------------- */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {KATALOG.map((p) => {
            const aktiv = p.id === familie;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setFamilie(aktiv ? null : p.id);
                  /*
                    Das groesste Format, das dieses Bild traegt – nicht
                    stumpf das erste. Sonst startet die Auswahl bei einem
                    ausgegrauten Eintrag und wirkt kaputt.
                  */
                  const passend = [...p.varianten]
                    .reverse()
                    .find((v) => {
                      const g = pruefe(v);
                      return !g || g.bestellbar;
                    });
                  setSku((passend ?? p.varianten[0]).sku);
                  setSeiten([]);
                }}
                aria-pressed={aktiv}
                className={`rounded-2xl border p-6 text-left transition-colors duration-300 ${
                  aktiv
                    ? "border-paper/60 bg-paper/8"
                    : "border-paper/15 hover:border-paper/35"
                }`}
              >
                <h3 className="font-display text-xl text-paper">{p.name}</h3>
                <p className="mt-2 text-sm leading-6 text-paper/60">
                  {p.einzeiler}
                </p>
                <p className="mt-4 text-sm text-paper/75">
                  ab {preisText(Math.min(...p.varianten.map((v) => v.preisCent)))}
                </p>
              </button>
            );
          })}
        </div>

        {/* --- Warenkorb ------------------------------------------------ */}
        {warenkorb.length > 0 && (
          <div className="mt-12 rounded-2xl border border-paper/25 bg-paper/5 p-6 md:p-8">
            <h3 className="font-display text-xl text-paper">Warenkorb</h3>

            <ul className="mt-5 divide-y divide-paper/10 border-y border-paper/10">
              {warenkorb.map((e, i) => (
                <li
                  key={`${e.sku}-${i}`}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <span className="text-paper/80">
                    {e.bezeichnung}
                    {e.assetIds.length > 1 && (
                      <span className="ml-2 text-paper/45">
                        {e.assetIds.length} Seiten
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-5">
                    <span className="text-paper/80">
                      {preisText(e.preisCent)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setWarenkorb((k) => k.filter((_, j) => j !== i))
                      }
                      aria-label={`${e.bezeichnung} entfernen`}
                      className="text-paper/40 transition-colors duration-300 hover:text-paper"
                    >
                      ✕
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-paper/60">Summe</span>
              <span className="font-display text-2xl text-paper">
                {preisText(summeCent)}
              </span>
            </div>

            {/*
              Noch keine Bezahlung.

              Ein Knopf, der eine Bestellung annimmt, ohne dass Geld fliesst,
              waere der schlimmere Fehler: Die Kundschaft glaubt bestellt zu
              haben, und niemand liefert.
            */}
            <button
              type="button"
              disabled
              className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-paper px-6 text-sm font-medium text-ink opacity-30"
            >
              Weiter zur Bezahlung
            </button>
            <p className="mt-3 text-center text-xs leading-6 text-paper/45">
              Bezahlung wird gerade gebaut – noch nichts verbindlich
            </p>

            <p className="mt-6 text-xs leading-6 text-paper/40">
              Preise inklusive Versand. Kein Ausweis der Umsatzsteuer gemäß
              § 19 UStG.
            </p>
          </div>
        )}

        {/* --- Konfigurator -------------------------------------------- */}
        {produkt && variante && (
          <div className="mt-12 rounded-2xl border border-paper/15 p-6 md:p-8">
            <p className="text-base leading-8 text-paper/70">
              {produkt.beschreibung}
            </p>

            <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
              {/* Vorschau mit Beschnitt */}
              <div>
                <p className="text-sm text-paper/55">
                  So wird es gedruckt – der Ausschnitt ist mittig gesetzt.
                </p>

                {/*
                  Die Hoehe ist gedeckelt, und das ist keine Kosmetik: Bei
                  61 x 91 cm wird die Vorschau so hoch, dass der
                  Aufloesungshinweis darunter aus dem Bild rutscht - also
                  genau die Information, wegen der es die Vorschau gibt.
                */}
                <div
                  className="mt-4 mx-auto max-h-[26rem] overflow-hidden rounded-lg bg-ink-soft"
                  style={{
                    aspectRatio: `${variante.breiteCm} / ${variante.hoeheCm}`,
                    maxWidth: `calc(26rem * ${variante.breiteCm} / ${variante.hoeheCm})`,
                  }}
                >
                  {bild && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`/api/portal/bild/${bild.id}?w=800`}
                      alt=""
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                      /*
                        object-cover schneidet mittig zu – exakt das, was
                        berechneZuschnitt rechnet. Die Vorschau und die Zahl
                        darunter beschreiben also dasselbe.
                      */
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                {pruefung && (
                  <p
                    className={`mt-4 text-sm leading-7 ${
                      pruefung.bestellbar ? "text-paper/60" : "text-paper"
                    }`}
                  >
                    {hinweisText(pruefung)}
                    {!pruefung.bestellbar && bild && (
                      <span className="mt-2 block text-paper/60">
                        Für {variante.bezeichnung} bräuchte es mindestens{" "}
                        {mindestPixel(variante.breiteCm, variante.hoeheCm).breite}{" "}
                        ×{" "}
                        {mindestPixel(variante.breiteCm, variante.hoeheCm).hoehe}{" "}
                        Pixel – dieses Bild hat {bild.width} × {bild.height}.
                      </span>
                    )}
                  </p>
                )}

                {!pruefung && (
                  <p className="mt-4 text-sm leading-7 text-paper/60">
                    Von diesem Bild sind die Maße nicht bekannt – ohne sie lässt
                    sich nicht prüfen, ob die Auflösung reicht.
                  </p>
                )}
              </div>

              {/* Auswahl */}
              <div>
                <fieldset>
                  <legend className="text-sm font-medium text-paper/80">
                    Format
                  </legend>
                  {/*
                    Was nicht passt, ist ausgegraut – nicht erst nach der
                    Auswahl abgelehnt. Wer ein Format anklicken kann, das er
                    nicht bekommen kann, hat die Wahl umsonst getroffen.
                  */}
                  <div className="mt-3 flex flex-col gap-2">
                    {produkt.varianten.map((v) => {
                      const p = pruefe(v);
                      const geht = !p || p.bestellbar;

                      return (
                        <button
                          key={v.sku}
                          type="button"
                          onClick={() => geht && setSku(v.sku)}
                          disabled={!geht}
                          aria-pressed={v.sku === variante.sku}
                          className={`flex flex-col rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-300 ${
                            !geht
                              ? "cursor-not-allowed border-paper/10 text-paper/30"
                              : v.sku === variante.sku
                              ? "border-paper/60 bg-paper/8 text-paper"
                              : "border-paper/15 text-paper/70 hover:border-paper/35"
                          }`}
                        >
                          <span className="flex w-full items-center justify-between">
                            <span>{v.bezeichnung}</span>
                            <span>{preisText(v.preisCent)}</span>
                          </span>
                          {!geht && (
                            <span className="mt-1 text-xs text-paper/35">
                              Für dieses Bild zu groß
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {bilder.length > 1 && (
                  <fieldset className="mt-8">
                    <legend className="text-sm font-medium text-paper/80">
                      {produkt.seiten ? "Bilder antippen" : "Welches Bild?"}
                    </legend>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {bilder.slice(0, 20).map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setBildId(b.id);
                            // Beim Album ist ein Klick "Seite anhaengen",
                            // nicht "Auswahl umschalten".
                            if (produkt.seiten) {
                              setSeiten((s) =>
                                s.length < produkt.seiten!.max ? [...s, b.id] : s
                              );
                            }
                          }}
                          aria-pressed={b.id === bild?.id}
                          aria-label={b.fileName}
                          className={`overflow-hidden rounded transition-opacity duration-300 ${
                            b.id === bild?.id
                              ? "ring-2 ring-paper"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/portal/bild/${b.id}?w=400`}
                            alt=""
                            loading="lazy"
                            draggable={false}
                            className="aspect-square w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {produkt.seiten && (
                  <div className="mt-8">
                    <p className="text-sm font-medium text-paper/80">
                      Seiten ({seiten.length} von {produkt.seiten.min}–
                      {produkt.seiten.max})
                    </p>

                    {seiten.length === 0 ? (
                      <p className="mt-3 text-sm leading-7 text-paper/55">
                        Tippt unten auf die Bilder – in der Reihenfolge, in der
                        sie im Album stehen sollen.
                      </p>
                    ) : (
                      <ol className="mt-3 flex flex-col gap-1">
                        {seiten.map((id, i) => {
                          const b = bilder.find((x) => x.id === id);
                          return (
                            <li
                              key={`${id}-${i}`}
                              className="flex items-center justify-between gap-3 rounded-lg border border-paper/12 px-3 py-2 text-sm"
                            >
                              <span className="text-paper/70">
                                Seite {i + 1}
                                <span className="ml-2 text-paper/40">
                                  {b?.fileName}
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setSeiten((s) =>
                                    s.filter((_, j) => j !== i)
                                  )
                                }
                                aria-label={`Seite ${i + 1} entfernen`}
                                className="text-paper/40 transition-colors duration-300 hover:text-paper"
                              >
                                ✕
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    )}

                    {seiten.length > 0 && seiten.length < produkt.seiten.min && (
                      <p className="mt-3 text-sm leading-7 text-paper/55">
                        Es fehlen noch {produkt.seiten.min - seiten.length}{" "}
                        Seiten bis zum kleinsten Album.
                      </p>
                    )}
                  </div>
                )}

                {/*
                  Noch kein Warenkorb.

                  Dieser Teil ist ein Entwurf zum Anschauen: Es gibt keine
                  Bezahlung und keine Bestellung. Lieber ein Knopf, der ehrlich
                  sagt, dass er noch nicht drückt, als einer, der ins Leere
                  führt.
                */}
                <button
                  type="button"
                  onClick={() => {
                    if (!bereit) return;
                    setWarenkorb((k) => [
                      ...k,
                      {
                        sku: variante.sku,
                        bezeichnung: `${produkt.name} ${variante.bezeichnung}`,
                        assetIds: produkt.seiten
                          ? seiten
                          : bild
                          ? [bild.id]
                          : [],
                        preisCent: variante.preisCent,
                      },
                    ]);
                    setSeiten([]);
                    setFamilie(null);
                  }}
                  disabled={!bereit}
                  className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-paper px-6 text-sm font-medium text-ink transition-opacity duration-300 hover:opacity-85 disabled:opacity-30"
                >
                  In den Warenkorb
                </button>
                {!bereit && (
                  <p className="mt-3 text-center text-xs leading-6 text-paper/45">
                    {grund}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
