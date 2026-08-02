import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Datenbankzugriff über Neons HTTP-Treiber.
 *
 * Bewusst HTTP und nicht die klassische Postgres-Verbindung: Serverless-
 * Funktionen leben Sekunden, ein Verbindungspool bringt dort nichts und
 * erschöpft bei Lastspitzen die Verbindungsgrenze der Datenbank. Über HTTP ist
 * jede Abfrage eigenständig.
 *
 * Preis dafür: keine echten Transaktionen über mehrere Abfragen hinweg. Wo wir
 * sie brauchen – etwa beim Abschicken der Auswahl – wird das mit einer
 * einzelnen Anweisung gelöst statt mit BEGIN/COMMIT.
 */
function connectionString(): string {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error(
      "DATABASE_URL fehlt. Ohne Datenbank kann das Kundenportal nicht starten."
    );
  }

  return url;
}

/**
 * Erst beim ersten Zugriff verbinden, nicht beim Import.
 *
 * Sonst würde jeder Build, jeder Test und jede Seite ohne Portalbezug eine
 * DATABASE_URL verlangen – und das Bauen der öffentlichen Website scheitern,
 * nur weil eine Umgebungsvariable fehlt.
 */
let cached: ReturnType<typeof createDb> | null = null;

function createDb() {
  return drizzle(neon(connectionString()), { schema });
}

export function db() {
  if (!cached) cached = createDb();
  return cached;
}

export { schema };
