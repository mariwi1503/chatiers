import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
});

test("reference feed renders without overflow and interactions persist", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("article")).toHaveCount(4);
  await expect(
    page.getByRole("link", { name: "Rizky Pratama", exact: true }).first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const first = page.locator("article").first();
  await first
    .getByRole("button", { name: "Sukai posting Rizky Pratama", exact: true })
    .click();
  await expect(
    first.getByRole("button", { name: "Batal suka posting Rizky Pratama" }),
  ).toContainText("343");
  await first
    .getByRole("button", { name: "Simpan posting", exact: true })
    .click();
  await page.reload();
  await expect(
    page
      .locator("article")
      .first()
      .getByRole("button", { name: "Batal suka posting Rizky Pratama" }),
  ).toContainText("343");
  await page.goto("/saved");
  await expect(page.locator("article")).toHaveCount(1);
  await page.goto("/explore");
  await page.getByLabel("Cari ide, produk, atau founder").fill("FinSmart");
  await expect(page.locator("article")).toHaveCount(1);
  await page.getByRole("button", { name: "Cari Tim", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("publishes a post, adds a comment, and updates profile", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Bagikan ide", exact: true })
    .last()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByLabel("Isi posting")
    .fill("Mencari mitra bisnis untuk produk kopi lokal yang berkelanjutan.");
  await page.getByLabel("Apa yang ingin kamu bagikan?").selectOption("Produk");
  await page.getByRole("button", { name: "Bagikan sekarang" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("article")).toHaveCount(5);
  await page
    .locator("article")
    .first()
    .getByRole("link", { name: /Lihat 0 komentar/ })
    .click();
  await page
    .getByLabel("Tulis komentar")
    .fill("Saya tertarik kolaborasi, mari diskusi!");
  await page.getByRole("button", { name: "Kirim komentar" }).click();
  await expect(page.locator(".comment")).toContainText(
    "Saya tertarik kolaborasi",
  );
  await page.goto("/profile");
  await page.getByRole("button", { name: "Edit profil" }).click();
  await page.getByLabel("Nama lengkap").fill("Dimas Pratama");
  await page.getByLabel("Nama perusahaan").fill("Kopi Lokal");
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(
    page.getByRole("heading", { name: "Dimas Pratama" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Dimas Pratama" }),
  ).toBeVisible();
  await expect(page.getByText("Founder @ Kopi Lokal").first()).toBeVisible();
});

test("messages and following persist; private routes carry noindex", async ({
  page,
}) => {
  await page.goto("/people/andi");
  await page.getByRole("button", { name: "Ikuti", exact: true }).click();
  await expect(page.getByRole("button", { name: "Mengikuti" })).toBeVisible();
  await page.getByRole("link", { name: "Mulai percakapan" }).click();
  await page
    .getByLabel("Tulis pesan")
    .fill("Halo Andi, saya tertarik dengan peluang kolaborasi FinSmart.");
  await page.getByRole("button", { name: "Kirim pesan", exact: true }).click();
  await expect(page.locator(".chat-bubble.mine")).toContainText("Halo Andi");
  await page.reload();
  await expect(page.locator(".chat-bubble.mine")).toContainText("Halo Andi");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await page.goto("/activity");
  await page.getByRole("button", { name: "Tandai semua sudah dibaca" }).click();
  await page.getByRole("button", { name: "Belum dibaca", exact: true }).click();
  await expect(page.locator(".activity-row")).toHaveCount(0);
});

test("responsive layouts, local assets, and SEO endpoints", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page.locator("img").evaluateAll((nodes) =>
    nodes.forEach((node) => {
      (node as HTMLImageElement).loading = "eager";
    }),
  );
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              (node as HTMLImageElement).complete &&
              (node as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.setViewportSize({ width: 390, height: 1866 });
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  expect(
    await page
      .locator("img")
      .evaluateAll((nodes) =>
        nodes.every(
          (node) =>
            (node as HTMLImageElement).complete &&
            (node as HTMLImageElement).naturalWidth > 0,
        ),
      ),
  ).toBe(true);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^http:\/\/localhost:3000\/?$/,
  );
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).status()).toBe(200);
});
