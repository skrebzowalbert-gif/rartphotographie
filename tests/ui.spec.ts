import { expect, test } from "playwright/test";

test.describe("mobile ui interactions", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile menu opens and shows links", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /menü öffnen/i }).tap();

    const menu = page.getByRole("navigation", { name: /mobile navigation/i });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Galerie" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Preise" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Über mich" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Gutscheine" })).toBeVisible();
    // Der Anfrage-CTA muss im Menü prominent vorhanden sein.
    await expect(
      menu.getByRole("link", { name: "Shooting anfragen" })
    ).toBeVisible();
  });

  test("hero shows a family-oriented motif and a request CTA", async ({
    page,
  }) => {
    await page.goto("/");

    // Der Hero zeigte zuvor entsaettigte Fashion-Motive, obwohl Familien-,
    // Babybauch- und Newborn-Shootings verkauft werden.
    const heroImg = page.locator("main img").first();
    await expect(heroImg).toHaveAttribute("alt", /babybauch|familie/i);

    // Genau eine H1, und der Anfrage-CTA muss im Hero stehen.
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.locator("section").first().getByRole("link", {
        name: /Shooting anfragen/i,
      })
    ).toBeVisible();
  });

  test("persistent contact bar is visible on mobile", async ({ page }) => {
    await page.goto("/");

    // Dauerhaft erreichbarer Kontaktweg, ohne das Menü öffnen zu müssen.
    const bar = page.locator("div.fixed.bottom-0");
    await expect(
      bar.getByRole("link", { name: "Shooting anfragen" })
    ).toBeVisible();
  });

  test("contact form is reachable without endless scrolling", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    await page.waitForLoadState("networkidle");

    const nameField = page.getByLabel(/^name/i);
    const box = await nameField.boundingBox();

    expect(box).not.toBeNull();
    // Vorher lag das erste Eingabefeld bei ~1162 px.
    expect(box!.y).toBeLessThan(900);
  });

  test("request type is a select, not a free text field", async ({ page }) => {
    await page.goto("/kontakt");
    await page.waitForLoadState("networkidle");

    const requestType = page.locator('select[name="type"]');
    await expect(requestType).toBeVisible();
    await requestType.selectOption("Hochzeit");
    await expect(requestType).toHaveValue("Hochzeit");

    // Ohne Parameter darf die Partner-Sektion nicht erscheinen.
    await expect(page.getByText(/premium-fahrzeug/i)).toHaveCount(0);
    await expect(page.locator('select[name="voucherType"]')).toHaveCount(0);
  });

  test("every shooting type linked from other pages preselects correctly", async ({
    page,
  }) => {
    // Diese Werte sendet src/app/preise/page.tsx und src/app/portfolio/**.
    // Fehlt einer im Dropdown, verliert ausgerechnet die teuerste
    // Produktgruppe ihre Vorauswahl.
    const linkedValues = [
      "Portraitshooting",
      "Familienshooting",
      "Babybauchshooting",
      "Newbornshooting",
      "Hochzeit",
      "Hochzeit – Mini-Paket",
      "Hochzeit – Kurzpaket",
      "Hochzeit – Standardpaket",
      "Hochzeit – Erweitertes Paket",
      "Eventfotografie",
    ];

    for (const value of linkedValues) {
      await page.goto(`/kontakt?shooting=${encodeURIComponent(value)}`);
      await page.waitForSelector('select[name="type"]');
      await expect(
        page.locator('select[name="type"]'),
        `Vorauswahl für "${value}"`
      ).toHaveValue(value);
    }
  });

  test("vehicle partner option appears only via the price page link", async ({
    page,
  }) => {
    // Von /preise verlinkt ("Mit Premium-Fahrzeug kombinieren").
    await page.goto("/kontakt?shooting=Hochzeit&vehicleInterest=true");
    await page.waitForLoadState("networkidle");

    const vehicle = page.locator('select[name="vehicle"]');
    await expect(vehicle).toBeVisible();
    await vehicle.selectOption("Audi RSQ8 weiß");
    await expect(vehicle).toHaveValue("Audi RSQ8 weiß");
  });

  test("contact form links to the privacy policy", async ({ page }) => {
    await page.goto("/kontakt");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("link", { name: /datenschutzerklärung/i })
    ).toBeVisible();
  });

  test("gallery thumbnail opens lightbox", async ({ page }) => {
    await page.goto("/galerie");

    await page
      .getByRole("button", { name: /galeriebild 1 öffnen/i })
      .tap();

    const lightbox = page.getByRole("dialog");
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator("img")).toBeVisible();
  });

  test("value voucher amount can be entered on voucher checkout", async ({
    page,
  }) => {
    await page.goto("/gutscheine");

    const amountInput = page.getByLabel(/gewünschter gutscheinbetrag/i);
    await expect(amountInput).toBeVisible();
    await amountInput.fill("150");
    await expect(amountInput).toHaveValue("150");
    await expect(page.getByText(/150\s*€/).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Wertgutschein kaufen" })
    ).toBeVisible();
  });

});

