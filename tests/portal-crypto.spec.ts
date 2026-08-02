import { expect, test } from "playwright/test";
import {
  generateGalleryPassword,
  hashPassword,
  verifyPassword,
} from "../src/lib/portal/password";
import { pseudonymise, sign, unsign } from "../src/lib/portal/secrets";

/*
  Reine Rechenlogik, kein Browser und keine Datenbank nötig.

  Diese Funktionen sind der Punkt, an dem ein Fehler am teuersten wäre: Ein
  falsch verglichener Hash oder eine Signatur, die sich fälschen lässt, öffnet
  fremde Hochzeitsbilder. Deshalb werden hier ausdrücklich die Fehlerfälle
  geprüft, nicht nur der Normalfall.
*/

// Muss vor dem Import von secrets.ts stehen – das Modul liest die Variable.
process.env.PORTAL_SESSION_SECRET =
  "test-geheimnis-mit-ausreichender-laenge-fuer-die-pruefung";

test.describe("Galerie-Passwörter", () => {
  test("ein korrektes Passwort wird angenommen, ein falsches nicht", async () => {

    const hash = await hashPassword("k7mq-x3rt-9wbd");

    expect(await verifyPassword("k7mq-x3rt-9wbd", hash)).toBe(true);
    expect(await verifyPassword("k7mq-x3rt-9wbe", hash)).toBe(false);
    expect(await verifyPassword("", hash)).toBe(false);
  });

  test("derselbe Klartext ergibt nie denselben Hash", async () => {

    // Ohne eigenes Salt je Passwort könnte man aus einer erbeuteten Datenbank
    // ablesen, welche Galerien dasselbe Passwort haben.
    const a = await hashPassword("gleiches-passwort");
    const b = await hashPassword("gleiches-passwort");

    expect(a).not.toBe(b);
  });

  test("die scrypt-Parameter stehen im Hash", async () => {
    const hash = await hashPassword("egal");

    // Ohne mitgeführte Parameter ließe sich N später nicht erhöhen.
    expect(hash.startsWith("scrypt$65536$8$1$")).toBe(true);
    expect(hash.split("$")).toHaveLength(6);
  });

  test("ein beschädigter Hash führt nicht zum Absturz", async () => {

    for (const kaputt of [
      "",
      "kein-hash",
      "scrypt$abc$8$1$xx$yy",
      "bcrypt$65536$8$1$xx$yy",
      "scrypt$65536$8$1$xx",
    ]) {
      expect(await verifyPassword("egal", kaputt), kaputt).toBe(false);
    }
  });

  test("erzeugte Passwörter sind lesbar und ohne Verwechslungszeichen", async () => {

    const passwords = Array.from({ length: 50 }, () =>
      generateGalleryPassword()
    );

    for (const password of passwords) {
      expect(password).toMatch(/^[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);
      // 0/O, 1/l/I lassen sich am Telefon nicht unterscheiden.
      expect(password).not.toMatch(/[01lo]/);
    }

    // Zufall, nicht Vorlage.
    expect(new Set(passwords).size).toBe(passwords.length);
  });
});

test.describe("Signierte Sitzungen", () => {
  test("ein signierter Wert lässt sich zurücklesen", async () => {

    const signed = sign("abc-123", "gallery-session:p1");
    expect(unsign(signed, "gallery-session:p1")).toBe("abc-123");
  });

  test("eine veränderte Signatur wird abgewiesen", async () => {

    const signed = sign("abc-123", "admin-session");
    expect(unsign(signed.slice(0, -1) + "x", "admin-session")).toBeNull();
    expect(unsign("abc-999." + signed.split(".")[1], "admin-session")).toBeNull();
    expect(unsign("ohne-punkt", "admin-session")).toBeNull();
  });

  test("ein Cookie einer Galerie gilt nicht für eine andere", async () => {

    // Der wichtigste Test der Datei: Das Cookie ist an die Galerie gebunden.
    // Ohne diese Bindung käme jeder Kunde in jede fremde Galerie.
    const signed = sign("sitzung-1", "gallery-session:projekt-A");

    expect(unsign(signed, "gallery-session:projekt-A")).toBe("sitzung-1");
    expect(unsign(signed, "gallery-session:projekt-B")).toBeNull();
  });

  test("Admin- und Galerie-Signaturen sind nicht austauschbar", async () => {

    const gallery = sign("id", "gallery-session:p1");
    expect(unsign(gallery, "admin-session")).toBeNull();
  });
});

test.describe("Pseudonymisierung", () => {
  test("dieselbe Herkunft ergibt denselben Wert, eine andere nicht", async () => {

    expect(pseudonymise("203.0.113.7")).toBe(pseudonymise("203.0.113.7"));
    expect(pseudonymise("203.0.113.7")).not.toBe(pseudonymise("203.0.113.8"));
  });

  test("die IP ist im Ergebnis nicht mehr enthalten", async () => {

    const hash = pseudonymise("203.0.113.7");
    expect(hash).not.toContain("203");
    expect(hash).not.toContain("113");
    expect(hash).toHaveLength(32);
  });
});
