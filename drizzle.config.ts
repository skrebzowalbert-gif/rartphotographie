import type { Config } from "drizzle-kit";

/**
 * Migrationen werden als SQL-Dateien erzeugt und eingecheckt, nicht per
 * "push" direkt auf die Datenbank geschoben. Bei einem Portal mit fremden
 * Hochzeitsbildern will man nachlesen können, welche Änderung wann lief –
 * und sie im Zweifel zurücknehmen.
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
} satisfies Config;
