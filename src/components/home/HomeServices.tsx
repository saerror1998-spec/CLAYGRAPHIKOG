"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { services } from "@/data/services";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const SERVICE_IMAGES: Record<string, string> = {
  "strategy-identity": "/images/home/home-service-strategy.jpg",
  "websites-ux": "/images/home/home-service-web.jpg",
  "content-systems": "/images/home/home-service-content.jpg",
  "creative-direction": "/images/home/home-service-creative.jpg",
};

const SERVICE_WORDS = ["STRATEGY", "IDENTITY", "WEB", "CONTENT", "CREATIVE"];

/**
 * 02 / SERVICES — sticky category stage with visible handoffs.
 *
 * Structure:
 *  - Section header (masked heading)
 *  - Category stage (position:sticky) — user scrolls through 5 word handoffs
 *  - Service detail rows
 *
 * The category stage pins for ~120vh, during which each word becomes
 * the active dominant word one at a time.
 */
export default function HomeServices() {
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
      const label = root.querySelector("[data-svc-label]");
      const headlineLines = Array.from(
        root.querySelectorAll<HTMLElement>("[data-svc-headline-line]"),
      );
      const supportText = root.querySelector("[data-svc-support]");

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          end: "top 50%",
          scrub: 0.8,
        },
      });

      if (label) {
        gsap.set(label, { opacity: 0, y: 16 });
        entranceTl.to(label, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, 0);
      }

      headlineLines.forEach((line, i) => {
        gsap.set(line, { yPercent: 105 });
        entranceTl.to(line, { yPercent: 0, duration: 0.5, ease: "none" }, 0.05 + i * 0.12);
      });

      if (supportText) {
        gsap.set(supportText, { opacity: 0, y: 16 });
        entranceTl.to(supportText, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, 0.4);
      }

      // --- Category stage: sticky with controlled scroll progression ---
      const catStage = root.querySelector<HTMLElement>("[data-svc-cat-stage]");
      const categoryWords = Array.from(
        root.querySelectorAll<HTMLElement>("[data-svc-word]"),
      );

      if (catStage && categoryWords.length) {
        // Pin the category stage for a controlled scroll journey
        ScrollTrigger.create({
          trigger: catStage,
          start: "top 15%",
          end: () => `+=${window.innerHeight * 1.2}`,
          pin: true,
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            // Map 0-1 to 0-4 index, with each word getting ~20% of the journey
            const activeIdx = Math.min(
              Math.floor(progress * categoryWords.length),
              categoryWords.length - 1,
            );

            categoryWords.forEach((w, i) => {
              if (i === activeIdx) {
                gsap.to(w, {
                  opacity: 1,
                  color: "#050505",
                  y: 0,
                  duration: 0.3,
                  ease: "power2.out",
                  overwrite: "auto",
                });
                w.classList.add("text-lime");
              } else {
                gsap.to(w, {
                  opacity: 0.2,
                  color: "#b9b9b3",
                  y: i < activeIdx ? -8 : 8,
                  duration: 0.3,
                  ease: "power2.out",
                  overwrite: "auto",
                });
                w.classList.remove("text-lime");
              }
            });
          },
        });
      }

      // --- Service detail rows ---
      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-svc-row]"));
      rows.forEach((row) => {
        const divider = row.querySelector<HTMLElement>("[data-svc-row-divider]");
        const rowLabel = row.querySelector("[data-svc-row-label]");
        const title = row.querySelector<HTMLElement>("[data-svc-row-title]");
        const desc = row.querySelector("[data-svc-row-desc]");
        const tags = row.querySelector("[data-svc-row-tags]");
        const link = row.querySelector("[data-svc-row-link]");
        const imageWrap = row.querySelector<HTMLElement>("[data-svc-row-image]");

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            end: "top 40%",
            scrub: 0.6,
          },
        });

        if (divider) {
          gsap.set(divider, { scaleX: 0, transformOrigin: "left" });
          rowTl.to(divider, { scaleX: 1, duration: 0.25, ease: "none" }, 0);
        }
        if (rowLabel) {
          gsap.set(rowLabel, { opacity: 0, y: 12 });
          rowTl.to(rowLabel, { opacity: 1, y: 0, duration: 0.2, ease: "none" }, 0.05);
        }
        if (title) {
          gsap.set(title, { yPercent: 105 });
          rowTl.to(title, { yPercent: 0, duration: 0.35, ease: "none" }, 0.08);
        }
        if (desc) {
          gsap.set(desc, { opacity: 0, y: 12 });
          rowTl.to(desc, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.15);
        }
        if (tags) {
          gsap.set(tags, { opacity: 0, y: 8 });
          rowTl.to(tags, { opacity: 1, y: 0, duration: 0.2, ease: "none" }, 0.2);
        }
        if (link) {
          gsap.set(link, { opacity: 0 });
          rowTl.to(link, { opacity: 1, duration: 0.15, ease: "none" }, 0.25);
        }
        if (imageWrap) {
          gsap.set(imageWrap, {
            clipPath: "inset(100% 0 0 0)",
            scale: 1.06,
          });
          rowTl.to(
            imageWrap,
            { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.4, ease: "none" },
            0.1,
          );
        }
      });
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
        data-svc-label
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50"
      >
        02 / WHAT WE DO
      </p>

      {/* Headline — each line wrapped for mask reveal */}
      <div className="mt-8 max-w-3xl">
        <div className="overflow-hidden">
          <h2 data-svc-headline-line className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold uppercase leading-[1.04] tracking-[-0.02em] text-[#050505]">
            DESIGN SYSTEMS
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 data-svc-headline-line className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold uppercase leading-[1.04] tracking-[-0.02em] text-[#050505]">
            BUILT TO MOVE
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 data-svc-headline-line className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold uppercase leading-[1.04] tracking-[-0.02em] text-[#050505]">
            BUSINESS.
          </h2>
        </div>
      </div>

      <p
        data-svc-support
        className="mt-8 max-w-xl text-base leading-relaxed text-[#050505]/60 sm:text-lg"
      >
        Clay Graphik combines strategy, identity, websites and digital creative
        into connected systems built for clarity, credibility and growth.
      </p>

      {/* Category stage — sticky with scroll-driven word progression */}
      <div
        data-svc-cat-stage
        className="mt-16 flex flex-wrap items-center justify-start gap-x-8 gap-y-3 lg:gap-x-12"
      >
        {SERVICE_WORDS.map((word) => (
          <span
            key={word}
            data-svc-word
            className="text-[clamp(2rem,5vw,4.5rem)] font-semibold uppercase tracking-[-0.03em] text-[#050505]/15 will-change-transform"
          >
            {word}
          </span>
        ))}
      </div>

      {/* Service detail rows */}
      <div className="mt-24">
        {services.map((service) => (
          <article key={service.slug} data-svc-row className="group">
            <div data-svc-row-divider className="h-px bg-[#050505]/10" />

            <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-12 lg:items-start lg:gap-12 lg:py-16">
              <div className="lg:col-span-4">
                <p data-svc-row-label className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#CCFF00]">
                  {service.number}
                </p>
                <div className="mt-3 overflow-hidden">
                  <h3 data-svc-row-title className="text-[clamp(1.5rem,3vw,2.4rem)] font-semibold uppercase tracking-tight text-[#050505]">
                    {service.title}
                  </h3>
                </div>
              </div>

              <div className="lg:col-span-5">
                <p data-svc-row-desc className="text-base leading-relaxed text-[#050505]/60">
                  {service.description}
                </p>
                <ul data-svc-row-tags className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {service.capabilities.slice(0, 4).map((cap) => (
                    <li key={cap} className="rounded-full border border-[#050505]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#050505]/50">
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3">
                <div data-svc-row-image className="aspect-[4/3] overflow-hidden rounded-xl bg-[#050505]/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SERVICE_IMAGES[service.slug] || ""}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  data-svc-row-link
                  className="group/link mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#050505] transition-colors hover:text-[#CCFF00]"
                >
                  VIEW SERVICE
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
