import "server-only";

import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { db, schema } from "@/lib/db";
import { pseudonymise, sign, unsign } from "./secrets";

export const ADMIN_COOKIE = "rart_admin";
export const GALLERY_COOKIE_PREFIX = "rart_gal_";

const ADMIN_TTL_HOURS = 12;
const GALLERY_TTL_HOURS = 8;

/**
 * Cookie-Einstellungen, die für jede Sitzung gelten.
 *
 * sameSite "lax" statt "strict": Kunden kommen über einen Link aus einer
 * E-Mail oder WhatsApp. Bei "strict" wäre das Cookie beim ersten Aufruf nicht
 * dabei und der Kunde müsste sich zweimal anmelden – ein Ärgernis, das keinen
 * Sicherheitsgewinn bringt, weil hier nichts ohne ausdrücklichen Klick
 * passiert.
 */
function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Herkunft des Aufrufs, bereits pseudonymisiert.
 *
 * x-forwarded-for kann gefälscht werden; hinter Vercel ist der erste Eintrag
 * aber der echte Client, weil Vercel die Kette selbst schreibt. Für unseren
 * Zweck – Fehlversuche zählen – reicht das aus.
 */
export async function requestFingerprint() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();

  return {
    ipHash: pseudonymise(forwarded ?? "unbekannt"),
    userAgentHash: pseudonymise(headerList.get("user-agent") ?? "unbekannt"),
  };
}

/* ------------------------------------------------------------------ */
/* Reginas Sitzung                                                     */
/* ------------------------------------------------------------------ */

export async function createAdminSession(userId: string) {
  const expiresAt = new Date(Date.now() + ADMIN_TTL_HOURS * 3600_000);

  const [session] = await db()
    .insert(schema.adminSessions)
    .values({ userId, expiresAt })
    .returning({ id: schema.adminSessions.id });

  const store = await cookies();
  store.set(
    ADMIN_COOKIE,
    sign(session.id, "admin-session"),
    cookieOptions(ADMIN_TTL_HOURS * 3600)
  );

  return session.id;
}

/**
 * Liefert die angemeldete Person oder null.
 *
 * Die Sitzung wird bei JEDEM Aufruf gegen die Datenbank geprüft, nicht nur die
 * Cookie-Signatur. Nur so lässt sich ein Zugang sofort widerrufen – ein rein
 * signiertes Cookie bliebe bis zum Ablauf gültig, auch wenn das Gerät
 * abhandengekommen ist.
 */
export async function getAdminUser() {
  const store = await cookies();
  const raw = store.get(ADMIN_COOKIE)?.value;
  if (!raw) return null;

  const sessionId = unsign(raw, "admin-session");
  if (!sessionId) return null;

  const rows = await db()
    .select({
      userId: schema.adminUsers.id,
      email: schema.adminUsers.email,
      displayName: schema.adminUsers.displayName,
    })
    .from(schema.adminSessions)
    .innerJoin(
      schema.adminUsers,
      eq(schema.adminUsers.id, schema.adminSessions.userId)
    )
    .where(
      and(
        eq(schema.adminSessions.id, sessionId),
        isNull(schema.adminSessions.revokedAt),
        gt(schema.adminSessions.expiresAt, new Date())
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function destroyAdminSession() {
  const store = await cookies();
  const raw = store.get(ADMIN_COOKIE)?.value;

  if (raw) {
    const sessionId = unsign(raw, "admin-session");
    if (sessionId) {
      await db()
        .update(schema.adminSessions)
        .set({ revokedAt: new Date() })
        .where(eq(schema.adminSessions.id, sessionId));
    }
  }

  store.delete(ADMIN_COOKIE);
}

/* ------------------------------------------------------------------ */
/* Kundensitzung                                                       */
/* ------------------------------------------------------------------ */

/**
 * Pro Galerie ein eigenes Cookie.
 *
 * Wer zwei Galerien besitzt – etwa das Brautpaar und dessen Eltern am selben
 * Rechner – bleibt in beiden angemeldet, ohne dass eine die andere verdrängt.
 * Und ein erbeutetes Cookie taugt nur für genau eine Galerie.
 */
function galleryCookieName(projectId: string) {
  return `${GALLERY_COOKIE_PREFIX}${projectId.replace(/-/g, "").slice(0, 12)}`;
}

export async function createGallerySession(projectId: string) {
  const { ipHash, userAgentHash } = await requestFingerprint();
  const expiresAt = new Date(Date.now() + GALLERY_TTL_HOURS * 3600_000);

  const [session] = await db()
    .insert(schema.gallerySessions)
    .values({ projectId, ipHash, userAgentHash, expiresAt })
    .returning({ id: schema.gallerySessions.id });

  const store = await cookies();
  store.set(
    galleryCookieName(projectId),
    sign(session.id, `gallery-session:${projectId}`),
    cookieOptions(GALLERY_TTL_HOURS * 3600)
  );

  return session.id;
}

/**
 * Prüft, ob der Aufrufer für diese Galerie freigeschaltet ist.
 *
 * Wird bei jedem Bildabruf gebraucht. Deshalb eine einzige Abfrage, die
 * gleichzeitig lastSeenAt fortschreibt – so lässt sich später erkennen, ob
 * eine Galerie überhaupt noch benutzt wird, ohne eine zweite Runde zur
 * Datenbank.
 */
export async function getGallerySession(projectId: string) {
  const store = await cookies();
  const raw = store.get(galleryCookieName(projectId))?.value;
  if (!raw) return null;

  const sessionId = unsign(raw, `gallery-session:${projectId}`);
  if (!sessionId) return null;

  const rows = await db()
    .update(schema.gallerySessions)
    .set({ lastSeenAt: new Date() })
    .where(
      and(
        eq(schema.gallerySessions.id, sessionId),
        eq(schema.gallerySessions.projectId, projectId),
        isNull(schema.gallerySessions.revokedAt),
        gt(schema.gallerySessions.expiresAt, new Date())
      )
    )
    .returning({ id: schema.gallerySessions.id });

  return rows[0] ?? null;
}

/* ------------------------------------------------------------------ */
/* Sperre nach Fehlversuchen                                           */
/* ------------------------------------------------------------------ */

const WINDOW_MINUTES = 15;
const MAX_FAILURES_PER_GALLERY = 8;
const MAX_FAILURES_PER_IP = 20;

/**
 * Zwei Grenzen statt einer.
 *
 * Die Galerie-Grenze schützt das einzelne Passwort vor Durchprobieren. Die
 * IP-Grenze schützt davor, dass jemand viele Galerien gleichzeitig mit je
 * wenigen Versuchen abklopft und so unter der ersten Grenze bleibt.
 */
export async function isRateLimited(projectId: string, ipHash: string) {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000);

  const [row] = await db()
    .select({
      perGallery: sql<number>`count(*) filter (where ${schema.loginAttempts.projectId} = ${projectId})`,
      perIp: sql<number>`count(*) filter (where ${schema.loginAttempts.ipHash} = ${ipHash})`,
    })
    .from(schema.loginAttempts)
    .where(
      and(
        eq(schema.loginAttempts.succeeded, false),
        gt(schema.loginAttempts.at, since)
      )
    );

  return (
    Number(row?.perGallery ?? 0) >= MAX_FAILURES_PER_GALLERY ||
    Number(row?.perIp ?? 0) >= MAX_FAILURES_PER_IP
  );
}

export async function recordLoginAttempt(
  projectId: string | null,
  ipHash: string,
  succeeded: boolean
) {
  await db()
    .insert(schema.loginAttempts)
    .values({ projectId, ipHash, succeeded });
}