test.describe("gutschein checkout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the page shows what the voucher will look like", async ({ page }) => {
    await page.goto("/gutscheine");
    await page.waitForLoadState("networkidle");

    // Vor dem Kauf sehen, was die beschenkte Person bekommt.
    const preview = page.getByRole("img", { name: /Beispiel des Gutscheins/i });
    await expect(preview).toBeVisible();
  });

  test("gift occasions are present for search intent", async ({ page }) => {
    await page.goto("/gutscheine");
    await page.waitForLoadState("networkidle");

    for (const occasion of [
      /Zum Geburtstag/,
      /Muttertag/,
      /Zur Geburt/,
      /Jahrestag/,
      /Weihnachten/,
      /Last Minute/,
    ]) {
      await expect(
        page.getByRole("heading", { name: occasion }),
        `Anlass ${occasion}`
      ).toBeVisible();
    }
  });

  test("amount presets fill the field", async ({ page }) => {
    await page.goto("/gutscheine");
    await page.waitForLoadState("networkidle");

    // Ohne Vorschläge orientiert sich der Käufer am Minimum von 50 €.
    await page.getByRole("button", { name: /^200 € Portrait$/ }).click();
    await expect(page.locator('input[name="voucherCustomAmount"]')).toHaveValue(
      "200"
    );
  });

  test("address is only required for postal delivery", async ({ page }) => {
    await page.goto("/gutscheine");
    await page.waitForLoadState("networkidle");

    // Standard ist digital – dann darf keine Anschrift verlangt werden.
    await expect(page.locator('input[name="street"]')).toHaveCount(0);

    await page.getByRole("radio", { name: /Zusätzlich per Post/ }).check();
    await expect(page.locator('input[name="street"]')).toBeVisible();

    await page.getByRole("radio", { name: /Sofort per E-Mail/ }).check();
    await expect(page.locator('input[name="street"]')).toHaveCount(0);
  });

  test("no checkout is started before the terms are confirmed", async ({
    page,
  }) => {
    await page.goto("/gutscheine");
    await page.waitForLoadState("networkidle");

    let checkoutCalls = 0;
    await page.route("**/api/checkout", async (route) => {
      checkoutCalls += 1;
      await route.abort();
    });

    await page.locator('input[name="voucherCustomAmount"]').fill("200");
    await page.locator('input[name="name"]').fill("Test Person");
    await page.locator('input[name="email"]').fill("test@example.com");
    await page.locator('input[name="recipient"]').fill("Anna");

    const terms = page.locator('input[type="checkbox"]');
    await expect(terms).not.toBeChecked();

    await page.getByRole("button", { name: /Wertgutschein kaufen/ }).click();
    await page.waitForTimeout(400);

    // Weder die native Pflichtprüfung noch die eigene darf den Kauf durchlassen.
    expect(checkoutCalls, "Checkout-Aufrufe ohne bestätigte AGB").toBe(0);

    // Mit Bestätigung wird der Kauf ausgelöst.
    await terms.check();
    await page.getByRole("button", { name: /Wertgutschein kaufen/ }).click();
    await expect.poll(() => checkoutCalls).toBe(1);
  });
});

