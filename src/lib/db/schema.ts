/**
 * Datenmodell des Kundenportals.
 *
 * Zwei Leitentscheidungen, die den Rest erklären:
 *
 * 1. Kunden haben KEIN Nutzerkonto. Der Zugang ist ein Galerie-Passwort plus
 *    ein signiertes Cookie. Damit entfallen Registrierung, Passwort-vergessen,
 *    E-Mail-Enumeration und die halbe Angriffsfläche – und der Kunde muss sich
 *    nichts merken außer dem Link.
 *
 * 2. Vorschau und Enddateien sind getrennte Datensätze (`assets.kind`), keine
 *    zwei Spalten am selben Bild. Regina lädt in Phase 2 die BEARBEITETEN
 *    Dateien hoch; das sind andere Dateien als die Vorschauen, oft mit anderem
 *    Namen. Ein gemeinsamer Datensatz würde diese Realität verbiegen.
 */

import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Lebenszyklus einer Galerie. Bewusst als Aufzählung in der Datenbank und
 * nicht als freier Text: Ein Tippfehler im Status würde eine Galerie für die
 * Kundschaft unsichtbar oder – schlimmer – vorzeitig sichtbar machen.
 */
export const projectStatus = pgEnum("project_status", [
  /** Regina lädt noch hoch, für Kunden gesperrt. */
  "draft",
  /** Freigegeben, Kunden wählen aus. */
  "selecting",
  /** Auswahl abgeschickt, Regina bearbeitet. */
  "selected",
  /** Enddateien liegen bereit, Download offen. */
  "delivered",
]);

export const assetKind = pgEnum("asset_kind", [
  /** Auswahlbild, immer verkleinert, optional mit Wasserzeichen. */
  "preview",
  /** Bearbeitete Enddatei in voller Auflösung. */
  "final",
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Teil der Galerie-Adresse. Nicht erratbar, siehe createProjectSlug(). */
    slug: text("slug").notNull(),

    /** "Julia & Max – Hochzeit" */
    title: text("title").notNull(),
    clientName: text("client_name").notNull(),

    status: projectStatus("status").notNull().default("draft"),

    /**
     * scrypt-Hash des Galerie-Passworts, Format siehe lib/portal/password.ts.
     * Niemals das Passwort selbst – auch nicht "nur zum Anzeigen für Regina".
     * Wenn sie es vergisst, wird ein neues gesetzt.
     */
    passwordHash: text("password_hash").notNull(),

    /** Schaltbar pro Galerie, wirkt sofort ohne Neuberechnung der Bilder. */
    watermarkEnabled: boolean("watermark_enabled").notNull().default(true),

    /** Etwa "40 Bilder sind im Paket enthalten". Null = unbegrenzt. */
    selectionLimit: integer("selection_limit"),

    /**
     * Nach diesem Zeitpunkt kein Zugriff mehr, danach werden die Dateien
     * gelöscht. Gleichzeitig Löschkonzept nach Art. 17 DSGVO und Bremse für
     * die Speicherkosten.
     */
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    selectionSubmittedAt: timestamp("selection_submitted_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("projects_slug_idx").on(table.slug)]
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),

    kind: assetKind("kind").notNull(),

    /** Schlüssel im R2-Bucket. Nie öffentlich, nie im HTML. */
    r2Key: text("r2_key").notNull(),

    /**
     * Ursprünglicher Dateiname aus Lightroom, z. B. "IMG_4821.jpg".
     * Der wichtigste Wert im ganzen Modell: Aus ihm baut sich die Liste, die
     * Regina nach der Auswahl in Lightroom einfügt.
     */
    fileName: text("file_name").notNull(),

    byteSize: bigint("byte_size", { mode: "number" }).notNull(),
    width: integer("width"),
    height: integer("height"),

    /**
     * Winziger Base64-Platzhalter in der Farbigkeit des Bildes. Verhindert,
     * dass beim Scrollen graue Kästen springen – bei 600 Bildern der
     * Unterschied zwischen "wirkt teuer" und "wirkt billig".
     */
    blurhash: text("blurhash"),

    sortIndex: integer("sort_index").notNull().default(0),

    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("assets_r2_key_idx").on(table.r2Key),
    index("assets_project_kind_idx").on(table.projectId, table.kind, table.sortIndex),
  ]
);

