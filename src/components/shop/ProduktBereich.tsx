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

  const produkt = KATALOG.find((p) => p.id === familie) ?? null;
  const variante: Variante | null =
    produkt?.varianten.find((v) => v.sku === sku) ?? produkt?.varianten[0] ?? null;
  const bild = bilder.find((b) => b.id === bildId) ?? bilder[0] ?? null;

  /*
    Ohne useMemo, mit Absicht.

    Das ist eine Handvoll Divisionen – sie zu merken kostet mehr, als sie zu
    rechnen. Und der React-Compiler kann die Memoisierung hier ohnehin nicht
    erhalten, weil darunter ein frühes return steht.
  */
  const pruefung =
    variante && bild?.width && bild?.height
      ? berechneZuschnitt({
          quelleBreitePx: bild.width,
          quelleHoehePx: bild.height,
          zielBreiteCm: variante.breiteCm,
          zielHoeheCm: variante.hoeheCm,
        })
      : null;

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
                  setSku(p.varianten[0].sku);
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
                  <div className="mt-3 flex flex-col gap-2">
                    {produkt.varianten.map((v) => (
                      <button
                        key={v.sku}
                        type="button"
                        onClick={() => setSku(v.sku)}
                        aria-pressed={v.sku === variante.sku}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-300 ${
                          v.sku === variante.sku
                            ? "border-paper/60 bg-paper/8 text-paper"
                            : "border-paper/15 text-paper/70 hover:border-paper/35"
                        }`}
                      >
                        <span>{v.bezeichnung}</span>
                        <span>{preisText(v.preisCent)}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {bilder.length > 1 && (
                  <fieldset className="mt-8">
                    <legend className="text-sm font-medium text-paper/80">
                      {produkt.bilder === "mehrere"
                        ? "Titelbild"
                        : "Welches Bild?"}
                    </legend>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {bilder.slice(0, 20).map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setBildId(b.id)}
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

                {/*
                  Noch kein Warenkorb.

                  Dieser Teil ist ein Entwurf zum Anschauen: Es gibt keine
                  Bezahlung und keine Bestellung. Lieber ein Knopf, der ehrlich
                  sagt, dass er noch nicht drückt, als einer, der ins Leere
                  führt.
                */}
                <button
                  type="button"
                  disabled
                  className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-paper px-6 text-sm font-medium text-ink opacity-40"
                >
                  In den Warenkorb
                </button>
                <p className="mt-3 text-center text-xs leading-6 text-paper/45">
                  Entwurf – Bestellung und Bezahlung folgen
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
