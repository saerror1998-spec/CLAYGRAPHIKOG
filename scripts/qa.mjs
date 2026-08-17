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

// Back to the homepage for section-level suites
await page.goto(BASE + "/", { waitUntil: "load" });
await sleep(5600);

// ---- Signature scroll suite (desktop) ----
const sigTop = await page.evaluate(() => {
  const el = document.querySelector('[aria-label="From idea to impact"]');
  return window.scrollY + el.getBoundingClientRect().top;
});
const sigState = () =>
  page.evaluate(() => {
    const words = [...document.querySelectorAll("[data-sig-word]")].map((w) =>
      parseFloat(getComputedStyle(w).opacity).toFixed(2),
    );
    const paths = [...document.querySelectorAll("[data-sig-path]")].map(
      (p) => p.style.strokeDashoffset || "set",
    );
    const rect = document.querySelector('[aria-label="From idea to impact"]').getBoundingClientRect();
    return { words, paths, rectTop: Math.round(rect.top), scrollY: window.scrollY };
  });
const scrollToY = async (y) => {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await sleep(900);
};
const vh = 900;
const sigEnd = sigTop + vh * 3; // pin range = 300% of the viewport
const pct = (p) => sigTop + (sigEnd - sigTop) * p;
await scrollToY(pct(0.02));
const sStart = await sigState();
check(
  "sig: pinned at top + IDEA visible",
  sStart.rectTop >= -4 && sStart.rectTop <= 4 && sStart.words[0] === "1.00",
  JSON.stringify({ ...sStart, vh }),
);
await scrollToY(pct(0.45));
const sMid = await sigState();
check(
  "sig: FORM active mid-way + path1 drawn",
  sMid.words[1] === "1.00" && sMid.paths[0] === "0px",
  JSON.stringify(sMid),
);
await scrollToY(pct(0.95));
const sHigh = await sigState();
check(
  "sig: IMPACT active + all paths drawn at 95%",
  sHigh.words[3] === "1.00" &&
    sHigh.paths.every((p) => p === "0px") &&
    sHigh.words[0] !== "1.00",
  JSON.stringify(sHigh),
);
await scrollToY(pct(0.2));
const sBack = await sigState();
check(
  "sig: reverse scroll moves back toward IDEA",
  sBack.words[3] !== "1.00" && (sBack.words[0] === "1.00" || sBack.words[1] === "1.00"),
  JSON.stringify(sBack),
);

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

// Mobile signature: no pin, vertical sequence reveals on scroll
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
const mp = await mctx.newPage();
await mp.goto(BASE, { waitUntil: "load" });
await sleep(2600);
const mSig = await mp.evaluate(() => {
  const sec = document.querySelector('[aria-label="From idea to impact"]');
  const noPin = !sec.parentElement?.classList.contains("pin-spacer");
  const blocks = [...document.querySelectorAll("[data-mobile-block]")];
  return { noPin, blocks: blocks.length, words: blocks.map((b) => !!b.querySelector("[data-mobile-word]")).every(Boolean) };
});
check(
  "sig: mobile vertical sequence (no pin, 4 blocks)",
  mSig.noPin && mSig.blocks === 4 && mSig.words,
  JSON.stringify(mSig),
);
await mctx.close();

// ---- Secondary pages suite ----
const pctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const pp = await pctx.newPage();

// /work + filter
await pp.goto(BASE + "/work", { waitUntil: "load" });
await sleep(1800);
check(
  "work: hero + grid render",
  (await pp.getByText("OUR WORK.").count()) > 0 && (await pp.locator("article").count()) === 3,
);
await pp.getByRole("button", { name: "WEB" }).click();
await sleep(600);
check(
  "work: filter narrows to web",
  (await pp.locator("article").count()) === 1 &&
    (await pp.locator("article").first().textContent()).includes("Web Platform"),
);

// /work/[slug]
await pp.goto(BASE + "/work/brand-book-system", { waitUntil: "load" });
await sleep(1800);
check(
  "work/[slug]: case study renders",
  (await pp.getByText("Brand Book System").count()) > 0 &&
    (await pp.getByText("CHALLENGE").count()) > 0 &&
    (await pp.getByText("NEXT PROJECT").count()) > 0,
);

// /services + detail
await pp.goto(BASE + "/services", { waitUntil: "load" });
await sleep(1800);
check(
  "services: index renders 4 groups",
  (await pp.getByText("SERVICES.").count()) > 0 &&
    (await pp.getByText("Websites & UX").count()) > 0 &&
    (await pp.getByText("Creative Direction").count()) > 0,
);
await pp.goto(BASE + "/services/strategy-identity", { waitUntil: "load" });
await sleep(1800);
check(
  "services/[slug]: detail renders capabilities",
  (await pp.getByText("Strategy & Identity").count()) > 0 &&
    (await pp.getByText("Brand Guidelines").count()) > 0,
);

// /about
await pp.goto(BASE + "/about", { waitUntil: "load" });
await sleep(1800);
check(
  "about: renders",
  (await pp.getByText("SERIOUS CRAFT.").count()) > 0 &&
    (await pp.getByText("PRINCIPLES").count()) > 0,
);

// /contact — validation + honest non-success state
await pp.goto(BASE + "/contact", { waitUntil: "load" });
await sleep(1800);
await pp.getByRole("button", { name: /SEND MESSAGE/ }).click();
await sleep(300);
check(
  "contact: empty submit shows validation errors",
  (await pp.getByText("Please enter your name.").count()) > 0 &&
    (await pp.getByText("Please enter a valid email address.").count()) > 0,
);
await pp.fill("#cf-name", "Test Client");
await pp.fill("#cf-email", "test@example.com");
await pp.fill("#cf-details", "We need a new brand identity and website before the end of the quarter.");
await pp.getByRole("button", { name: /SEND MESSAGE/ }).click();
await sleep(1200);
check(
  "contact: unconfigured provider shows honest error",
  (await pp.getByText(/not connected to an email provider/i).count()) > 0,
);

// legal + 404
await pp.goto(BASE + "/privacy", { waitUntil: "load" });
await sleep(1600);
check("privacy: renders", (await pp.getByText("PRIVACY POLICY.").count()) > 0);
await pp.goto(BASE + "/terms", { waitUntil: "load" });
await sleep(1600);
check("terms: renders", (await pp.getByText("TERMS OF USE.").count()) > 0);
await pp.goto(BASE + "/does-not-exist", { waitUntil: "load" });
await sleep(1600);
check(
  "404: branded page renders",
  (await pp.getByText("LOST IN").count()) > 0 &&
    (await pp.getByText("BACK TO HOME").count()) > 0,
);
await pctx.close();

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