/**
 * Ein gemeinsamer Favoritenstapel pro Galerie, nicht einer je Person.
 * Brautpaare wählen erfahrungsgemäß zusammen; getrennte Listen müsste man
 * hinterher wieder zusammenführen und das erzeugt nur Streit.
 *
 * Welche Sitzung das Herz gesetzt hat, wird trotzdem festgehalten – für die
 * Nachvollziehbarkeit, nicht für die Anzeige.
 */
export const favorites = pgTable(
  "favorites",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("favorites_pk").on(table.projectId, table.assetId),
    index("favorites_project_idx").on(table.projectId),
  ]
);

/**
 * Kundensitzung. Existiert serverseitig, damit Regina einen Zugang jederzeit
 * widerrufen kann – ein rein signiertes Cookie ohne Gegenstück in der
 * Datenbank ließe sich bis zum Ablauf nicht zurücknehmen.
 */
export const gallerySessions = pgTable(
  "gallery_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),

    /**
     * IP und Browserkennung nur als Hash. Für die Missbrauchserkennung reicht
     * der Vergleich zweier Hashes; die Klartextwerte brauchen wir nie und
     * dürfen sie nach dem Grundsatz der Datenminimierung auch nicht vorhalten.
     */
    ipHash: text("ip_hash").notNull(),
    userAgentHash: text("user_agent_hash").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [index("gallery_sessions_project_idx").on(table.projectId)]
);

/**
 * Fehlversuche beim Galerie-Passwort. Liegt in der Datenbank statt im
 * Arbeitsspeicher, weil Serverless-Funktionen keinen gemeinsamen Zustand
 * haben – eine Zählung im Prozess wäre nach jedem Kaltstart wieder bei null
 * und damit wirkungslos.
 */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    ipHash: text("ip_hash").notNull(),
    succeeded: boolean("succeeded").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("login_attempts_project_at_idx").on(table.projectId, table.at),
    index("login_attempts_ip_at_idx").on(table.ipHash, table.at),
  ]
);

/* ------------------------------------------------------------------ */
/* Reginas Zugang                                                      */
/* ------------------------------------------------------------------ */

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("admin_users_email_idx").on(table.email)]
);

/**
 * Passkeys. Kein Passwort, das abgefischt oder wiederverwendet werden kann,
 * und der Zugang ist an das Gerät gebunden. Für ein Portal mit fremden
 * Hochzeitsbildern die einzige Anmeldeart, die ich verantworten möchte.
 */
export const adminCredentials = pgTable(
  "admin_credentials",
  {
    /** WebAuthn credential ID, base64url. */
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),

    publicKey: text("public_key").notNull(),

    /**
     * Signaturzähler des Authenticators. Springt er zurück, ist der Schlüssel
     * geklont – dann wird die Anmeldung verweigert.
     */
    counter: bigint("counter", { mode: "number" }).notNull().default(0),

    transports: text("transports").array(),
    label: text("label").notNull().default("Gerät"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  },
  (table) => [index("admin_credentials_user_idx").on(table.userId)]
);

/** Kurzlebige Challenges für die WebAuthn-Anmeldung. */
export const adminChallenges = pgTable("admin_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  challenge: text("challenge").notNull(),
  userId: uuid("user_id").references(() => adminUsers.id, {
    onDelete: "cascade",
  }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [index("admin_sessions_user_idx").on(table.userId)]
);

/**
 * Wer hat wann was getan. Braucht es aus zwei Gründen: Als Fotografin muss
 * Regina im Streitfall belegen können, dass eine Galerie freigegeben oder
 * gelöscht wurde – und Art. 5 Abs. 2 DSGVO verlangt, die Einhaltung
 * nachweisen zu können.
 */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),

    /** "admin" | "client" | "system" */
    actor: text("actor").notNull(),
    actorId: text("actor_id"),

    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),

    /** Punktnotation, z. B. "project.created" oder "gallery.login.failed". */
    action: text("action").notNull(),

    /** Niemals Klartext-IPs oder Passwörter hier ablegen. */
    detail: jsonb("detail"),
  },
  (table) => [
    index("audit_log_project_at_idx").on(table.projectId, table.at),
    index("audit_log_at_idx").on(table.at),
  ]
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type GallerySession = typeof gallerySessions.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminCredential = typeof adminCredentials.$inferSelect;
