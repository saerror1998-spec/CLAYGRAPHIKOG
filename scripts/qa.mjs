/**
 * Clay Graphik QA harness — drives a real (headless Edge) browser against the
 * dev server with reduced-motion DISABLED, at multiple viewports.
 *
 * Usage: node scripts/qa.mjs [url]
 */
import { chromium } from "playwright-core";
import { PNG } from "pngjs";

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
  // Stage composition: panel fully visible behind a rounded stage edge,
  // and the giant hero heading must NOT be chopped off-screen.
  const comp = await page.evaluate(() => {
    const stage = document.querySelector("[data-stage]").getBoundingClientRect();
    const panel = document.querySelector("[data-underlay-panel]").getBoundingClientRect();
    const h1 = document.querySelector("h1")?.getBoundingClientRect();
    return {
      stageRight: Math.round(stage.right),
      panelLeft: Math.round(panel.left),
      stageLeft: Math.round(stage.left),
      h1Left: Math.round(h1.left),
      vw: window.innerWidth,
    };
  });
  check(
    "menu: stage composition — panel clear + heading not chopped",
    comp.panelLeft >= comp.stageRight - 2 && comp.h1Left >= 0 && comp.stageLeft > -330,
    JSON.stringify(comp),
  );
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
  await sleep(2000);
  check(
    "menu: route click navigates + closes",
    page.url().includes("/work"),
    `url=${page.url()}`,
  );
}

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(BASE, { waitUntil: "load" });

const waitFor = async (fn, timeout = 6000, interval = 40) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return true;
    await sleep(interval);
  }
  return false;
};

// ---- Timing: loader ~1.3s; full hero entrance ~1.7s after it reveals ----
const tStart = Date.now();
const loaderGone = await waitFor(() =>
  page.evaluate(() => {
    const el = document.querySelector('[class*="z-[60]"]');
    return !!el && getComputedStyle(el).display === "none";
  }),
);
const tLoader = Date.now() - tStart;
check("loader: gone within 1.6s", loaderGone && tLoader <= 1600, `tLoader=${tLoader}ms`);

const heroSettled = await waitFor(() =>
  page.evaluate(() => {
    const lines = [
      ...document.querySelectorAll("[data-hero-line] .split-char"),
      ...document.querySelectorAll("[data-hero-line-single]"),
    ];
    if (!lines.length) return false;
    const cta = document.querySelector("[data-hero-cta]");
    const cue = document.querySelector("[data-hero-cue]");
    return (
      lines.every((el) => parseFloat(getComputedStyle(el).opacity) > 0.9) &&
      parseFloat(getComputedStyle(cta).opacity) > 0.9 &&
      parseFloat(getComputedStyle(cue).opacity) > 0.9
    );
  }),
);
const tHero = Date.now() - tStart - tLoader;
check(
  "hero: entrance complete within 2.2s of loader reveal",
  heroSettled && tHero <= 2200,
  `tHero=${tHero}ms`,
);

check(
  "entry: loader hidden after sequence",
  await page.locator("div.z-\\[60\\]").evaluate((el) => getComputedStyle(el).display === "none"),
);

