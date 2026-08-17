"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionLabel from "./SectionLabel";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const PROCESS = [
  {
    number: "01",
    title: "DISCOVER",
    copy: "Understand the business, audience and objective.",
  },
  {
    number: "02",
    title: "DEFINE",
    copy: "Turn the strategy into a clear creative direction.",
  },
  {
    number: "03",
    title: "DESIGN",
    copy: "Build the identity, experience and content system.",
  },
  {
    number: "04",
    title: "DELIVER",
    copy: "Launch a consistent system ready for real-world use.",
  },
];

/**
 * 05 / PROCESS — number reveal, divider-line drawing, heading reveal and
 * copy fade per row. Deliberately NOT another pinned experience.
 */
export default function ProcessSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-process-row]"));
      rows.forEach((row) => {
        const num = row.querySelector("[data-process-num]");
        const title = row.querySelector("[data-process-title]");
        const copy = row.querySelector("[data-process-copy]");
        const line = row.querySelector("[data-process-line]");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            end: "top 45%",
            scrub: true,
          },
        });
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0).fromTo(
          num,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "none" },
          0,
        );
        if (title && copy) {
          tl.fromTo(
            title,
            { y: 24, opacity: 0.3 },
            { y: 0, opacity: 1, ease: "none" },
            0,
          ).fromTo(copy, { y: 12, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0);
        }
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section ref={rootRef} className="border-t border-white/[0.06] px-6 py-24 sm:px-8 lg:px-10 lg:py-36">
      <SectionLabel number="05" title="PROCESS" />

      <h2 className="mt-10 max-w-3xl text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-[-0.02em] text-offwhite">
        A clear process for work that lands.
      </h2>

      <ol className="mt-14 lg:mt-20">
        {PROCESS.map((step) => (
          <li
            key={step.number}
            data-process-row
            className="grid grid-cols-1 gap-4 border-t border-white/[0.08] py-10 md:grid-cols-12 md:gap-8 lg:py-14"
          >
            <div className="md:col-span-1">
              <span data-process-num className="label text-lime">
                {step.number}
              </span>
            </div>
            <div className="md:col-span-5">
              <h3
                data-process-title
                className="text-3xl font-medium uppercase tracking-tight text-offwhite sm:text-4xl lg:text-5xl"
              >
                {step.title}
              </h3>
            </div>
            <div className="md:col-span-5 md:col-start-7">
              <p data-process-copy className="max-w-sm text-base leading-relaxed text-softgray">
                {step.copy}
              </p>
            </div>
            <div className="hidden md:col-span-12 md:block">
              <div
                data-process-line
                className="h-px origin-left bg-lime/80"
                style={{ width: "100%" }}
              />
            </div>
          </li>
        ))}
        <li className="border-t border-white/[0.08]" aria-hidden="true" />
      </ol>
    </section>
  );
}
