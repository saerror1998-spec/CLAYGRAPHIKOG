"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import Aurora from "@/components/motion/Aurora";
import ShinyText from "@/components/motion/ShinyText";
import { useSite } from "@/components/global/site-context";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { ctas, heroCopy } from "@/data/siteContent";

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

      // IMPORTANT: split each WHITE line individually — never the <h1> as a
      // whole, because that would also SplitText the ShinyText span (breaking
      // its background-clip and collapsing THAT MOVE. to a zero-size block).
      // ShinyText owns the gradient; GSAP owns the line wrappers.
      const lineEls = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-line]"));
      const splits: SplitText[] = [];
      const lineGroups: HTMLElement[][] = [];
      lineEls.forEach((line) => {
        let split: SplitText | null = null;
        try {
          split = new SplitText(line, {
            type: "chars",
            charsClass: "split-char",
            reduceWhiteSpace: false,
          });
        } catch {
          split = null;
        }
        if (split) {
          splits.push(split);
          lineGroups.push(Array.from(split.chars as HTMLElement[]));
        } else {
          lineGroups.push([]);
        }
      });
      const singleLine = root.querySelector<HTMLElement>("[data-hero-line-single]");

      const eyebrow = root.querySelector("[data-hero-eyebrow]");
      const support = root.querySelector("[data-hero-support]");
      const cta = root.querySelector("[data-hero-cta]");
      const secondary = root.querySelector("[data-hero-secondary]");
      const cue = root.querySelector("[data-hero-cue]");

      // One master timeline — the ENTIRE entrance completes ~1.7s after the
      // loader reveals the stage. Never paused by scroll: it is time-based
      // (no ScrollTrigger), so scrolling away mid-entrance cannot stall it.
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 01 eyebrow
      tl.fromTo(
        eyebrow,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.05,
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
            duration: 0.7,
            stagger: 0.025,
          },
          i === 0 ? 0.15 : 0.45,
        );
      });

      // 04 — THAT MOVE. (lime, shine handled by CSS after entrance).
      // GSAP animates ONLY the wrapper (transform + opacity); the ShinyText
      // span inside is never touched by GSAP.
      tl.fromTo(
        singleLine,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          onComplete: () => gsap.set(singleLine, { clearProps: "transform" }),
        },
        0.9,
      );

      // 05 support copy
      tl.fromTo(
        support,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        1.15,
      );

      // 06 CTA (+ secondary START A PROJECT link)
      tl.fromTo(
        cta,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        1.25,
      );
      tl.fromTo(
        secondary,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        1.35,
      );

      // 07 scroll cue
      tl.fromTo(cue, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.35);

      // 08 shine sweep — first sweep ~0.3s after THAT MOVE. settles
      tl.add(() => {
        root.querySelector("[data-shine]")?.classList.add("shine-active");
      }, 1.95);

      return () => {
        splits.forEach((s) => s.revert());
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
      {/* Subtle readability mask — max ~20% at the top, ~55% only at the
          very bottom edge. Never opaque, never buries the aurora. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal/55"
      />
      {/* Localized top treatment — keeps the logo/eyebrow readable when the
          aurora's lime band is brightest at the top, without a heavy global
          overlay: ~65% charcoal fading out by 40% of the hero height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-charcoal/65 via-charcoal/25 to-transparent"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-end pb-24 pt-28 lg:pb-28">
        <p data-hero-eyebrow className="label-lime">
          {heroCopy.eyebrow}
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
            className="that-move-motion-wrapper block overflow-hidden text-[clamp(2.6rem,7.5vw,5.9rem)]"
          >
            <ShinyText className="text-lime">THAT MOVE.</ShinyText>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 sm:mt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <p
            data-hero-support
            className="max-w-md text-base leading-relaxed text-softgray sm:text-lg"
          >
            {heroCopy.support}
          </p>

          <div className="flex flex-col items-start gap-6">
            <Link
              href="/#work"
              data-hero-cta
              onClick={handleCtaClick}
              className="group inline-flex w-fit items-center gap-3 border border-lime/70 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-lime transition-colors duration-300 hover:bg-lime hover:text-carbon"
            >
              {ctas.viewSelectedWork}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/contact"
              data-hero-secondary
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-softgray transition-colors duration-300 hover:text-lime"
            >
              {ctas.startProject}
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
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
