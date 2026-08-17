import { chromium } from "playwright-core";
const exe = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const b = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const p = await ctx.newPage();
p.on("console", (m) => { if (["error", "warning"].includes(m.type())) console.log("[console]", m.type(), m.text().slice(0, 300)); });
p.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 500)));
await p.goto("http://localhost:3000", { waitUntil: "load" });
await new Promise(r => setTimeout(r, 4000));
const st = await p.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find((d) => d.classList.contains("z-[60]"));
  const cs = el ? getComputedStyle(el) : null;
  return {
    loaderDisplay: cs?.display,
    h1chars: document.querySelectorAll(".split-char").length,
    h1visible: (() => {
      const c = document.querySelector(".split-char");
      return c ? getComputedStyle(c).opacity : "no-char";
    })(),
    loaderTransform: el ? el.style.transform : null,
  };
});
console.log(JSON.stringify(st, null, 1));
await b.close();
