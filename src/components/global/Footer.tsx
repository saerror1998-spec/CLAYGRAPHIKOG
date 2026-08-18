"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { navigation, site, socials, ctas, waLink } from "@/data/siteContent";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const services = [
  { label: "Strategy & Identity", href: "/services/strategy-identity" },
  { label: "Websites & UX", href: "/services/websites-ux" },
  { label: "Content Systems", href: "/services/content-systems" },
  { label: "Creative Direction", href: "/services/creative-direction" },
] as const;

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const limeLineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const wordmark = wordmarkRef.current;
      if (!root || !wordmark || reduced) return;

      // Vertical reveal + subtle horizontal scroll drift
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 95%",
          end: "bottom 80%",
          scrub: 0.8,
        },
      });

      tl.fromTo(
        wordmark,
        { yPercent: 25, opacity: 0.25, xPercent: -3 },
        { yPercent: 0, opacity: 1, xPercent: 1.5, ease: "none" },
      );

      // Subtle lime accent line reveal under wordmark
      if (limeLineRef.current) {
        gsap.fromTo(
          limeLineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 70%",
              end: "bottom 85%",
              scrub: 0.6,
            },
          },
        );
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <footer
      ref={rootRef}
      className="relative border-t border-white/[0.06] bg-carbon"
    >
      {/* ── TOP INFORMATION AREA ─────────────────────────────── */}
      <div className="px-6 pt-20 pb-16 sm:px-8 lg:px-10 lg:pt-28 lg:pb-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* LEFT — PRIMARY CTA MESSAGE */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="label mb-6 text-softgray/60">{ctas.startProject}</p>
              <h2 className="mb-8 max-w-[520px] text-[clamp(28px,4vw,46px)] font-bold leading-[0.95] tracking-[-0.03em] text-offwhite">
                LET&apos;S
                <br />
                MAKE
                <br />
                SOMETHING
                <br />
                WORTH
                <br />
                NOTICING.
              </h2>
              <p className="mb-10 max-w-[360px] text-[15px] leading-relaxed text-softgray">
                Strategic design, websites and digital creative for ambitious
                businesses and growing brands.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-offwhite transition-colors hover:text-lime"
              >
                START A PROJECT
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <span className="hidden text-offwhite/20 sm:inline">|</span>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-softgray transition-colors hover:text-lime"
              >
                LET&apos;S TALK ON WHATSAPP
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT — NAVIGATION COLUMNS */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-8">
            {/* EXPLORE */}
            <nav aria-label="Footer navigation">
              <h3 className="label mb-5 text-offwhite/50">EXPLORE</h3>
              <ul className="space-y-3">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group/link text-[15px] text-softgray transition-colors hover:text-lime"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* SERVICES */}
            <div>
              <h3 className="label mb-5 text-offwhite/50">SERVICES</h3>
              <ul className="space-y-3">
                {services.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[15px] text-softgray transition-colors hover:text-lime"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONNECT */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="label mb-5 text-offwhite/50">CONNECT</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={socials[3].href}
                    className="text-[15px] text-softgray transition-colors hover:text-lime"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-softgray transition-colors hover:text-lime"
                  >
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={socials[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-softgray transition-colors hover:text-lime"
                  >
                    {site.instagramHandle}
                  </a>
                </li>
                <li>
                  <a
                    href={socials[1].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-softgray transition-colors hover:text-lime"
                  >
                    {site.threadsHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* LOCATION / SERVING metadata */}
        <div className="mt-14 flex gap-12 border-t border-white/[0.06] pt-8 sm:mt-16">
          <div>
            <p className="label mb-1.5 text-offwhite/40">LOCATION</p>
            <p className="text-[13px] text-softgray">{site.location}</p>
          </div>
          <div>
            <p className="label mb-1.5 text-offwhite/40">SERVING</p>
            <p className="text-[13px] text-softgray">{site.serviceArea}</p>
          </div>
        </div>
      </div>

      {/* ── GIANT CLAY GRAPHIK WORDMARK ──────────────────────── */}
      <div className="relative overflow-hidden px-6 sm:px-8 lg:px-10">
        <div
          ref={wordmarkRef}
          className="w-full will-change-transform"
          aria-hidden="true"
        >
          <p
            className="whitespace-nowrap text-offwhite"
            style={{
              fontSize: "clamp(110px, 16vw, 310px)",
              lineHeight: "0.78",
              letterSpacing: "-0.055em",
              fontWeight: 700,
              fontFamily: "var(--font-hanken), sans-serif",
              marginLeft: "-4vw",
            }}
          >
            CLAY GRAPHIK
          </p>
        </div>
        {/* Lime accent line */}
        <div
          ref={limeLineRef}
          className="mt-2 h-[2px] w-full origin-left bg-lime/30"
        />
      </div>

      {/* ── LOWER META ROW ───────────────────────────────────── */}
      <div className="flex flex-col items-start justify-between gap-4 px-6 pb-8 pt-6 sm:px-8 sm:flex-row sm:items-center lg:px-10">
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="text-[11px] uppercase tracking-[0.14em] text-offwhite/40 transition-colors hover:text-offwhite"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[11px] uppercase tracking-[0.14em] text-offwhite/40 transition-colors hover:text-offwhite"
          >
            Terms
          </Link>
        </div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-offwhite/30">
          © 2026 Clay Graphik
        </p>
        <p className="text-[11px] uppercase tracking-[0.14em] text-offwhite/30">
          Dubai, UAE
        </p>
      </div>
    </footer>
  );
}
