import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const base = process.env.E2E_BASE_URL || "http://127.0.0.1:8080";

function contrast(fg, bg) {
  const parse = (value) => value.match(/\d+/g).slice(0, 3).map(Number);
  const lin = (channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const L = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  const a = L(parse(fg));
  const b = L(parse(bg));
  const light = Math.max(a, b);
  const dark = Math.min(a, b);
  return (light + 0.05) / (dark + 0.05);
}

test("signed-in today is five buttons, then saved keeps the note", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.clock.install({ time: new Date("2026-10-04T16:00:00Z") });
    await page.goto(base);
    await page.getByRole("button", { name: "Create an account" }).click();
    await page.getByLabel("Email").fill(`today${Date.now()}@example.com`);
    await page.getByLabel("Password").fill("night-test-1");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByText("of 5").waitFor({ timeout: 20000 });
    await page.locator("ul button").nth(4).waitFor({ timeout: 20000 });

    const nav = page.getByRole("navigation", { name: "Sections" });
    assert.deepEqual(
      (await nav.getByRole("button").allTextContents()).map((text) => text.trim()),
      ["Today", "Saved"],
    );
    assert.equal(await page.getByRole("button", { name: "Feed", exact: true }).count(), 0);
    assert.equal(await page.getByText("Watching now").count(), 0);
    assert.equal(await page.locator("ul button").count(), 5);

    const firstDay = await page.locator("ul button").allInnerTexts();
    await page.reload();
    await page.locator("ul button").nth(4).waitFor();
    assert.deepEqual(await page.locator("ul button").allInnerTexts(), firstDay);

    const rowText = await page.locator("ul button").first().innerText();
    const passed = rowText.split("\n")[0];
    const year = rowText.match(/\d{4}/);
    assert.ok(year, rowText);
    await page.locator("ul button").first().click();
    await page.getByRole("heading", { level: 1, name: passed }).waitFor();
    const score = Number(await page.locator("article p.font-serif").first().innerText());
    assert.equal(Number.isInteger(score), true);
    assert.ok(score >= 12 && score <= 97);
    assert.equal(await page.locator("article").getByText("Tonight", { exact: true }).count(), 1);
    assert.equal(await page.getByText("All-time").count(), 0);
    const cardText = await page.locator("article").innerText();
    assert.ok(cardText.includes(year[0]));
    for (const label of ["Director", "Cast", "Genre"]) {
      assert.equal(await page.locator("article dt", { hasText: new RegExp(`^${label}$`) }).count(), 1);
    }
    const fact = async (label) =>
      (
        await page
          .locator("article div")
          .filter({ has: page.locator("dt", { hasText: new RegExp(`^${label}$`) }) })
          .locator("dd")
          .innerText()
      ).trim();
    assert.ok((await fact("Genre")).length > 1);
    if (passed !== "The Plantagenets" && passed !== "Woody Allen") {
      assert.ok((await fact("Cast")).length > 1);
    }
    for (const label of ["Google", "IMDb", "Rotten Tomatoes"]) {
      const term = page.locator("article dt", { hasText: new RegExp(`^${label}$`) });
      if ((await term.count()) === 0) continue;
      const value = (await term.locator("xpath=following-sibling::dd[1]").innerText()).trim();
      assert.match(value, /^(?:\d{1,3}%|\d{1,2}(?:\.\d)?)$/);
    }
    assert.equal(await page.locator("article").getByText("N/A", { exact: true }).count(), 0);
    assert.equal(await page.locator("article").getByText("Unknown", { exact: true }).count(), 0);
    assert.equal(await page.getByText("Not tonight", { exact: true }).count(), 1);
    const title = getComputedStyleWait(page);
    const colors = await title;
    assert.ok(contrast(colors.title, colors.bg) >= 4.5);
    assert.ok(contrast(colors.quiet, colors.bg) >= 4.5);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    assert.equal(overflow, false);
    const yes = await page.getByRole("button", { name: "Yes", exact: true }).boundingBox();
    assert.ok(yes && yes.y + yes.height <= 844);

    await page.getByRole("button", { name: "Not tonight", exact: true }).click();
    await page.getByText("1 of 5").waitFor();
    assert.equal(await page.getByRole("button", { name: passed, exact: true }).count(), 0);

    const yesName = (await page.locator("ul button").first().innerText()).split("\n")[0];
    await page.locator("ul button").first().click();
    await page.getByRole("button", { name: "Yes", exact: true }).click();
    await page.getByText("2 of 5").waitFor();
    assert.equal(await page.getByRole("button", { name: yesName, exact: true }).count(), 0);

    const liked = (await page.locator("ul button").first().innerText()).split("\n")[0];
    await page.locator("ul button").first().click();
    await page.getByRole("button", { name: "Like", exact: true }).click();
    await page.getByLabel("Note").fill("Kept this one");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.getByText("3 of 5").waitFor();
    await page.getByRole("button", { name: "Saved", exact: true }).click();
    await page.getByRole("heading", { name: "Saved" }).waitFor();
    await page.getByText(liked).waitFor();
    await page.getByText("Kept this one").waitFor();
    assert.equal(await page.getByText(passed).count(), 0);

    await page.clock.setSystemTime(new Date("2026-10-05T16:00:00Z"));
    await page.reload();
    await page.getByText("October 5").waitFor({ timeout: 20000 });
    await page.locator("ul button").nth(4).waitFor({ timeout: 20000 });
    assert.equal(await page.locator("ul button").count(), 5);
    const nextDay = await page.locator("ul button").allInnerTexts();
    assert.equal(nextDay.some((row) => row.startsWith(passed)), false);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally {
    await browser.close();
  }
});

