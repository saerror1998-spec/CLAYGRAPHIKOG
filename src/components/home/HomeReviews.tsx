"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * 07 / WHAT CLIENTS VALUE — 3×2 grid, no pin, no horizontal scroll.
 * Heading + 6 value cards. Restrained GSAP entry. Natural content height.
 */

const VALUES = [
  {
    title: "Clear Communication",
    copy: "Straightforward process, no jargon, clear timelines and honest direction from start to finish.",
  },
  {
    title: "Strategic Thinking",
    copy: "Every design decision rooted in the business objective — not trends, not decoration.",
  },
  {
    title: "Consistent Execution",
    copy: "Systems that stay on-brand across every channel, every post, every touchpoint.",
  },
  {
    title: "Practical Design Systems",
    copy: "Repeatable frameworks that make it easy for teams to produce on-brand work independently.",
  },
  {
    title: "Visual Identity",
    copy: "From first impression to every touchpoint — a brand that looks as credible as it performs.",
  },
  {
    title: "Digital Excellence",
    copy: "Websites that don't just look right — they convert, scale and build trust.",
  },
];

export default function HomeReviews() {
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

      const label = root.querySelector<HTMLElement>("[data-rev-label]");
      const headline = root.querySelector<HTMLElement>("[data-rev-headline]");
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-rev-card]"));
      const topLine = root.querySelector<HTMLElement>("[data-rev-topline]");

      if (reducedNow) {
        // Just make everything visible
        [label, headline, topLine, ...cards].forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0, yPercent: 0 });
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          end: "top 30%",
          scrub: 0.6,
        },
      });

      if (label) {
        gsap.set(label, { opacity: 0, y: 14 });
        tl.to(label, { opacity: 1, y: 0, duration: 0.2, ease: "none" }, 0);
      }
      if (headline) {
        gsap.set(headline, { yPercent: 105 });
        tl.to(headline, { yPercent: 0, duration: 0.35, ease: "none" }, 0.05);
      }
      if (topLine) {
        gsap.set(topLine, { scaleX: 0, transformOrigin: "left" });
        tl.to(topLine, { scaleX: 1, duration: 0.3, ease: "none" }, 0.15);
      }

      // Card stagger
      cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 24 });
        tl.to(
          card,
          { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" },
          0.12 + i * 0.04,
        );
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="bg-offwhite px-6 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      <p
        data-rev-label
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50"
      >
        07 / WHAT CLIENTS VALUE
      </p>

      <div className="overflow-hidden">
        <h2
          data-rev-headline
          className="mt-8 max-w-2xl text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold uppercase leading-[1.04] tracking-[-0.02em] text-[#050505]"
        >
          BUILT ON
          <br />
          <span className="text-[#CCFF00]">TRUST.</span>
        </h2>
      </div>

      {/* Lime micro-line divider */}
      <div
        data-rev-topline
        className="mt-10 h-px w-16 bg-[#CCFF00]/40 lg:mt-14"
      />

      {/* 3×2 grid — desktop and tablet */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {VALUES.map((val) => (
          <article
            key={val.title}
            data-rev-card
            className="group rounded-2xl border border-[#050505]/8 bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="mb-4 h-1 w-8 rounded-full bg-[#CCFF00] transition-all duration-300 group-hover:w-12" />
            <h3 className="text-xl font-semibold uppercase tracking-tight text-[#050505]">
              {val.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[#050505]/55">
              {val.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
