import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { findeVariante } from "./katalog";
import { berechneZuschnitt } from "./zuschnitt";

/**
 * Eine Bestellung entgegennehmen.
 *
 * Der Grundsatz hier: **Dem Browser wird nichts geglaubt.** Was von dort
 * kommt, sind Wünsche – Artikelnummer, Bild, Stückzahl. Alles andere rechnet
 * der Server neu:
 *
 *   – der Preis, aus dem Katalog. Sonst bestimmt der Käufer, was er zahlt.
 *   – die Bildzugehörigkeit. Sonst liesse sich mit einer fremden Kennung ein
 *     Bild aus einer anderen Galerie in ein Album bestellen – und der Druck
 *     ginge an die eigene Adresse.
 *   – die Auflösung. Sonst umgeht ein manipulierter Aufruf genau die Sperre,
 *     die verhindert, dass Regina ein unscharfes Bild zugerechnet wird.
 *
 * Jede dieser drei Prüfungen existiert, weil ihr Fehlen einen konkreten
 * Missbrauch erlauben würde, nicht aus Prinzip.
 */

export type PositionWunsch = {
  sku: string;
  assetIds: string[];
  stueck: number;
};

export type Angelegt =
  | { ok: true; orderId: string; summeCent: number }
  | { ok: false; grund: string };

const MAX_POSITIONEN = 20;
const MAX_STUECK = 10;

export async function legeBestellungAn(params: {
  projectId: string;
  positionen: PositionWunsch[];
}): Promise<Angelegt> {
  const { projectId, positionen } = params;

  if (positionen.length === 0) return { ok: false, grund: "Der Warenkorb ist leer." };
  if (positionen.length > MAX_POSITIONEN) {
    return { ok: false, grund: "Zu viele Positionen." };
  }

  /*
    Die Enddateien dieser Galerie – einmal geladen, dann als Nachschlagewerk.

    Entscheidend ist das "dieser Galerie": Damit kann kein Bild aus einer
    fremden Galerie in die Bestellung wandern, egal was der Browser schickt.
  */
  const erlaubt = await db()
    .select({
      id: schema.assets.id,
      width: schema.assets.width,
      height: schema.assets.height,
    })
    .from(schema.assets)
    .where(
      and(
        eq(schema.assets.projectId, projectId),
        eq(schema.assets.kind, "final")
      )
    );

  const nachId = new Map(erlaubt.map((a) => [a.id, a]));

  const gepruefte: {
    sku: string;
    bezeichnung: string;
    assetIds: string[];
    stueck: number;
    preisCent: number;
  }[] = [];

  let summeCent = 0;

  for (const wunsch of positionen) {
    const treffer = findeVariante(wunsch.sku);
    if (!treffer) return { ok: false, grund: "Unbekannter Artikel." };

    const { produkt, variante } = treffer;

    const stueck = Math.floor(wunsch.stueck);
    if (!Number.isFinite(stueck) || stueck < 1 || stueck > MAX_STUECK) {
      return { ok: false, grund: "Ungültige Stückzahl." };
    }

    if (wunsch.assetIds.length === 0) {
      return { ok: false, grund: "Zu einem Artikel fehlt das Bild." };
    }

    // Ein Bild bei Leinwand und Rahmen, mehrere nur beim Album.
    if (produkt.bilder === "eins" && wunsch.assetIds.length !== 1) {
      return { ok: false, grund: "Dieser Artikel nimmt genau ein Bild auf." };
    }

    if (produkt.seiten) {
      const { min, max } = produkt.seiten;
      if (wunsch.assetIds.length < min || wunsch.assetIds.length > max) {
        return {
          ok: false,
          grund: `Ein Album fasst ${min} bis ${max} Seiten – gewählt sind ${wunsch.assetIds.length}.`,
        };
      }
    }

    for (const assetId of wunsch.assetIds) {
      const asset = nachId.get(assetId);
      if (!asset) {
        return { ok: false, grund: "Ein gewähltes Bild gehört nicht zu dieser Galerie." };
      }

      /*
        Auflösung serverseitig nachrechnen.

        Die Oberfläche graut zu grosse Formate aus – aber die Oberfläche liegt
        beim Käufer, und was dort ausgegraut ist, lässt sich mit einem
        selbstgebauten Aufruf umgehen. Die Sperre gilt hier oder gar nicht.
      */
      if (asset.width && asset.height) {
        const z = berechneZuschnitt({
          quelleBreitePx: asset.width,
          quelleHoehePx: asset.height,
          zielBreiteCm: variante.breiteCm,
          zielHoeheCm: variante.hoeheCm,
        });
        if (!z.bestellbar) {
          return {
            ok: false,
            grund: `Ein Bild ist für ${variante.bezeichnung} zu klein.`,
          };
        }
      }
    }

    // Der Preis kommt aus dem Katalog, nie aus der Anfrage.
    const preisCent = variante.preisCent;
    summeCent += preisCent * stueck;

    gepruefte.push({
      sku: variante.sku,
      bezeichnung: `${produkt.name} ${variante.bezeichnung}`,
      assetIds: wunsch.assetIds,
      stueck,
      preisCent,
    });
  }

  const [bestellung] = await db()
    .insert(schema.orders)
    .values({ projectId, totalCent: summeCent, status: "entwurf" })
    .returning({ id: schema.orders.id });

  await db()
    .insert(schema.orderItems)
    .values(gepruefte.map((p) => ({ orderId: bestellung.id, ...p })));

  return { ok: true, orderId: bestellung.id, summeCent };
}

/** Die Positionen einer Bestellung – für Bestätigung und Druckauftrag. */
export function positionen(orderId: string) {
  return db()
    .select()
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, orderId));
}

/** Prüft, ob alle genannten Bilder noch existieren. Für den Druckauftrag. */
export async function bilderVorhanden(assetIds: string[]): Promise<boolean> {
  if (assetIds.length === 0) return false;
  const gefunden = await db()
    .select({ id: schema.assets.id })
    .from(schema.assets)
    .where(inArray(schema.assets.id, assetIds));
  return gefunden.length === new Set(assetIds).size;
}
