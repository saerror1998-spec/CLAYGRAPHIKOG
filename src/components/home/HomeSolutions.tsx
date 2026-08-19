"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { services } from "@/data/services";

const SOLUTION_IMAGES: Record<string, string> = {
  "strategy-identity": "/images/home/home-solution-brand.jpg",
  "websites-ux": "/images/home/home-solution-web.jpg",
  "content-systems": "/images/home/home-service-content.jpg",
  "creative-direction": "/images/home/home-solution-creative.jpg",
};

const SOLUTIONS = [
  {
    number: "01",
    title: "BRAND CLARITY",
    tags: ["Strategy", "Identity", "Positioning"],
    copy: "A brand system built to be understood instantly — positioning, identity and messaging that makes businesses easier to choose.",
    serviceSlug: "strategy-identity",
  },
  {
    number: "02",
    title: "HIGH-PERFORMING WEBSITES",
    tags: ["Design", "UX", "Development"],
    copy: "Websites designed for clarity, credibility and conversion — every section earns its place and guides visitors toward action.",
    serviceSlug: "websites-ux",
  },
  {
    number: "03",
    title: "CONTENT CONSISTENCY",
    tags: ["Templates", "Campaigns", "Systems"],
    copy: "Repeatable content systems that keep brands visible and consistent across every post, campaign and channel.",
    serviceSlug: "content-systems",
  },
  {
    number: "04",
    title: "CREATIVE SYSTEMS",
    tags: ["Direction", "Products", "Launch"],
    copy: "Creative direction that extends the brand into practical assets — presentations, digital products, launch campaigns and more.",
    serviceSlug: "creative-direction",
  },
];

/**
 * 05 / SOLUTIONS — reference-style motion:
 * - Masked SOLUTIONS heading + outlined FOR GROWTH with offset
 * - Progressive row reveal with divider draws
 * - Image clip reveals with scale
 * - Rows enter sequentially via scroll progress
 */
