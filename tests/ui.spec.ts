import { expect, test } from "playwright/test";

test.describe("mobile ui interactions", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile menu opens and shows links", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /menü öffnen/i }).tap();

    const menu = page.locator("nav").filter({ hasText: "Gutscheine" }).last();
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Start" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Galerie" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Preise" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Gutscheine" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Kontakt" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Instagram" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Portfolio" })).toHaveCount(0);
  });

  test("gallery thumbnail opens lightbox", async ({ page }) => {
    await page.goto("/galerie");

    await page
      .getByRole("button", { name: /portrait bild 1 öffnen/i })
      .tap();

    const lightbox = page.getByRole("dialog");
    await expect(lightbox).toBeVisible();
    await expect(
      lightbox.getByRole("button", { name: /galerie schließen/i })
    ).toBeVisible();
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
    await expect(page.getByText(/150\s*€/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Wertgutschein kaufen" })
    ).toBeVisible();
  });

  test("contact form has no voucher checkout fields", async ({ page }) => {
    await page.goto("/kontakt");
    await page.waitForLoadState("networkidle");

    const requestType = page.getByPlaceholder(/anfrageart/i);
    await expect(requestType).toBeVisible();
    await requestType.fill("Portrait");
    await expect(requestType).toHaveValue("Portrait");
    await expect(page.locator('select[name="voucherType"]')).toHaveCount(0);
    await expect(page.getByLabel(/gewünschter gutscheinbetrag/i)).toHaveCount(0);
  });

  test("mobile hero slider changes automatically", async ({ page }) => {
    await page.goto("/");

    const hero = page.locator("[data-active-slide]");
    await expect(hero).toHaveAttribute("data-active-slide", "0");
    await expect(hero).not.toHaveAttribute("data-active-slide", "0", {
      timeout: 6_000,
    });
  });
});
