# AGENTS.md — Clay Graphik Project Learnings

## Project Architecture

- **Framework:** Next.js 15.5.23 + Tailwind v4 + GSAP + Lenis + OGL (Aurora shader)
- **Motion stack:** Aurora (canvas shader) + SplitText + ShinyText + SignatureScroll + UnderlayMenu + BorderGlow + MagicBento — all GSAP-based, no ScrollSmoother, single Lenis instance
- **Contact form:** No backend — validates locally, builds a prefilled WhatsApp message, and opens `wa.me/971523412447?text=...` via `window.open` with same-tab fallback if popup blocked
- **Central data:** `src/data/siteContent.ts` is the single source of truth for all contact info, socials, CTAs, SEO, FAQs, and JSON-LD. All components consume it.

## Dev Server / Preview

- **Default port:** 3000 (`npm run dev`), but Next.js auto-increments if 3000 is transiently held — on this session it started on 4914
- **Detached start (Windows):** `powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"` — stdout and stderr MUST go to different files or PowerShell fails
- **`register_preview` tool** may have an empty parameter schema in some sessions — if it cannot accept `url`/`pid`, the server may still be running but unregistered in the Preview tab. Verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/`

## Build & QA

- **Production build:** `npm run build` — produces ~21 static pages; `/contact` is dynamic (searchParams for prefill)
- **QA suite:** `node scripts/qa.mjs` — headless Chromium checks (~92 assertions including WhatsApp popup verification, link resolution, SEO metadata, console errors)
- **Link checker:** `node scripts/dbg-links.mjs` — verifies all internal hrefs resolve (was deleted after use; recreate if needed)
- **Loader timeline:** trimmed to ~1.05s so total page-entry stays ≤1.5s including hydration

## Content Rules

- **No fabricated metrics** — exclude 250+/98%/3.2x/42.1k/$84k/38%/5x anywhere in src
- **No fabricated testimonials** — exclude Maya Chen, Daniel Ortiz, Aisha Bello, etc.
- **All projects labeled STUDIO CONCEPT** unless real client data is verified
- **No fake "Message Sent"** — WhatsApp handoff means the user sends the message themselves
- **Contact form validation:** requires name, email OR phone, service, and details before opening WhatsApp

## Git

- **Repo:** https://github.com/saerror1998-spec/CLAYGRAPHIKOG.git
- **Branch:** `main` (renamed from `master`)
- **references/ directory must never be modified or deleted** — contains approved design references and brand assets

## Contact Details (Canonical)

- Email: connects@claygraphik.com (NOT connect@)
- Phone: +971523412447
- WhatsApp: 971523412447 (no + prefix in wa.me URLs)
- Instagram: https://www.instagram.com/claygraphik/
- Threads: https://www.threads.com/@claygraphik
- Location: Dubai, UAE
