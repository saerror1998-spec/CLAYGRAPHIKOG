"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import Aurora from "@/components/motion/Aurora";
import ShinyText from "@/components/motion/ShinyText";
import { useSite } from "@/components/global/site-context";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * 00 / HERO — one master GSAP timeline drives the whole entrance
 * (no ScrollTrigger — the hero is already visible). WE DESIGN and
 * DIGITAL IDENTITIES use real GSAP SplitText character reveals inside
 * overflow-hidden line masks; THAT MOVE. enters as a line and carries
 * the CSS ShinyText sweep.
 *
 * Safe fallback: nothing is hidden via CSS — all hidden states are applied
 * by GSAP at runtime, so a failure (or reduced motion) leaves every word
 * visible.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const { entryDone, lenis } = useSite();
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Reduced motion: leave everything visible, skip the sequence.
      if (reduced || !entryDone) return;

      const h1 = root.querySelector("h1");
      let split: SplitText | null = null;
      if (h1) {
        try {
          split = new SplitText(h1, {
            type: "chars",
            charsClass: "split-char",
            reduceWhiteSpace: false,
          });
        } catch {
          split = null;
        }
      }

      const lineEls = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-line]"));
      const lineGroups = lineEls.map((line) =>
        Array.from(line.querySelectorAll<HTMLElement>(".split-char")),
      );
      const singleLine = root.querySelector<HTMLElement>("[data-hero-line-single]");

      const eyebrow = root.querySelector("[data-hero-eyebrow]");
      const support = root.querySelector("[data-hero-support]");
      const cta = root.querySelector("[data-hero-cta]");
      const cue = root.querySelector("[data-hero-cue]");

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 01 eyebrow
      tl.fromTo(
        eyebrow,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0,
      );

      // 02 / 03 — white lines, char stagger inside clipping masks
      lineGroups.forEach((chars, i) => {
        const targets = chars.length ? chars : (lineEls[i] as unknown as HTMLElement[]);
        tl.fromTo(
          targets,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.03,
          },
          0.15 + i * 1.05,
        );
      });

      // 04 — THAT MOVE. (lime, shine handled by CSS after entrance)
      tl.fromTo(
        singleLine,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9 },
        lineGroups.length ? 0.15 + lineGroups.length * 1.05 : 2.4,
      );

      // 05 support copy
      tl.fromTo(
        support,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        3.3,
      );

      // 06 CTA
      tl.fromTo(
        cta,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        3.65,
      );

      // 07 scroll cue
      tl.fromTo(cue, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 3.95);

      // 08 shine sweep — starts only after the entrance completes
      tl.add(() => {
        root.querySelector("[data-shine]")?.classList.add("shine-active");
      }, 4.05);

      return () => {
        split?.revert();
      };
    },
    { scope: rootRef, dependencies: [entryDone, reduced] },
  );

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("work");
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[calc(100svh-24px)] flex-col overflow-hidden px-6 pb-10 pt-2 sm:min-h-[calc(100svh-32px)] sm:px-8 lg:min-h-[calc(100svh-48px)] lg:px-10"
    >
      {/* 01 Aurora canvas (behind everything, non-interactive) */}
      <Aurora
        className="hero-aurora"
        colorStops={["#CCFF00", "#121212", "#CCFF00"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
      {/* Subtle readability mask — never opaque */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/10 to-charcoal/70"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-end pb-24 pt-28 lg:pb-28">
        <p data-hero-eyebrow className="label-lime">
          INDEPENDENT CREATIVE STUDIO — DUBAI
        </p>

        <h1 className="mt-5 font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-offwhite sm:mt-6">
          <span
            data-hero-line
            className="block overflow-hidden text-[clamp(2.6rem,7.5vw,5.9rem)]"
          >
            WE DESIGN
          </span>
          <span
            data-hero-line
            className="block overflow-hidden text-[clamp(2.6rem,7.5vw,5.9rem)]"
          >
            DIGITAL IDENTITIES
          </span>
          <span
            data-hero-line-single
            className="block overflow-hidden text-[clamp(2.6rem,7.5vw,5.9rem)]"
          >
            <ShinyText className="text-lime">THAT MOVE.</ShinyText>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 sm:mt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <p
            data-hero-support
            className="max-w-md text-base leading-relaxed text-softgray sm:text-lg"
          >
            Strategic branding, web design and digital creative
            <br className="hidden sm:block" /> for businesses that want to look clear, credible
            <br className="hidden sm:block" /> and built to grow.
          </p>

          <Link
            href="/#work"
            data-hero-cta
            onClick={handleCtaClick}
            className="group inline-flex w-fit items-center gap-3 border border-lime/70 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-lime transition-colors duration-300 hover:bg-lime hover:text-carbon"
          >
            VIEW SELECTED WORK
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-cue
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5"
      >
        <span className="label">SCROLL</span>
        <span className="block h-8 w-px overflow-hidden bg-white/15">
          <span className="cue-line block h-full w-full bg-lime" />
        </span>
      </div>
    </section>
  );
}
