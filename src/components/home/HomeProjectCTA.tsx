"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { waLink } from "@/data/siteContent";
import StarBorder from "@/components/ui/StarBorder";
import LiquidButton from "@/components/ui/LiquidButton";
import BackgroundBeamsWithCollision from "@/components/ui/BackgroundBeamsWithCollision";

/**
 * 08 / PROJECT CTA — image banner with clip-path expansion reveal
 * and masked typography.
 */
export default function HomeProjectCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const bg = bgRef.current;
      if (!root || !bg) return;

      const reducedNow =
        reduced ||
        (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      if (reducedNow) return;

      // Background image — clip-path expansion from inset(8% 8% 8% 8%)
      gsap.set(bg, {
        clipPath: "inset(10% 6% 10% 6%)",
        scale: 1.06,
      });

      gsap.to(bg, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          end: "top 30%",
          scrub: 0.8,
        },
      });

      // Content entrance
      const eyebrow = root.querySelector("[data-cta-eyebrow]");
      const headlineLines = Array.from(
        root.querySelectorAll<HTMLElement>("[data-cta-line]"),
      );
      const actions = root.querySelector("[data-cta-actions]");

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "top 25%",
          scrub: 0.6,
        },
      });

      if (eyebrow) {
        gsap.set(eyebrow, { opacity: 0, y: 14 });
        contentTl.to(eyebrow, { opacity: 1, y: 0, duration: 0.2, ease: "none" }, 0);
      }

      headlineLines.forEach((line, i) => {
        gsap.set(line, { yPercent: 105 });
        contentTl.to(line, { yPercent: 0, duration: 0.35, ease: "none" }, 0.05 + i * 0.1);
      });

      if (actions) {
        gsap.set(actions, { opacity: 0, y: 16 });
        contentTl.to(actions, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.4);
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-carbon px-6 py-32 sm:px-8 lg:px-10 lg:py-44"
    >
      <BackgroundBeamsWithCollision />
      {/* Background image with clip-path expansion */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(/images/home/home-project-cta.jpg)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-carbon/70 via-carbon/55 to-carbon/80"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/40">
          <span className="text-lime/60">08</span> / START A PROJECT
        </p>
        <p
          data-cta-eyebrow
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime"
        >
          HAVE A PROJECT IN MIND?
        </p>

        <h2 className="mt-8 text-[clamp(2.2rem,6vw,4.8rem)] font-semibold uppercase leading-[1.0] tracking-[-0.03em] text-offwhite">
          <span className="block overflow-hidden">
            <span data-cta-line className="block">LET&apos;S BUILD</span>
          </span>
          <span className="block overflow-hidden">
            <span data-cta-line className="block">SOMETHING</span>
          </span>
          <span className="block overflow-hidden">
            <span data-cta-line className="block text-lime">WORTH NOTICING.</span>
          </span>
        </h2>

        <div
          data-cta-actions
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <StarBorder as="div" className="inline-block" style={{ padding: 0 }}>
            <LiquidButton
              as={Link}
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
            >
              START A PROJECT
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </LiquidButton>
          </StarBorder>
          <Link
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border border-white/15 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-offwhite transition-colors duration-300 hover:border-lime hover:text-lime"
          >
            LET&apos;S TALK ON WHATSAPP
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
