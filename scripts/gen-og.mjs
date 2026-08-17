/**
 * Generates public/og.png (1200×630) — a branded Clay Graphik Open Graph
 * image rendered with the real logo + brand palette via headless Edge.
 * Run once; the PNG is committed so the runtime never needs a browser.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

let browser;
for (const exe of EDGE_CANDIDATES) {
  try {
    browser = await chromium.launch({ executablePath: exe, headless: true });
    break;
  } catch {
    /* next */
  }
}
if (!browser) browser = await chromium.launch({ headless: true });

const logo = fs.readFileSync("public/brand/clay-graphik-logo.png").toString("base64");
const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #050505; font-family: 'Segoe UI', Arial, sans-serif; overflow: hidden; }
  .wrap { position: relative; width: 100%; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; }
  .top { display: flex; align-items: center; gap: 18px; }
  .tag { color: #ccff00; font-size: 20px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600; }
  h1 { color: #f4f4ee; font-size: 78px; line-height: 1.02; letter-spacing: -2px; text-transform: uppercase; font-weight: 600; max-width: 900px; }
  h1 em { color: #ccff00; font-style: normal; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; }
  .foot p { color: #8a8a86; font-size: 22px; letter-spacing: 2px; text-transform: uppercase; }
  .limebar { width: 96px; height: 8px; background: #ccff00; border-radius: 4px; }
  .acc { position: absolute; right: -140px; top: -160px; width: 560px; height: 560px; border-radius: 50%; background: radial-gradient(circle, rgba(204,255,0,0.16) 0%, rgba(204,255,0,0.04) 40%, transparent 70%); }
</style></head><body>
<div class="wrap">
  <div class="acc"></div>
  <div class="top"><img src="data:image/png;base64,${logo}" alt="" style="height:56px;width:auto" /><span class="tag">Independent Creative Studio — Dubai</span></div>
  <h1>Strategic Design.<br />Conversion Focused.<br /><em>Growth Driven.</em></h1>
  <div class="foot"><p>claygraphik.com</p><div class="limebar"></div></div>
</div>
</body></html>`;

const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: "public/og.png", type: "png" });
await browser.close();
console.log("wrote public/og.png");
