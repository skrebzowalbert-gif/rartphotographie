import { neon } from "@neondatabase/serverless";
import { expect, request as playwrightRequest, test, type Page } from "playwright/test";

/*
  Der komplette Zugangsweg gegen die echte Datenbank.

  Passkeys lassen sich nicht mit Tastatureingaben testen – dafür bekommt der
  Browser einen virtuellen Authenticator über das Chrome DevTools Protocol.
  Der verhält sich wie ein echter Sicherheitsschlüssel, nur ohne Fingerabdruck.

  Läuft bewusst nur unter Chromium: WebKit kennt diese Schnittstelle nicht.
*/

/**
 * Sauberer Ausgangszustand vor jedem Abschnitt.
 *
 * Ein virtueller Authenticator bringt keine Schlüssel aus früheren Läufen mit.
 * Bliebe ein Passkey in der Datenbank stehen, sähe der nächste Abschnitt
 * "Bereits eingerichtet" – und anmelden kann sich ein frisches Gerät nicht.
 *
 * Die doppelte Absicherung ist Absicht: Die Anwendung muss über PORTAL_ORIGIN
 * auf localhost zeigen, und .env.local auf den Neon-Zweig "development".
 * Trifft eine der Bedingungen nicht zu, wird nichts gelöscht. Ein Test, der
 * Reginas echten Passkey entfernt, wäre schlimmer als gar kein Test.
 */
async function resetAdmin() {
  const url = process.env.DATABASE_URL;
  const origin = process.env.PORTAL_ORIGIN ?? "";

  if (!url || !origin.includes("localhost")) return;

  const sql = neon(url);
  await sql`delete from admin_challenges`;
  await sql`delete from admin_credentials`;
  await sql`delete from admin_users`;
  await sql`delete from projects where title like 'Testgalerie %'`;
}

/**
 * Ein virtueller Sicherheitsschlüssel für diese Seite.
 *
 * Steht auf Modulebene, weil ihn inzwischen mehrere Abschnitte brauchen –
 * unter anderem der Test der Geräteeinladung, der gleich drei verschiedene
 * "Geräte" gegeneinander antreten lässt.
 */
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
  test.beforeAll(resetAdmin);

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

test.describe("Bilder hochladen", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Braucht den virtuellen Authenticator"
  );

  test.beforeAll(resetAdmin);

  test("ein Bild wandert durch die ganze Kette bis nach Cloudflare", async ({
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

    const titel = `Testgalerie Upload ${Date.now()}`;
    await page.goto("/admin/neu");
    await page.getByLabel("Titel der Galerie").fill(titel);
    await page.getByLabel("Kundin oder Kunde").fill("Testkundin");
    await page.getByRole("button", { name: /Galerie anlegen/ }).click();
    await expect(page.getByRole("heading", { name: new RegExp(titel) })).toBeVisible({
      timeout: 20_000,
    });

    await page.goto("/admin");
    await page.getByRole("link", { name: titel }).click();
    await expect(page.getByRole("heading", { name: titel })).toBeVisible();

    /*
      Ein winziges, gültiges PNG. Es geht nicht um den Inhalt, sondern darum,
      dass der Weg trägt: Erlaubnis holen, Teil signieren, direkt zu Cloudflare
      hochladen, ETag zurücklesen, abschliessen, in die Datenbank schreiben.

      Der Upload läuft aus dem Browser heraus – damit prüft dieser Test auch
      die CORS-Regel am Bucket. Fehlt dort ExposeHeaders: ["ETag"], schlägt er
      fehl, und zwar genau an der Stelle, an der es in der Praxis knallt.
    */
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );

    await page.locator('input[type="file"]').first().setInputFiles({
      name: "testbild.png",
      mimeType: "image/png",
      buffer: png,
    });

    // Nach dem Abschluss lädt die Seite neu und zeigt die Datei.
    await expect(page.getByText("testbild.png").first()).toBeVisible({
      timeout: 45_000,
    });
    await expect(
      page.getByRole("heading", { name: /Auswahlbilder \(1\)/ })
    ).toBeVisible();

    /* --- Wird das Vorschaubild ausgeliefert? -------------------------- */
    const src = await page.locator('img[src^="/api/portal/bild/"]').first().getAttribute("src");
    expect(src).toBeTruthy();

    const mitSitzung = await page.request.get(src!);
    expect(mitSitzung.status()).toBe(200);
    expect(mitSitzung.headers()["content-type"]).toBe("image/jpeg");
    // Kein gemeinsamer Zwischenspeicher – sonst koennte er ein Bild an jemanden
    // ausliefern, dessen Sitzung laengst abgelaufen ist.
    expect(mitSitzung.headers()["cache-control"]).toContain("private");

    /* --- Und ohne Sitzung? ------------------------------------------- */
    const fremd = await playwrightRequest.newContext();
    const ohneSitzung = await fremd.get(`http://127.0.0.1:3100${src}`, {
      failOnStatusCode: false,
    });
    expect(
      ohneSitzung.status(),
      "Ein fremder Browser darf das Bild nicht bekommen"
    ).toBe(404);
    await fremd.dispose();
  });
});