async function getComputedStyleWait(page) {
  return page.evaluate(() => {
    const title = document.querySelector("article h1");
    const quiet = document.querySelector("article p.text-muted");
    const bg = getComputedStyle(document.body).backgroundColor;
    return {
      title: getComputedStyle(title).color,
      quiet: getComputedStyle(quiet).color,
      bg,
    };
  });
}

test("grok add stops at six in a utc day", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let calls = 0;
  // Only this function. A blanket /_serverFn/ route breaks saveTaste even on continue().
  const suggestMore =
    "**/_serverFn/eyJmaWxlIjoiL3NyYy9saWIvZ3Jvay1mbnMudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0Ijoic3VnZ2VzdE1vcmVfY3JlYXRlU2VydmVyRm5faGFuZGxlciJ9";
  await page.route(suggestMore, async (route) => {
    calls += 1;
    // Server functions answer with a seroval payload and x-tss-serialized, not a bare JSON body.
    await route.fulfill({
      status: 200,
      headers: {
        "content-type": "application/json",
        "x-tss-serialized": "true",
      },
      body: JSON.stringify({
        t: 10,
        i: 0,
        p: {
          k: ["result", "error", "context"],
          v: [
            { t: 10, i: 1, p: { k: ["ok", "picks"], v: [{ t: 2, s: 2 }, { t: 9, i: 2, a: [], o: 0 }] }, o: 0 },
            { t: 2, s: 1 },
            { t: 10, i: 3, p: { k: [], v: [] }, o: 0 },
          ],
        },
        o: 0,
      }),
    });
  });
  try {
    await page.goto(base);
    await page.getByRole("button", { name: "Create an account" }).click();
    await page.getByLabel("Email").fill(`cap${Date.now()}@example.com`);
    await page.getByLabel("Password").fill("night-test-1");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.locator("ul button").nth(4).waitFor({ timeout: 20000 });
    for (let i = 0; i < 5; i += 1) {
      await page.locator("ul button").first().click();
      await page.getByRole("button", { name: "Not tonight", exact: true }).click();
    }
    const ask = page.getByRole("button", { name: "Ask Grok for more" });
    await ask.waitFor();
    for (let i = 0; i < 6; i += 1) {
      const before = calls;
      await ask.click();
      const start = Date.now();
      while (calls === before && Date.now() - start < 8000) {
        await page.waitForTimeout(20);
      }
    }
    assert.equal(calls, 6);
    const disabledAt = Date.now();
    let disabled = false;
    while (!disabled && Date.now() - disabledAt < 5000) {
      disabled = await ask.isDisabled().catch(() => false);
      if (!disabled) await page.waitForTimeout(30);
    }
    assert.equal(disabled, true);
    await ask.click({ force: true });
    await page.waitForTimeout(150);
    assert.equal(calls, 6);
  } finally {
    await browser.close();
  }
});
