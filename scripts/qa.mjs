/**
 * Clay Graphik QA harness — drives a real (headless Edge) browser against the
 * dev server with reduced-motion DISABLED, at multiple viewports.
 *
 * Usage: node scripts/qa.mjs [url]
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] || "http://localhost:3000";
const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/microsoft-edge",
  "/usr/bin/google-chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
];

const results = [];
const errors = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch() {
  for (const exe of EDGE_CANDIDATES) {
    try {
      return await chromium.launch({ executablePath: exe, headless: true });
    } catch {
      /* try next */
    }
  }
  return chromium.launch({ headless: true });
}

const stageX = (page) =>
  page.evaluate(() => {
    const el = document.querySelector("[data-stage]");
    if (!el) return null;
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return Math.round(m.m41 * 100) / 100;
  });

const noHOverflow = (page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

async function menuSuite(page) {
  await page.click("button[data-menu-toggle]");
  await sleep(1500);
  check(
    "menu: underlay panel fully in view",
    await page.evaluate(() => {
      const p = document.querySelector("[data-underlay-panel]");
      const m = new DOMMatrix(getComputedStyle(p).transform);
      return Math.abs(m.m41) < 8;
    }),
    `panelX=${await page
      .locator("[data-underlay-panel]")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)}`,
  );
  const x = await stageX(page);
  check("menu: stage shifted left", typeof x === "number" && x < -100, `stageX=${x}`);
  const settled = await page
    .locator("[data-menu-item-label]")
    .first()
    .evaluate((el) => {
      const m = new DOMMatrix(getComputedStyle(el).transform);
      return Math.abs(m.m42) < 2;
    });
  check("menu: labels settled", settled);
  check(
    "menu: numbers visible",
    await page
      .locator("[data-menu-number]")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).opacity) > 0.9),
  );

  // Escape close
  await page.keyboard.press("Escape");
  await sleep(800);
  check(
    "menu: escape closes",
    await page.evaluate(
      () => document.querySelector("#underlay-menu")?.getAttribute("inert") !== null,
    ),
  );

  // Re-open then click stage to close
  await page.click("button[data-menu-toggle]");
  await sleep(1400);
  await page.mouse.click(180, 500);
  await sleep(800);
  check(
    "menu: click-away closes",
    await page.evaluate(
      () => document.querySelector("#underlay-menu")?.getAttribute("inert") !== null,
    ),
  );
  const x2 = await stageX(page);
  check("menu: stage returns", typeof x2 === "number" && x2 > -20, `stageX=${x2}`);

  // Re-open then navigate via menu link
  await page.click("button[data-menu-toggle]");
  await sleep(1400);
  await page.locator("[data-underlay-panel] a[href='/work']").click();
  await sleep(1200);
  check("menu: route click navigates + closes", page.url().includes("/work"));
}

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(BASE, { waitUntil: "load" });
await sleep(5600); // entry sequence + full hero entrance (~4.5s)

check(
  "entry: loader hidden after sequence",
  await page.locator("div.z-\\[60\\]").evaluate((el) => getComputedStyle(el).display === "none"),
);

const overflow = await noHOverflow(page);
check("layout: no horizontal overflow @1440", overflow <= 1, `overflow=${overflow}`);

// ---- Hero gate @1440x900 ----
const heroVisible = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const chars = document.querySelectorAll(".split-char");
  const all = [...chars].every((el) => {
    const cs = getComputedStyle(el);
    return parseFloat(cs.opacity) > 0.9;
  });
  return { h1: !!h1, chars: chars.length, all };
});
check("hero: split chars all visible", heroVisible.all, `chars=${heroVisible.chars}`);
check(
  "hero: that move shine active + gradient lime",
  await page.evaluate(() => {
    const s = document.querySelector("[data-shine]");
    const cs = s ? getComputedStyle(s) : null;
    return (
      s?.classList.contains("shine-active") &&
      cs.color === "rgba(0, 0, 0, 0)" &&
      cs.backgroundImage.includes("204, 255, 0")
    );
  }),
);
check(
  "hero: eyebrow visible",
  await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector("[data-hero-eyebrow]")).opacity) > 0.9),
);
check(
  "hero: CTA visible",
  await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector("[data-hero-cta]")).opacity) > 0.9),
);
const aurora = await page.evaluate(() => {
  const ctn = document.querySelector(".hero-aurora");
  const canvas = ctn?.querySelector("canvas");
  return {
    canvas: !!canvas,
    w: canvas?.width || 0,
    h: canvas?.height || 0,
    frames: Number(ctn?.dataset.frames || 0),
  };
});
check("aurora: canvas exists with size", aurora.canvas && aurora.w > 100 && aurora.h > 100, JSON.stringify(aurora));
check("aurora: render loop advancing", aurora.frames > 10, `frames=${aurora.frames}`);

// Hero first-viewport fit on the required desktop sizes
for (const [w, h] of [[1920, 1080], [1600, 900], [1440, 900], [1366, 768]]) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: "load" });
  await sleep(5600);
  const fit = await p.evaluate(() => {
    const cue = document.querySelector("[data-hero-cue]");
    const cta = document.querySelector("[data-hero-cta]");
    const cueRect = cue.getBoundingClientRect();
    const ctaRect = cta.getBoundingClientRect();
    return {
      cueBottom: cueRect.bottom,
      ctaBottom: ctaRect.bottom,
      vh: window.innerHeight,
      ctaVisible: parseFloat(getComputedStyle(cta).opacity) > 0.9,
    };
  });
  check(
    `hero: fits one viewport @${w}x${h}`,
    fit.ctaVisible && fit.cueBottom <= fit.vh && fit.ctaBottom <= fit.vh,
    JSON.stringify(fit),
  );
  await c.close();
}

await menuSuite(page);

// Route transition: navigate home from /work and inspect overlay state
await page.goto(BASE + "/", { waitUntil: "load" });
await sleep(1500);
check(
  "transition: overlay hidden after navigation",
  await page.locator("div.z-\\[50\\]").evaluate((el) => getComputedStyle(el).visibility === "hidden"),
);
await ctx.close();

// ---- Multi-viewport sweep: no horizontal overflow, stage fills viewport ----
const SIZES = [
  [1920, 1080],
  [1600, 900],
  [1440, 900],
  [1366, 768],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [375, 812],
];
for (const [w, h] of SIZES) {
  const c = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: "no-preference",
  });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: "load" });
  await sleep(2500);
  const ov = await noHOverflow(p);
  check(`layout: no horizontal overflow @${w}x${h}`, ov <= 1, `overflow=${ov}`);
  check(
    `layout: stage fills viewport @${w}x${h}`,
    await p.evaluate(() => {
      const el = document.querySelector("[data-stage]");
      const r = el.getBoundingClientRect();
      return r.width > window.innerWidth - 60;
    }),
  );
  await c.close();
}

await browser.close();

const passed = results.filter((r) => r.ok).length;
console.table(results);
console.log(`\n${passed}/${results.length} checks passed`);
if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  errors.forEach((e) => console.log(" -", e));
} else {
  console.log("\nNo console errors.");
}
process.exit(passed === results.length ? 0 : 1);
