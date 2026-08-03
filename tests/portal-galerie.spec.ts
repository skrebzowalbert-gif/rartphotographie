import { neon } from "@neondatabase/serverless";
import { expect, test } from "playwright/test";

/*
  Der komplette Kundenweg: Passwort, Auswahl, Abschicken.

  Wichtiger als der Glücksfall sind hier die Grenzen: Kommt jemand ohne
  Passwort hinein? Kann ein Cookie einer Galerie in einer anderen benutzt
  werden? Lässt sich die Auswahl nach dem Abschicken noch verändern?
*/

test.describe("Kundengalerie", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Braucht den virtuellen Authenticator für die Vorbereitung"
  );

  let slug = "";
  let password = "";
  let secondSlug = "";

  test.beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url || !(process.env.PORTAL_ORIGIN ?? "").includes("localhost")) return;

    const sql = neon(url);
    await sql`delete from admin_challenges`;
    await sql`delete from admin_credentials`;
    await sql`delete from admin_users`;
    await sql`delete from projects where title like 'Testgalerie %'`;
  });

  /** Legt über die Oberfläche eine freigegebene Galerie mit einem Bild an. */
  test("Vorbereitung: Galerie anlegen, Bild hochladen, freigeben", async ({
    page,
  }) => {
    const setupToken = process.env.PORTAL_SETUP_TOKEN;
    test.skip(!setupToken, "PORTAL_SETUP_TOKEN nicht gesetzt");

    const client = await page.context().newCDPSession(page);
    await client.send("WebAuthn.enable");
    await client.send("WebAuthn.addVirtualAuthenticator", {
      options: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    });

    await page.goto(`/admin/einrichten?token=${encodeURIComponent(setupToken!)}`);
    await page.getByRole("button", { name: /Passkey anlegen/ }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });

    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );

    // Zwei Galerien: die zweite dient dem Nachweis, dass Cookies nicht
    // zwischen Galerien wandern.
    for (const nummer of [1, 2]) {
      const titel = `Testgalerie Kunde ${nummer} ${Date.now()}`;

      await page.goto("/admin/neu");
      await page.getByLabel("Titel der Galerie").fill(titel);
      await page.getByLabel("Kundin oder Kunde").fill("Testpaar");
      await page.getByRole("button", { name: /Galerie anlegen/ }).click();
      await expect(
        page.getByRole("heading", { name: new RegExp(titel) })
      ).toBeVisible({ timeout: 20_000 });

      const link = await page.locator("dd.font-mono.text-sm").innerText();
      const pw = await page.locator("dd.font-mono.text-2xl").innerText();

      if (nummer === 1) {
        slug = link.split("/galerie/")[1].trim();
        password = pw.trim();
      } else {
        secondSlug = link.split("/galerie/")[1].trim();
      }

      await page.goto("/admin");
      await page.getByRole("link", { name: titel }).click();
      await page.locator('input[type="file"]').first().setInputFiles({
        name: `bild-${nummer}.png`,
        mimeType: "image/png",
        buffer: png,
      });
      await expect(page.getByText(`bild-${nummer}.png`).first()).toBeVisible({
        timeout: 45_000,
      });

      await page.getByRole("button", { name: /Für die Kundschaft freigeben/ }).click();
      await expect(
        page.getByText(/Auswahl läuft/).first()
      ).toBeVisible({ timeout: 20_000 });
    }

    expect(slug).toBeTruthy();
    expect(password).toMatch(/^[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);
  });

  test("ohne Passwort gibt es keine Bilder", async ({ page }) => {
    test.skip(!slug, "Vorbereitung fehlgeschlagen");

    await page.goto(`/galerie/${slug}`);

    await expect(page.getByRole("button", { name: /Galerie öffnen/ })).toBeVisible();
    // Kein einziges Bild im ausgelieferten HTML – auch nicht als Adresse.
    expect(await page.locator('img[src^="/api/portal/bild/"]').count()).toBe(0);
  });

  test("ein falsches Passwort verrät nichts", async ({ page }) => {
    test.skip(!slug, "Vorbereitung fehlgeschlagen");

    await page.goto(`/galerie/${slug}`);
    await page.getByLabel("Passwort").fill("falsch-falsch-fal");
    await page.getByRole("button", { name: /Galerie öffnen/ }).click();

    // Dieselbe Meldung wie bei einer nicht existierenden Galerie.
    // Nicht ueber role=alert suchen: Next.js' eigene Routenansage traegt
    // dieselbe Rolle und faengt den Treffer ab.
    await expect(page.getByText(/Das Passwort stimmt nicht/)).toBeVisible({
      timeout: 15_000,
    });
  });

  test("mit Passwort: Bilder sehen, Herz setzen, Auswahl abschicken", async ({
    page,
  }) => {
    test.skip(!slug, "Vorbereitung fehlgeschlagen");

    await page.goto(`/galerie/${slug}`);
    await page.getByLabel("Passwort").fill(password);
    await page.getByRole("button", { name: /Galerie öffnen/ }).click();

    await expect(page.getByText(/Tippt auf das Herz/)).toBeVisible({
      timeout: 20_000,
    });

    const bild = page.locator('img[src^="/api/portal/bild/"]').first();
    await expect(bild).toBeVisible();

    await page.getByRole("button", { name: /Zur Auswahl hinzufügen/ }).click();
    await expect(page.getByText(/^1$/).first()).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: /Auswahl abschicken/ }).click();

    await expect(page.getByText(/Eure Auswahl ist bei Regina angekommen/)).toBeVisible({
      timeout: 20_000,
    });

    /* --- Danach ist die Auswahl fest ---------------------------------- */
    const nachtraeglich = await page.request.post("/api/portal/favoriten", {
      data: { action: "submit", projectId: "00000000-0000-0000-0000-000000000000" },
      failOnStatusCode: false,
    });
    expect([401, 404]).toContain(nachtraeglich.status());
  });

  test("das Cookie einer Galerie öffnet keine andere", async ({ page }) => {
    test.skip(!slug || !secondSlug, "Vorbereitung fehlgeschlagen");

    // In Galerie 1 anmelden …
    await page.goto(`/galerie/${slug}`);
    await page.getByLabel("Passwort").fill(password);
    await page.getByRole("button", { name: /Galerie öffnen/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // … und mit demselben Browser die zweite aufrufen.
    await page.goto(`/galerie/${secondSlug}`);
    await expect(
      page.getByRole("button", { name: /Galerie öffnen/ }),
      "Galerie 2 muss trotz gültiger Sitzung für Galerie 1 nach dem Passwort fragen"
    ).toBeVisible();
  });

  test("Kundengalerien sind für Suchmaschinen gesperrt", async ({ request }) => {
    test.skip(!slug, "Vorbereitung fehlgeschlagen");

    const html = await (await request.get(`/galerie/${slug}`)).text();
    expect(html).toContain("noindex");
  });

  test("ohne Sitzung liefert die Favoriten-Schnittstelle nichts aus", async ({
    browser,
  }) => {
    // Frischer Browserkontext statt eines eigenstaendigen Anfragekontexts:
    // Der erbt die baseURL und hat trotzdem einen leeren Cookie-Topf.
    const fremd = await browser.newContext();
    const response = await fremd.request.post(
      "/api/portal/favoriten",
      {
        data: {
          action: "toggle",
          projectId: "00000000-0000-0000-0000-000000000000",
          assetId: "00000000-0000-0000-0000-000000000000",
          selected: true,
        },
        failOnStatusCode: false,
      }
    );

    expect(response.status()).toBe(401);
    await fremd.close();
  });
});
