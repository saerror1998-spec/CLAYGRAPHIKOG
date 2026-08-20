"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const COLUMNS = [
  {
    index: "01",
    word: "CLARITY",
    copy: "Strategy, positioning and visual direction that make the brand easier to understand and easier to trust.",
  },
  {
    index: "02",
    word: "ACTION",
    copy: "Web and digital experiences designed to guide attention and move people toward meaningful action.",
  },
  {
    index: "03",
    word: "CONSISTENCY",
    copy: "Creative systems that keep every touchpoint recognisable, coherent and easier to scale.",
  },
];

/**
 * 02 / BUILT FOR OUTCOMES — 3-column editorial grid
 */
export default function HomeOutcomes() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reducedNow =
        reduced ||
        (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      if (reducedNow) return;

      // --- Section entrance: masked heading ---
      const label = root.querySelector("[data-out-label]");
      const headlineLines = Array.from(
        root.querySelectorAll<HTMLElement>("[data-out-headline-line]"),
      );
      const supportLines = Array.from(
        root.querySelectorAll<HTMLElement>("[data-out-support-line]"),
      );

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          end: "top 45%",
          scrub: 0.8,
        },
      });

      if (label) {
        gsap.set(label, { opacity: 0, y: 16 });
        entranceTl.to(label, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0);
      }

      headlineLines.forEach((line, i) => {
        gsap.set(line, { yPercent: 105 });
        entranceTl.to(line, { yPercent: 0, duration: 0.45, ease: "none" }, 0.03 + i * 0.1);
      });

      supportLines.forEach((line, i) => {
        gsap.set(line, { yPercent: 105 });
        entranceTl.to(line, { yPercent: 0, duration: 0.4, ease: "none" }, 0.25 + i * 0.08);
      });

      // --- Grid reveal ---
      const grid = root.querySelector<HTMLElement>("[data-out-grid]");
      const topBorder = root.querySelector<HTMLElement>("[data-out-top-border]");
      const vertDividers = Array.from(
        root.querySelectorAll<HTMLElement>("[data-out-vert-divider]"),
      );
      const bottomBorder = root.querySelector<HTMLElement>("[data-out-bottom-border]");
      const cols = Array.from(
        root.querySelectorAll<HTMLElement>("[data-out-col]"),
      );

      const gridTl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          end: "top 40%",
          scrub: 0.6,
        },
      });

      if (topBorder) {
        gsap.set(topBorder, { scaleX: 0, transformOrigin: "left" });
        gridTl.to(topBorder, { scaleX: 1, duration: 0.3, ease: "none" }, 0);
      }

      vertDividers.forEach((d) => {
        gsap.set(d, { scaleY: 0, transformOrigin: "top" });
        gridTl.to(d, { scaleY: 1, duration: 0.4, ease: "none" }, 0.1);
      });

      if (bottomBorder) {
        gsap.set(bottomBorder, { scaleX: 0, transformOrigin: "left" });
        gridTl.to(bottomBorder, { scaleX: 1, duration: 0.3, ease: "none" }, 0.35);
      }

      cols.forEach((col, i) => {
        const idx = col.querySelector<HTMLElement>("[data-out-col-index]");
        const word = col.querySelector<HTMLElement>("[data-out-col-word]");
        const copy = col.querySelector<HTMLElement>("[data-out-col-copy]");
        const line = col.querySelector<HTMLElement>("[data-out-col-line]");

        const stagger = i * 0.12;

        if (idx) {
          gsap.set(idx, { yPercent: 105 });
          gridTl.to(idx, { yPercent: 0, duration: 0.35, ease: "none" }, 0.15 + stagger);
        }
        if (word) {
          gsap.set(word, { yPercent: 105 });
          gridTl.to(word, { yPercent: 0, duration: 0.4, ease: "none" }, 0.18 + stagger);
        }
        if (copy) {
          gsap.set(copy, { opacity: 0, y: 20 });
          gridTl.to(copy, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.25 + stagger);
        }
        if (line) {
          gsap.set(line, { scaleX: 0, transformOrigin: "left" });
          gridTl.to(line, { scaleX: 1, duration: 0.25, ease: "none" }, 0.2 + stagger);
        }
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="relative bg-offwhite px-6 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      {/* Section label */}
      <p
        data-out-label
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50"
      >
        <span className="text-lime">02</span>{" "}
        <span>/ BUILT FOR OUTCOMES</span>
      </p>

      {/* Main statement */}
      <div className="mt-10 max-w-4xl">
        <div className="overflow-hidden">
          <h2
            data-out-headline-line
            className="text-[clamp(2rem,4.5vw,3.8rem)] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-[#050505]"
          >
            DESIGN SHOULD DO
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2
            data-out-headline-line
            className="text-[clamp(2rem,4.5vw,3.8rem)] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-[#050505]"
          >
            MORE THAN LOOK GOOD.
          </h2>
        </div>
      </div>

      <div className="mt-6 max-w-3xl">
        <div className="overflow-hidden">
          <p
            data-out-support-line
            className="text-base leading-relaxed text-[#050505]/55 sm:text-lg"
          >
            IT SHOULD CREATE CLARITY, ACTION
          </p>
        </div>
        <div className="overflow-hidden">
          <p
            data-out-support-line
            className="text-base leading-relaxed text-[#050505]/55 sm:text-lg"
          >
            AND CONSISTENCY.
          </p>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div data-out-grid className="mt-16">
        {/* Top border */}
        <div
          data-out-top-border
          className="h-px bg-[#050505]/12"
        />

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {COLUMNS.map((col, i) => (
            <div
              key={col.index}
              data-out-col
              className="relative flex flex-col py-10 md:py-14"
            >
              {/* Vertical divider (not on first column) */}
              {i > 0 && (
                <div
                  data-out-vert-divider
                  className="absolute left-0 top-0 bottom-0 w-px bg-[#050505]/12"
                />
              )}

              <p
                data-out-col-index
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime"
              >
                {col.index}
              </p>

              <h3
                data-out-col-word
                className="mt-5 text-[clamp(1.6rem,3vw,2.6rem)] font-bold uppercase tracking-[-0.02em] text-[#050505]"
              >
                {col.word}
              </h3>

              {/* Accent line */}
              <div
                data-out-col-line
                className="mt-5 h-px w-10 bg-lime"
              />

              <p
                data-out-col-copy
                className="mt-5 max-w-xs text-sm leading-relaxed text-[#050505]/55"
              >
                {col.copy}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom border */}
        <div
          data-out-bottom-border
          className="h-px bg-[#050505]/12"
        />
      </div>
    </section>
  );
}
