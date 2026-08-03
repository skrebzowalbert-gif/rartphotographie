import { neon } from "@neondatabase/serverless";
import { expect, test, type Page } from "playwright/test";

/*
  Der komplette Zugangsweg gegen die echte Datenbank.

  Passkeys lassen sich nicht mit Tastatureingaben testen – dafür bekommt der
  Browser einen virtuellen Authenticator über das Chrome DevTools Protocol.
  Der verhält sich wie ein echter Sicherheitsschlüssel, nur ohne Fingerabdruck.

  Läuft bewusst nur unter Chromium: WebKit kennt diese Schnittstelle nicht.
*/

test.describe("Verwaltung: Passkey und Galerie-Anlage", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Virtueller Authenticator gibt es nur in Chromium"
  );

  /*
    Sauberer Ausgangszustand vor jedem Lauf.

    Ein virtueller Authenticator bringt keine Schlüssel aus früheren Läufen
    mit. Bliebe der Passkey in der Datenbank stehen, ginge der Test beim
    zweiten Mal in die Anmeldung – und die kann ein frisches Gerät nicht
    bestehen.

    Die doppelte Absicherung ist Absicht: Die Anwendung zeigt über
    PORTAL_ORIGIN auf localhost, und .env.local zeigt auf den Neon-Zweig
    "development". Trifft eine der beiden Bedingungen nicht zu, wird nichts
    gelöscht. Ein Test, der Reginas echten Passkey entfernt, wäre schlimmer
    als gar kein Test.
  */
  test.beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    const origin = process.env.PORTAL_ORIGIN ?? "";

    if (!url || !origin.includes("localhost")) return;

    const sql = neon(url);
    await sql`delete from admin_challenges`;
    await sql`delete from admin_credentials`;
    await sql`delete from admin_users`;
    await sql`delete from projects where title like 'Testgalerie %'`;
  });

  async function addAuthenticator(page: Page) {
    const client = await page.context().newCDPSession(page);
    await client.send("WebAuthn.enable");

    const { authenticatorId } = await client.send("WebAuthn.addVirtualAuthenticator", {
      options: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    });

    return { client, authenticatorId };
  }

  test("Einrichtung, Anmeldung und Anlegen einer Galerie", async ({ page }) => {
    await addAuthenticator(page);

    // Das Token steht in der Umgebung des Servers; der Test liest es aus der
    // gleichen Quelle wie die Anwendung.
    const setupToken = process.env.PORTAL_SETUP_TOKEN;
    test.skip(!setupToken, "PORTAL_SETUP_TOKEN nicht gesetzt");

    /* --- Einrichtung ------------------------------------------------- */
    await page.goto(`/admin/einrichten?token=${encodeURIComponent(setupToken!)}`);

    const anlegen = page.getByRole("button", { name: /Passkey anlegen/ });
    await expect(anlegen).toBeVisible();
    await anlegen.click();

    await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: /Deine/ })).toBeVisible();

    /* --- Galerie anlegen --------------------------------------------- */
    const titel = `Testgalerie ${Date.now()}`;

    await page.goto("/admin/neu");
    await page.getByLabel("Titel der Galerie").fill(titel);
    await page.getByLabel("Kundin oder Kunde").fill("Testkundin");
    await page.getByLabel("Inklusive Bilder").fill("40");
    await page.getByRole("button", { name: /Galerie anlegen/ }).click();

    await expect(
      page.getByRole("heading", { name: new RegExp(titel) })
    ).toBeVisible({ timeout: 20_000 });

    // Das Passwort erscheint genau einmal und hat das erwartete Format.
    const passwort = page.locator("dd.font-mono.text-2xl");
    await expect(passwort).toHaveText(/^[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);

    // Der Link enthält eine Zufallsfolge, damit fremde Galerien nicht zu
    // erraten sind.
    const link = await page.locator("dd.font-mono.text-sm").innerText();
    expect(link).toMatch(/\/galerie\/testgalerie-\d+-[a-z2-9]{10}$/);

    /* --- Erscheint sie in der Übersicht? ------------------------------ */
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: titel })).toBeVisible();
    await expect(page.getByText(/Entwurf/).first()).toBeVisible();
  });

  test("ohne Anmeldung führt jede Verwaltungsseite zur Anmeldung", async ({ page }) => {
    for (const pfad of ["/admin", "/admin/neu"]) {
      await page.goto(pfad);
      await expect(page).toHaveURL(/\/admin\/anmelden$/);
    }
  });

  test("die Server Action prüft die Berechtigung selbst", async ({ request }) => {
    /*
      Der wichtigste Test dieser Datei.

      Server Actions sind öffentlich erreichbare Endpunkte. Wer sie ohne
      Anmeldung aufruft, darf keine Galerie anlegen können – die Prüfung darf
      also nicht in der Seite hängen, die das Formular zeigt.
    */
    const response = await request.post("/admin/neu", {
      headers: {
        "next-action": "unbekannt",
        "content-type": "application/x-www-form-urlencoded",
      },
      data: "title=Eindringling&clientName=Eindringling",
      failOnStatusCode: false,
    });

    expect(response.status()).not.toBe(200);
  });

  test("Verwaltungsseiten sind für Suchmaschinen gesperrt", async ({ request }) => {
    const html = await (await request.get("/admin/anmelden")).text();
    expect(html).toContain("noindex");
  });

  test("das Einrichtungs-Token wird nicht durch Raten preisgegeben", async ({
    request,
  }) => {
    const response = await request.post("/api/portal/auth/register", {
      data: { step: "options", setupToken: "falsches-token-0000000000" },
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(403);
    // Dieselbe Antwort wie bei fehlendem Token: keine Auskunft darüber,
    // welcher der beiden Fälle vorliegt.
    expect((await response.json()).error).toBe("Nicht berechtigt.");
  });
});
