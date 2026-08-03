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

  test("ein neues Passwort ersetzt das alte", async ({ page, browser }) => {
    test.skip(!slug, "Vorbereitung fehlgeschlagen");

    /*
      Dieser Test braucht eine eigene Admin-Anmeldung: Jeder Test bekommt einen
      frischen Browser, und der Passkey aus der Vorbereitung steckt in einem
      anderen Kontext. Also Zugänge leeren und hier neu einrichten.
    */
    const sql = neon(process.env.DATABASE_URL!);
    await sql`delete from admin_credentials`;
    await sql`delete from admin_users`;

    const cdp = await page.context().newCDPSession(page);
    await cdp.send("WebAuthn.enable");
    await cdp.send("WebAuthn.addVirtualAuthenticator", {
      options: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    });

    await page.goto(
      `/admin/einrichten?token=${encodeURIComponent(process.env.PORTAL_SETUP_TOKEN!)}`
    );
    await page.getByRole("button", { name: /Passkey anlegen/ }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });

    await page.goto("/admin");
    await page.getByRole("link", { name: /Testgalerie Kunde 1/ }).click();
    await page.getByRole("button", { name: /Neues Passwort erzeugen/ }).click();

    const neu = (
      await page.locator("p.font-mono.text-2xl").innerText()
    ).trim();
    expect(neu).toMatch(/^[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);
    expect(neu).not.toBe(password);

    // … das alte darf nicht mehr funktionieren.
    const kunde = await browser.newContext();
    const kundenSeite = await kunde.newPage();
    await kundenSeite.goto(`/galerie/${slug}`);
    await kundenSeite.getByLabel("Passwort").fill(password);
    await kundenSeite.getByRole("button", { name: /Galerie öffnen/ }).click();
    await expect(
      kundenSeite.getByText(/Das Passwort stimmt nicht/),
      "Das alte Passwort muss abgewiesen werden"
    ).toBeVisible({ timeout: 15_000 });

    // … das neue schon.
    await kundenSeite.getByLabel("Passwort").fill(neu);
    await kundenSeite.getByRole("button", { name: /Galerie öffnen/ }).click();
    await expect(kundenSeite.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 20_000,
    });
    await kunde.close();

    password = neu;
  });

  test("ein fehlendes Original meldet sich, statt still zu verschwinden", async ({
    page,
  }) => {
    test.skip(!slug, "Vorbereitung fehlgeschlagen");

    /*
      Doppelt abgesichert, bevor hier irgendetwas gelöscht wird.

      Dieser Test entfernt Objekte aus R2. Genau so ein Skript hat einmal den
      Produktions-Bucket geleert und alle hochgeladenen Hochzeitsbilder
      mitgenommen, während die Datenbankeinträge stehen blieben. Seitdem gilt:
      Es wird nur im Entwicklungs-Bucket gelöscht, und der Name muss das
      belegen. Der Zugangsschlüssel in .env.local kommt zusätzlich gar nicht an
      den Produktions-Bucket heran.
    */
    const bucket = process.env.R2_BUCKET ?? "";
    test.skip(
      !bucket.endsWith("-dev"),
      `R2_BUCKET ist "${bucket}" – gelöscht wird ausschließlich im -dev-Bucket`
    );

    await page.goto(`/galerie/${slug}`);
    await page.getByLabel("Passwort").fill(password);
    await page.getByRole("button", { name: /Galerie öffnen/ }).click();

    const bild = page.locator('img[src^="/api/portal/bild/"]').first();
    await expect(bild).toBeVisible({ timeout: 20_000 });

    const quelle = (await bild.getAttribute("src"))!;
    const assetId = quelle.split("/api/portal/bild/")[1].split("?")[0];

    // Solange die Datei da ist, kommt ein Bild.
    const vorher = await page.request.get(`/api/portal/bild/${assetId}?w=400`);
    expect(vorher.status()).toBe(200);

    const sql = neon(process.env.DATABASE_URL!);
    const [{ project_id: projectId }] = (await sql`
      select project_id from assets where id = ${assetId}
    `) as { project_id: string }[];

    const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = await import(
      "@aws-sdk/client-s3"
    );
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    // Nur die Objekte genau dieser Testgalerie – kein Rundumschlag.
    const liste = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${projectId}/` })
    );
    for (const objekt of liste.Contents ?? []) {
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: objekt.Key }));
    }
    expect(liste.KeyCount ?? 0).toBeGreaterThan(0);

    /*
      Jetzt muss die Route 502 antworten, nicht 404.

      Der Unterschied ist nicht kosmetisch: 404 heißt "gibt es nicht" und ist
      im Kundenfall die richtige, verschwiegene Antwort auf eine fremde
      Galerie. Hier stimmt die Berechtigung aber – kaputt ist der Speicher
      dahinter. Als das noch beides 404 war, sah ein leerer Bucket exakt aus
      wie eine Galerie ohne Bilder, und in den Protokollen stand nichts.
    */
    const nachher = await page.request.get(
      `/api/portal/bild/${assetId}?w=400&cb=1`,
      { failOnStatusCode: false }
    );
    expect(nachher.status()).toBe(502);
  });

  test("auch als angemeldete Regina zeigt die Galerie Wasserzeichen", async ({
    page,
  }) => {
    test.skip(!slug, "Vorbereitung fehlgeschlagen");
    test.setTimeout(180_000);

    /*
      Der Fall, der Regina und Albert glauben liess, es gaebe keine
      Wasserzeichen.

      Die Bildroute entschied allein danach, WER fragt: Wer als Regina
      angemeldet war, bekam die Fassung ohne Wasserzeichen – auch in der
      Kundengalerie. Beide oeffneten die Galerie im selben Browser, in dem sie
      in der Verwaltung angemeldet waren, sahen blanke Bilder und mussten
      annehmen, die Kundschaft saehe dasselbe.

      Geprueft wird deshalb genau diese Kombination: gueltige Anmeldung als
      Regina UND Aufruf ueber die Kundengalerie. Die Seite muss die
      Kundenfassung anfordern, nicht die Person die Darstellung bestimmen.
    */
    const setupToken = process.env.PORTAL_SETUP_TOKEN;
    test.skip(!setupToken, "PORTAL_SETUP_TOKEN nicht gesetzt");

    const sql = neon(process.env.DATABASE_URL!);
    await sql`delete from admin_credentials`;
    await sql`delete from admin_users`;

    const cdp = await page.context().newCDPSession(page);
    await cdp.send("WebAuthn.enable");
    await cdp.send("WebAuthn.addVirtualAuthenticator", {
      options: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    });

    await page.goto(
      `/admin/einrichten?token=${encodeURIComponent(setupToken!)}`
    );
    await page.getByRole("button", { name: /Passkey anlegen/ }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });

    // Eine eigene Galerie mit einem echten Foto – auf einem Testpixel gibt es
    // nichts zu beschriften.
    const titel = `Testgalerie Sicht ${Date.now()}`;
    await page.goto("/admin/neu");
    await page.getByLabel("Titel der Galerie").fill(titel);
    await page.getByLabel("Kundin oder Kunde").fill("Testpaar");
    await page.getByRole("button", { name: /Galerie anlegen/ }).click();
    await expect(
      page.getByRole("heading", { name: new RegExp(titel) })
    ).toBeVisible({ timeout: 20_000 });

    const link = await page.locator("dd.font-mono.text-sm").innerText();
    const eigenerSlug = link.split("/galerie/")[1].trim();
    const eigenesPasswort = (
      await page.locator("dd.font-mono.text-2xl").innerText()
    ).trim();

    await page.goto("/admin");
    await page.getByRole("link", { name: titel }).click();
    await page
      .locator('input[type="file"]')
      .first()
      .setInputFiles("public/images/portrait/portrait-4.jpg");
    await expect(page.getByText("portrait-4.jpg").first()).toBeVisible({
      timeout: 90_000,
    });
    await page
      .getByRole("button", { name: /Für die Kundschaft freigeben/ })
      .click();
    await expect(page.getByText(/Auswahl läuft/).first()).toBeVisible({
      timeout: 20_000,
    });

    // Dieselbe Seite, dieselbe Anmeldung – jetzt als Kundin.
    await page.goto(`/galerie/${eigenerSlug}`);
    await page.getByLabel("Passwort").fill(eigenesPasswort);
    await page.getByRole("button", { name: /Galerie öffnen/ }).click();

    /*
      Ausdruecklich ein Bild aus dem Mosaik, nicht das Auftaktbild.

      Erster Anlauf nahm schlicht das erste Bild der Seite – das ist der
      Auftakt mit 1600 Pixeln Breite. Verglichen wurde es mit einer
      800-Pixel-Fassung, und zwei verschiedene Groessen unterscheiden sich
      immer. Der Test war gruen, egal was der Code tat.
    */
    const bild = page
      .locator('img[src*="/api/portal/bild/"][src*="w=800"]')
      .first();
    await expect(bild).toBeVisible({ timeout: 20_000 });

    const quelle = (await bild.getAttribute("src"))!;
    const assetId = quelle.split("/api/portal/bild/")[1].split("?")[0];

    // Der eigentliche Punkt: Die Seite muss die Kundenfassung anfordern.
    expect(
      quelle,
      "Die Galerie fragt nicht nach der Kundenfassung – dann entscheidet wieder die Anmeldung"
    ).toContain("ansicht=kunde");

    const ausGalerie = await page.request.get(quelle);
    const ohne = await page.request.get(`/api/portal/bild/${assetId}?w=800`);
    expect(ausGalerie.status()).toBe(200);
    expect(ohne.status()).toBe(200);

    const sharp = (await import("sharp")).default;
    const a = await sharp(await ohne.body()).raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(await ausGalerie.body())
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Gleiche Masse, sonst vergleicht die Schleife unten Aepfel mit Birnen.
    expect(a.info.width).toBe(b.info.width);
    expect(a.info.height).toBe(b.info.height);

    let summe = 0;
    for (let i = 0; i < a.data.length; i++) summe += Math.abs(a.data[i] - b.data[i]);

    expect(
      summe / a.data.length,
      "Die Galerie liefert dieselben Bilder wie die Verwaltung – das Wasserzeichen fehlt"
    ).toBeGreaterThan(1);
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

test.describe("Aufräumauftrag", () => {
  /*
    Diese Route loescht Kundendaten. Waere sie ungeschuetzt erreichbar, koennte
    jeder mit der Adresse eine Galerie leeren - und es saehe aus wie ein
    planmaessiger Ablauf. Deshalb wird hier ausdruecklich geprueft, dass sie
    ohne das Geheimnis NICHTS tut und sich auch nicht als vorhanden zu
    erkennen gibt.
  */
  test("ohne Geheimnis antwortet der Aufräumauftrag wie eine tote Adresse", async ({
    browser,
  }) => {
    const fremd = await browser.newContext();

    for (const kopf of [
      undefined,
      { authorization: "Bearer falsch" },
      { authorization: "Bearer " },
      { authorization: "irgendwas" },
    ]) {
      const antwort = await fremd.request.get("/api/cron/aufraeumen", {
        headers: kopf,
        failOnStatusCode: false,
      });

      // 404, nicht 401: Wer probiert, soll nicht einmal erfahren, dass es die
      // Adresse gibt.
      expect(antwort.status(), `Kopf: ${JSON.stringify(kopf)}`).toBe(404);
    }

    await fremd.close();
  });

  test("mit dem richtigen Geheimnis läuft er und meldet Zahlen", async ({
    browser,
  }) => {
    const geheim = process.env.CRON_SECRET;
    test.skip(!geheim, "CRON_SECRET nicht gesetzt");

    const fremd = await browser.newContext();
    const antwort = await fremd.request.get("/api/cron/aufraeumen", {
      headers: { authorization: `Bearer ${geheim}` },
      failOnStatusCode: false,
    });

    expect(antwort.status()).toBe(200);
    const daten = await antwort.json();
    expect(typeof daten.erinnert).toBe("number");
    expect(typeof daten.geloescht).toBe("number");
    await fremd.close();
  });
});