export default function HomeSolutions() {
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

      // --- Section entrance ---
      const solidLine = root.querySelector<HTMLElement>("[data-sol-solid]");
      const outlineLine = root.querySelector<HTMLElement>("[data-sol-outline]");
      const label = root.querySelector("[data-sol-label]");
      const accent = root.querySelector("[data-sol-accent]");

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.7,
        },
      });

      if (label) {
        gsap.set(label, { opacity: 0, y: 14 });
        entranceTl.to(label, { opacity: 1, y: 0, duration: 0.2, ease: "none" }, 0);
      }

      // SOLUTIONS — masked reveal from below
      if (solidLine) {
        // solidLine is inside overflow:hidden parent
        gsap.set(solidLine, { yPercent: 105 });
        entranceTl.to(solidLine, { yPercent: 0, duration: 0.4, ease: "none" }, 0.05);
      }

      // FOR GROWTH — outlined, enters with xPercent offset
      if (outlineLine) {
        gsap.set(outlineLine, { opacity: 0, xPercent: -8 });
        entranceTl.to(
          outlineLine,
          { opacity: 1, xPercent: 0, duration: 0.35, ease: "none" },
          0.15,
        );
      }

      if (accent) {
        gsap.set(accent, { opacity: 0, scale: 0 });
        entranceTl.to(
          accent,
          { opacity: 1, scale: 1, duration: 0.2, ease: "none" },
          0.25,
        );
      }

      // --- Solution rows: ONE COORDINATED ACTIVE STAGE ---
      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-sol-row]"));
      if (rows.length) {
        // Initialize all rows as inactive (subdued)
        rows.forEach((row) => {
          const title = row.querySelector<HTMLElement>("[data-sol-title]");
          const copy = row.querySelector<HTMLElement>("[data-sol-copy]");
          const tags = row.querySelector<HTMLElement>("[data-sol-tags]");
          const image = row.querySelector<HTMLElement>("[data-sol-image]");
          const arrow = row.querySelector<HTMLElement>("[data-sol-arrow]");
          if (title) gsap.set(title, { yPercent: 105 });
          if (copy) gsap.set(copy, { opacity: 0.35 });
          if (tags) gsap.set(tags, { opacity: 0 });
          if (image) gsap.set(image, { clipPath: "inset(100% 0 0 0)", scale: 1.04, opacity: 0.5 });
          if (arrow) gsap.set(arrow, { opacity: 0 });
        });

        // Single ScrollTrigger on the rows container
        const rowsContainer = rows[0]?.parentElement;
        if (rowsContainer) {
          ScrollTrigger.create({
            trigger: rowsContainer,
            start: "top 80%",
            end: "bottom 50%",
            scrub: 0.6,
            onUpdate: (self) => {
              const progress = self.progress;
              const activeIdx = Math.min(
                Math.floor(progress * rows.length),
                rows.length - 1,
              );

              rows.forEach((row, i) => {
                const isActive = i === activeIdx;
                const title = row.querySelector<HTMLElement>("[data-sol-title]");
                const copy = row.querySelector<HTMLElement>("[data-sol-copy]");
                const tags = row.querySelector<HTMLElement>("[data-sol-tags]");
                const image = row.querySelector<HTMLElement>("[data-sol-image]");
                const arrow = row.querySelector<HTMLElement>("[data-sol-arrow]");
                const divider = row.querySelector<HTMLElement>("[data-sol-divider]");
                const num = row.querySelector<HTMLElement>("[data-sol-num]");

                if (isActive) {
                  // ACTIVE: full visibility
                  if (title) gsap.to(title, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
                  if (copy) gsap.to(copy, { opacity: 1, duration: 0.4, overwrite: "auto" });
                  if (tags) gsap.to(tags, { opacity: 1, duration: 0.3, overwrite: "auto" });
                  if (image) gsap.to(image, { clipPath: "inset(0% 0 0 0)", scale: 1, opacity: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
                  if (arrow) gsap.to(arrow, { opacity: 1, duration: 0.3, overwrite: "auto" });
                  if (divider) gsap.set(divider, { scaleX: 1, transformOrigin: "left" });
                  if (num) gsap.to(num, { opacity: 1, x: 0, duration: 0.3, overwrite: "auto" });
                } else if (i < activeIdx) {
                  // PREVIOUS: slightly subdued but visible
                  if (title) gsap.to(title, { yPercent: 0, opacity: 0.45, duration: 0.5, overwrite: "auto" });
                  if (copy) gsap.to(copy, { opacity: 0.35, duration: 0.4, overwrite: "auto" });
                  if (tags) gsap.to(tags, { opacity: 0.3, duration: 0.3, overwrite: "auto" });
                  if (image) gsap.to(image, { clipPath: "inset(0% 0 0 0)", scale: 1, opacity: 0.35, duration: 0.5, overwrite: "auto" });
                  if (arrow) gsap.to(arrow, { opacity: 0, duration: 0.2, overwrite: "auto" });
                  if (divider) gsap.set(divider, { scaleX: 1, transformOrigin: "left" });
                  if (num) gsap.to(num, { opacity: 0.5, x: 0, duration: 0.3, overwrite: "auto" });
                } else {
                  // FUTURE: hidden
                  if (title) gsap.to(title, { yPercent: 105, opacity: 1, duration: 0.5, overwrite: "auto" });
                  if (copy) gsap.to(copy, { opacity: 0, duration: 0.3, overwrite: "auto" });
                  if (tags) gsap.to(tags, { opacity: 0, duration: 0.3, overwrite: "auto" });
                  if (image) gsap.to(image, { clipPath: "inset(100% 0 0 0)", scale: 1.04, opacity: 0, duration: 0.5, overwrite: "auto" });
                  if (arrow) gsap.to(arrow, { opacity: 0, duration: 0.2, overwrite: "auto" });
                  if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: "left" });
                  if (num) gsap.to(num, { opacity: 0, x: -8, duration: 0.3, overwrite: "auto" });
                }
              });
            },
          });
        }
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="bg-offwhite px-6 py-24 sm:px-8 lg:px-10 lg:py-36"
    >
      {/* Section label */}
      <p
        data-sol-label
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50"
      >
        05 / SOLUTIONS
      </p>

      {/* Heading */}
      <div className="mt-8">
        <div className="overflow-hidden">
          <span
            data-sol-solid
            className="block text-[clamp(2.4rem,6.5vw,5.2rem)] font-semibold uppercase leading-[1.0] tracking-[-0.03em] text-[#050505]"
          >
            SOLUTIONS
          </span>
        </div>
        <span
          data-sol-outline
          className="mt-2 block text-[clamp(2.4rem,6.5vw,5.2rem)] font-semibold uppercase leading-[1.0] tracking-[-0.03em] text-transparent"
          style={{
            WebkitTextStroke: "1.5px rgba(5,5,5,0.25)",
          }}
        >
          FOR GROWTH
        </span>
      </div>

      {/* Lime accent dot */}
      <div data-sol-accent className="mt-6 h-2 w-2 rounded-full bg-[#CCFF00]" />

      {/* Solution rows */}
      <div className="mt-20">
        {SOLUTIONS.map((sol) => {
          const svc = services.find((s) => s.slug === sol.serviceSlug);
          const imageSrc = SOLUTION_IMAGES[sol.serviceSlug] || "";

          return (
            <article key={sol.title} data-sol-row className="group">
              <div data-sol-divider className="h-px bg-[#050505]/10" />

              <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-12 lg:items-start lg:gap-12 lg:py-16">
                {/* Left: number + title + tags */}
                <div className="lg:col-span-4">
                  <p data-sol-num className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#CCFF00]">
                    {sol.number}
                  </p>
                  <div className="mt-3 overflow-hidden">
                    <h3
                      data-sol-title
                      className="text-[clamp(1.4rem,2.8vw,2.2rem)] font-semibold uppercase tracking-tight text-[#050505] transition-transform duration-300 group-hover:translate-x-1"
                    >
                      {sol.title}
                    </h3>
                  </div>
                  <ul data-sol-tags className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                    {sol.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-[#050505]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#050505]/50"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Middle: copy */}
                <div className="lg:col-span-5">
                  <p data-sol-copy className="text-base leading-relaxed text-[#050505]/60">
                    {sol.copy}
                  </p>
                </div>

                {/* Right: image + arrow */}
                <div className="lg:col-span-3">
                  {imageSrc && (
                    <div data-sol-image className="aspect-[4/3] overflow-hidden rounded-xl bg-[#050505]/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageSrc}
                        alt={sol.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    data-sol-arrow
                    className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#050505] transition-colors hover:text-[#CCFF00]"
                  >
                    EXPLORE
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
