"use client";

import ScrollReveal from "@/components/motion/ScrollReveal";
import SectionLabel from "./SectionLabel";
import { whatWeDoCopy } from "@/data/siteContent";

/**
 * 01 / WHAT WE DO — the statement resolves word-by-word (opacity, blur,
 * small rotation) scrubbed to scroll, per the reference ScrollReveal.
 */
export default function WhatWeDo() {
  return (
    <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-36">
      <div className="max-w-5xl">
        <SectionLabel number="01" title="WHAT WE DO" />

        <h2 className="mt-10 text-[clamp(1.9rem,4.6vw,3.6rem)] font-medium uppercase leading-[1.04] tracking-[-0.02em] text-offwhite">
          <ScrollReveal
            baseOpacity={0.15}
            blurStrength={4}
            baseRotation={2}
            className="inline"
          >
            {whatWeDoCopy.headline}
          </ScrollReveal>
        </h2>

        <p className="mt-12 max-w-xl text-base leading-relaxed text-softgray sm:text-lg">
          {whatWeDoCopy.support}
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-softgray/70 sm:text-lg">
          {whatWeDoCopy.secondary}
        </p>
      </div>
    </section>
  );
}