// ---- ShinyText sweep: rendered-pixel proof the highlight travels ----
// Shine class lands ~2.8s after load; first sweep runs ~3.2s–5.4s
// (band crosses left→right), then a ~3s rest. Samples at ~mid/late sweep
// and in the rest window; the bright (#F4F4EE) band must move, then rest.
const shineSample = async () => {
  const clip = await page.locator("[data-shine]").boundingBox();
  const buf = await page.screenshot({
    clip: { x: Math.round(clip.x), y: Math.round(clip.y), width: Math.round(clip.width), height: Math.round(clip.height) },
  });
  const png = PNG.sync.read(buf);
  let bright = 0;
  let cx = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i];
    const g = png.data[i + 1];
    if (r > 225 && g > 225) {
      bright += 1;
      cx += (i / 4) % png.width;
    }
  }
  return { bright, cx: bright ? Math.round((cx / bright) * 10) / 10 : 0 };
};
await waitFor(() =>
  page.evaluate(() => document.querySelector("[data-shine]")?.classList.contains("shine-active")),
);
await sleep(1150); // ~mid first sweep
const sA = await shineSample();
await sleep(1000); // late first sweep
const sB = await shineSample();
await sleep(1900); // rest window
const sC = await shineSample();
check(
  "shine: bright highlight travels across text then rests",
  sA.bright > 30 && sB.bright > 30 && sC.bright < sA.bright * 0.85 && sB.cx > sA.cx,
  JSON.stringify({ sA, sB, sC }),
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
  // loader (~1.4s) + full hero entrance (~4.1s) + headroom; this must not
  // race the CTA entrance or the fit check flakes under load.
  await sleep(7000);
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
// The active phase word must be FULLY visible — glyph-sized (≥0.7×font),
// inside its mask, not clipped to a sliver, and spelled out completely.
const sigWord = (i) =>
  page.evaluate((idx) => {
    const w = [...document.querySelectorAll("[data-sig-word]")][idx];
    const cs = getComputedStyle(w);
    const fs = parseFloat(cs.fontSize);
    const r = w.getBoundingClientRect();
    const c = w.parentElement.getBoundingClientRect();
    return {
      text: w.textContent.trim(),
      fs: Math.round(fs),
      h: Math.round(r.height),
      w: Math.round(r.width),
      inside: r.top >= c.top - 2 && r.bottom <= c.bottom + 2,
      full: r.height >= fs * 0.7,
      color: cs.color,
    };
  }, i);
const scrollToY = async (y) => {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await sleep(900);
};
const vh = 900;
const sigEnd = sigTop + vh * 3; // pin range = 300% of the viewport
const pct = (p) => sigTop + (sigEnd - sigTop) * p;
await scrollToY(pct(0.02));
const sStart = await sigState();
const wIdea = await sigWord(0);
check(
  "sig: pinned at top + IDEA visible + unclipped",
  sStart.rectTop >= -4 &&
    sStart.rectTop <= 4 &&
    sStart.words[0] === "1.00" &&
    wIdea.text === "IDEA" &&
    wIdea.full &&
    wIdea.inside,
  JSON.stringify({ ...sStart, wIdea }),
);

// Dynamic scan across the pin range: record the dominant word and the
// drawn-path count at each step — no assumptions about absolute timeline
// positions (the crossfades are intentionally compressed).
const scan = [];
for (let p = 0.06; p <= 0.97; p += 0.03) {
  await scrollToY(pct(p));
  const s = await sigState();
  const nums = s.words.map(Number);
  const maxI = nums.indexOf(Math.max(...nums));
  scan.push({ p: Math.round(p * 100), maxI, drawn: s.paths.filter((x) => x === "0px").length });
}
const firstAt = (i) => scan.find((x) => x.maxI === i)?.p ?? -1;
const order = [0, 1, 2, 3].map((i) => firstAt(i));
check(
  "sig: sequence IDEA→FORM→DIGITAL→IMPACT in order",
  order[0] > 0 && order[1] > order[0] && order[2] > order[1] && order[3] > order[2],
  JSON.stringify(order),
);
check(
  "sig: every phase word becomes fully dominant",
  order.every((p) => p > 0),
  JSON.stringify(order),
);
// Every word is complete + unclipped at the moment it dominates.
const healthOk = [];
for (let i = 0; i < 4; i++) {
  const p = firstAt(i);
  if (p < 0) continue;
  await scrollToY(pct(p / 100));
  const w = await sigWord(i);
  healthOk.push({ i, p, ...w });
}
check(
  "sig: each phase word fully visible + unclipped when active",
  healthOk.length === 4 && healthOk.every((w) => w.text.length > 0 && w.full && w.inside),
  JSON.stringify(healthOk),
);
// Final state: all paths drawn, IMPACT lime.
await scrollToY(pct(0.97));
const sHigh = await sigState();
const wImp = await sigWord(3);
check(
  "sig: IMPACT lime + all paths drawn at end",
  sHigh.words[3] === "1.00" && sHigh.paths.every((x) => x === "0px") && wImp.color === "rgb(204, 255, 0)",
  JSON.stringify({ ...sHigh, wImp }),
);
// Reverse: scroll back down — IMPACT must leave, earlier phases return.
await scrollToY(pct(0.15));
const sBack = await sigState();
check(
  "sig: reverse scroll returns toward IDEA/FORM",
  sBack.words[3] !== "1.00" && (sBack.words[0] === "1.00" || sBack.words[1] === "1.00"),
  JSON.stringify(sBack),
);
// No dead scroll: the scene keeps progressing — state changes must be
// frequent AND spread across the range (no long stretch with zero change).
const changedIdx = [];
scan.forEach((x, i) => {
  if (i === 0 || x.maxI !== scan[i - 1].maxI || x.drawn !== scan[i - 1].drawn) changedIdx.push(i);
});
const maxGap = Math.max(...changedIdx.map((v, i) => (i === 0 ? v : v - changedIdx[i - 1])));
check(
  "sig: no dead scroll — continuous progression",
  changedIdx.length >= 8 && maxGap <= 10,
  `changed=${changedIdx.length}/${scan.length} maxGap=${maxGap}`,
);

// Route transitions: real client-side Link clicks across all internal
// routes. Each must land at scrollTop 0 with no overlay stuck above the page.
await page.goto(BASE + "/", { waitUntil: "load" });
await sleep(1500);
const NAV_ROUTES = ["/services", "/work", "/about", "/contact", "/"];
for (const href of NAV_ROUTES) {
  await page.evaluate((h) => {
    const a = [...document.querySelectorAll("a[href]")].find((el) => el.getAttribute("href") === h);
    if (a) a.click();
  }, href);
  await sleep(1500);
  const landed = page.url().endsWith(href === "/" ? "/" : href);
  check(`transition: ${href} navigates`, landed);
  check(
    `transition: ${href} lands at scrollTop 0`,
    await page.evaluate(() => window.scrollY < 2),
    `scrollY=${await page.evaluate(() => window.scrollY)}`,
  );
  check(
    `transition: overlay hidden after ${href}`,
    await page.locator("div.z-\\[50\\]").evaluate((el) => getComputedStyle(el).visibility === "hidden"),
  );
}
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

// /contact — copy correction, validation + honest non-success state
await pp.goto(BASE + "/contact", { waitUntil: "load" });
await sleep(1800);
check(
  "contact: no response-time promise + new next-step copy",
  (await pp.getByText(/Tell us what you're building\. We'll get back to you with a clear next step\./).count()) >
    0 &&
    (await pp.getByText(/one business day/i).count()) === 0,
);
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