test.describe("gutschein api", () => {
  test("checkout rejects a purchase without accepted terms", async ({
    request,
  }) => {
    const res = await request.post("/api/checkout", {
      data: {
        voucherCustomAmount: "200",
        name: "Test",
        email: "test@example.com",
        recipient: "Anna",
        delivery: "email",
      },
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).error).toMatch(/Widerrufsbelehrung/i);
  });

  test("checkout requires an address only for postal delivery", async ({
    request,
  }) => {
    const res = await request.post("/api/checkout", {
      data: {
        voucherCustomAmount: "200",
        name: "Test",
        email: "test@example.com",
        recipient: "Anna",
        delivery: "post",
        acceptedTerms: true,
      },
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).error).toMatch(/Postversand/i);
  });

  test("voucher pdf is not served without a paid session", async ({
    request,
  }) => {
    // Ohne gültige, bezahlte Stripe-Session darf nie ein Gutschein herauskommen.
    for (const query of ["", "?session_id=", "?session_id=cs_test_erfunden"]) {
      const res = await request.get(`/api/gutschein/pdf${query}`);
      expect(res.status(), `PDF-Zugriff mit "${query}"`).toBe(404);
    }
  });

  test("stripe webhook rejects unsigned requests", async ({ request }) => {
    const res = await request.post("/api/stripe/webhook", {
      data: { type: "checkout.session.completed" },
    });

    // Ohne gültige Signatur darf nichts verarbeitet werden.
    expect([400, 500]).toContain(res.status());
  });
});

test.describe("seo essentials", () => {
  // Der teuerste Fehler der bisherigen Version: canonical zeigte auf den
  // Host ohne www, der per 307 auf www zurückleitet.
  test("canonical points to the delivering host", async ({ page }) => {
    for (const path of ["/", "/preise", "/kontakt", "/fotografin-kaufbeuren"]) {
      await page.goto(path);
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");

      expect(canonical, `canonical auf ${path}`).toBeTruthy();
      expect(canonical!.startsWith("https://www.")).toBe(true);
    }
  });

  test("every page ships exactly one h1 in the server HTML", async ({
    request,
  }) => {
    // Bewusst ohne Browser: geprüft wird das AUSGELIEFERTE HTML.
    // Auf /kontakt lag die gesamte Seite in einer Suspense-Grenze, weil das
    // Formular useSearchParams nutzt – der Server lieferte nur den leeren
    // Platzhalter, die h1 entstand erst nach der Hydration.
    const paths = [
      "/",
      "/preise",
      "/galerie",
      "/gutscheine",
      "/portfolio",
      "/ueber-mich",
      "/kontakt",
      "/babybauch-shooting-kaufbeuren",
      "/newborn-fotograf-kaufbeuren",
      "/familienfotograf-kaufbeuren",
      "/fotografin-kaufbeuren",
      "/fotografin-allgaeu",
    ];

    for (const path of paths) {
      const html = await (await request.get(path)).text();
      const count = (html.match(/<h1[\s>]/g) || []).length;
      expect(count, `h1 im Server-HTML von ${path}`).toBe(1);
    }
  });

  test("homepage exposes local business and FAQ structured data", async ({
    page,
  }) => {
    await page.goto("/");

    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const combined = blocks.join("");

    expect(combined).toContain("LocalBusiness");
    expect(combined).toContain("Photographer");
    expect(combined).toContain("FAQPage");
    expect(combined).toContain("Kaufbeuren");
  });
});