test.describe("Ein zweites Gerät freischalten", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Virtueller Authenticator gibt es nur in Chromium"
  );

  test.beforeAll(resetAdmin);

  /*
    Der Weg, über den Regina auf ihr eigenes Handy kommt.

    Der eigentliche Prüfpunkt ist nicht, dass es funktioniert – sondern dass
    der Link danach wertlos ist. Ein Einladungslink, der zweimal gilt, liegt
    irgendwann in einem Chatverlauf und ist dann ein dauerhafter Zugang zu
    fremden Hochzeitsbildern.
  */
  test("der Einladungslink schaltet genau ein Gerät frei – und dann nie wieder", async ({
    browser,
    page,
  }) => {
    const setupToken = process.env.PORTAL_SETUP_TOKEN;
    test.skip(!setupToken, "PORTAL_SETUP_TOKEN nicht gesetzt");

    /* --- Gerät 1: einrichten ------------------------------------------ */
    await addAuthenticator(page);
    await page.goto(`/admin/einrichten?token=${encodeURIComponent(setupToken!)}`);
    await page.getByRole("button", { name: /Passkey anlegen/ }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });

    /* --- Gerät 1 erzeugt eine Einladung ------------------------------- */
    await page.getByRole("button", { name: /Weiteres Gerät freischalten/ }).click();
    await page.getByLabel(/Um welches Gerät geht es/).fill("Reginas Handy");
    await page.getByRole("button", { name: /Link erzeugen/ }).click();

    const linkFeld = page.locator("p.font-mono").first();
    await expect(linkFeld).toBeVisible({ timeout: 20_000 });
    const link = (await linkFeld.innerText()).trim();
    expect(link).toMatch(/\/admin\/geraet\?token=[0-9a-f]{48}$/);

    const pfad = link.slice(link.indexOf("/admin/geraet"));

    /* --- Gerät 2: fremder Browser, eigener Authenticator -------------- */
    const handy = await browser.newContext();
    const handySeite = await handy.newPage();
    await addAuthenticator(handySeite);

    await handySeite.goto(pfad);
    await handySeite.getByRole("button", { name: /Jetzt freischalten/ }).click();
    await expect(handySeite).toHaveURL(/\/admin$/, { timeout: 20_000 });

    // Und ist danach wirklich drin, nicht nur weitergeleitet.
    await expect(
      handySeite.getByRole("heading", { name: /Galerien/ })
    ).toBeVisible({ timeout: 20_000 });
    await handy.close();

    /* --- Derselbe Link ein zweites Mal -------------------------------- */
    const dritter = await browser.newContext();
    const dritteSeite = await dritter.newPage();
    await addAuthenticator(dritteSeite);

    await dritteSeite.goto(pfad);
    await expect(
      dritteSeite.getByText(/Dieser Link gilt nicht mehr/),
      "Ein verbrauchter Einladungslink darf kein zweites Gerät freischalten"
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      dritteSeite.getByRole("button", { name: /Jetzt freischalten/ })
    ).toHaveCount(0);
    await dritter.close();
  });

  test("ein erfundenes Token schaltet nichts frei", async ({ page }) => {
    await page.goto(`/admin/geraet?token=${"a".repeat(48)}`);
    await expect(page.getByText(/Dieser Link gilt nicht mehr/)).toBeVisible();
  });
});
