"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import StackedSections from "@/components/ui/StackedSections";

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
 * 06 / SOLUTIONS — stacked card sections
 * - Heading appears first (outside the stack)
 * - Four solution cards stack via StackedSections
 * - Each card has: number, title, tags, copy, image, CTA
 * - Cards stack with ~48px peek strips showing previous titles
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

      // --- Section heading entrance ---
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

      if (solidLine) {
        gsap.set(solidLine, { yPercent: 105 });
        entranceTl.to(solidLine, { yPercent: 0, duration: 0.4, ease: "none" }, 0.05);
      }

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
        06 / SOLUTIONS
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

      {/* Stacked solution cards */}
      <div className="mt-20">
        <StackedSections
          withDramaEffect
          stackOffset={48}
          cardHeight="66vh"
          className="w-full"
          cardClassName="w-full rounded-2xl border border-[#050505]/10 bg-offwhite shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
        >
          {SOLUTIONS.map((sol) => (
            <SolutionCard key={sol.title} sol={sol} />
          ))}
        </StackedSections>
      </div>
    </section>
  );
}

function SolutionCard({
  sol,
}: {
  sol: (typeof SOLUTIONS)[number];
}) {
  const imageSrc = SOLUTION_IMAGES[sol.serviceSlug] || "";

  return (
    <article className="group">
      {/* Card header strip — visible when stacked behind */}
      <div className="flex items-center gap-3 border-b border-[#050505]/8 px-6 py-4 lg:px-10 lg:py-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#CCFF00]">
          {sol.number}
        </span>
        <h3 className="text-[clamp(0.95rem,1.6vw,1.25rem)] font-semibold uppercase tracking-tight text-[#050505]">
          {sol.title}
        </h3>
      </div>

      {/* Card body */}
      <div className="grid grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12 lg:items-start lg:gap-12 lg:px-10 lg:py-12">
        {/* Left: tags */}
        <div className="lg:col-span-3">
          <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
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

        {/* Middle: description */}
        <div className="lg:col-span-5">
          <p className="text-base leading-relaxed text-[#050505]/60">
            {sol.copy}
          </p>
        </div>

        {/* Right: image + CTA */}
        <div className="lg:col-span-4">
          {imageSrc && (
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#050505]/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={sol.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#050505] transition-colors hover:text-[#CCFF00]">
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
}
