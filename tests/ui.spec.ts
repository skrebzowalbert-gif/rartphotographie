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
    await expect(
      page.getByRole("heading", { level: 1, name: /Fotograf in Kaufbeuren/i })
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
