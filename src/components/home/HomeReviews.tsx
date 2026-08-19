"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * 06 / WHAT CLIENTS VALUE — horizontal scroll stage with GSAP pin.
 * Desktop: GSAP pin + scrub drives horizontal card track movement.
 * Travel calculated from last card bounding rect, NOT track.scrollWidth.
 * Track animates ONLY X. Cards animate ONLY opacity.
 * Mobile: vertical card stack, no pin.
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
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!root || !stage || !track) return;

      const reducedNow =
        reduced ||
        (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);

      // --- Section entrance ---
      const label = root.querySelector("[data-rev-label]");
      const headline = root.querySelector<HTMLElement>("[data-rev-headline]");

      if (!reducedNow) {
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.6,
          },
        });

        if (label) {
          gsap.set(label, { opacity: 0, y: 14 });
          entranceTl.to(label, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0);
        }
        if (headline) {
          gsap.set(headline, { yPercent: 105 });
          entranceTl.to(headline, { yPercent: 0, duration: 0.4, ease: "none" }, 0.08);
        }
      }

      // --- Mobile: staggered vertical entrance ---
      if (reducedNow || window.innerWidth < 1024) {
        const mobileCards = Array.from(
          root.querySelectorAll<HTMLElement>("[data-rev-mobile-card]"),
        );
        mobileCards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none",
              },
              delay: i * 0.08,
            },
          );
        });
        return;
      }

      // --- Desktop: GSAP pin + horizontal scrub ---
      // Calculate travel from LAST CARD position, not track.scrollWidth.
      // This ensures the last card remains visible at the stage's right edge.

      // Reset track position to get accurate measurements
      gsap.set(track, { x: 0 });

      const desktopCards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-rev-card]"),
      );
      if (desktopCards.length === 0) return;

      const lastCard = desktopCards[desktopCards.length - 1];
      const stageRect = stage.getBoundingClientRect();
      const lastCardRect = lastCard.getBoundingClientRect();

      // Travel = distance to bring last card's right edge to stage's right edge minus padding
      const sectionPadding = 40; // matches px-10 on lg
      const travel = Math.max(
        0,
        lastCardRect.right - stageRect.right + sectionPadding,
      );

      if (travel <= 0) return;

      // Pin the stage. End = exact travel distance.
      const horizontalTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 10%",
          end: () => `+=${travel}`,
          pin: stage,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Track moves ONLY on X
      horizontalTl.to(track, {
        x: -travel,
        ease: "none",
      });

      // Card opacity reveals — NO y transform
      desktopCards.forEach((card, i) => {
        gsap.set(card, { opacity: 0 });
        horizontalTl.to(
          card,
          { opacity: 1, duration: 0.2, ease: "none" },
          i * 0.1,
        );
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="bg-offwhite px-6 py-24 sm:px-8 lg:px-10 lg:py-36"
    >
      <p
        data-rev-label
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50"
      >
        06 / WHAT CLIENTS VALUE
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

      {/* Desktop: pinned horizontal scroll stage */}
      <div
        ref={stageRef}
        className="relative mt-16 hidden min-h-[60vh] items-center overflow-hidden lg:flex"
      >
        <div
          ref={trackRef}
          className="flex gap-6"
          style={{ width: "max-content" }}
        >
          {VALUES.map((val) => (
            <article
              key={val.title}
              data-rev-card
              className="group shrink-0 w-[360px] rounded-2xl border border-[#050505]/8 bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
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
      </div>

      {/* Mobile: vertical card layout */}
      <div className="mt-16 grid grid-cols-1 gap-6 lg:hidden">
        {VALUES.map((val) => (
          <article
            key={`mobile-${val.title}`}
            data-rev-mobile-card
            className="rounded-2xl border border-[#050505]/8 bg-white p-8"
          >
            <div className="mb-4 h-1 w-8 rounded-full bg-[#CCFF00]" />
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
