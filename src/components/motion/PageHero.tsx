"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import DiaHeroTextReveal from "./DiaHeroTextReveal";
import HeroThreadsBackground from "./HeroThreadsBackground";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Optional accent (rendered in Neon Lime at the end of the title). */
  titleAccent?: string;
  support?: string;
  children?: React.ReactNode;
}

/**
 * Shared page-hero motion vocabulary (family A — SplitText entrance):
 * eyebrow → SplitText title → support copy → divider. Every primary route
 * uses this so the motion language stays consistent.
 */
export default function PageHero({
  eyebrow,
  title,
  titleAccent,
  support,
  children,
}: PageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        root.querySelector("[data-ph-eyebrow]"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 },
        0.05,
      );
      /* Title handled by DiaHeroTextReveal — no SplitText needed. */
      tl.fromTo(
        root.querySelector("[data-ph-support]"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.55,
      );
      tl.fromTo(
        root.querySelector("[data-ph-divider]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
        0.7,
      );
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden px-6 pb-14 pt-32 sm:px-8 lg:px-10 lg:pb-20 lg:pt-44"
    >
      <HeroThreadsBackground />
      <div className="relative z-10">
      <p data-ph-eyebrow className="label-lime">
        {eyebrow}
      </p>
      <h1
        data-ph-title
        className="mt-6 text-[clamp(2.5rem,6.8vw,5.4rem)] font-semibold uppercase leading-[1.0] tracking-[-0.03em] text-offwhite"
      >
        <DiaHeroTextReveal>{title}</DiaHeroTextReveal>
        {titleAccent ? (
          <span className="block text-lime">
            <DiaHeroTextReveal delay={0.4}>{titleAccent}</DiaHeroTextReveal>
          </span>
        ) : null}
      </h1>
      {support ? (
        <p data-ph-support className="mt-8 max-w-xl text-base leading-relaxed text-softgray sm:text-lg">
          {support}
        </p>
      ) : null}
      <div data-ph-divider className="mt-10 h-px w-full origin-left bg-white/[0.08]" />
      {children}
      </div>
    </section>
  );
}
