"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/* ---------- types ---------- */

export interface ContainerScrollProps {
  /** Content rendered above the perspective card (title, metadata). */
  titleComponent: React.ReactNode;
  /** The card content (typically an image). */
  children: React.ReactNode;
  /** Optional custom scroll distance (unused now — viewport-driven). */
  scrollDistance?: number;
}

/* ---------- component ---------- */

export default function ContainerScroll({
  titleComponent,
  children,
}: ContainerScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const card = cardRef.current;
      const title = titleRef.current;
      const inner = innerRef.current;
      if (!wrapper || !card || !title || !inner) return;

      const isMobile =
        typeof window !== "undefined" && window.innerWidth < 768;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(card, { rotateX: 0, scale: 1 });
        gsap.set(title, { y: -60 });
        return;
      }

      // Initial states
      const startRotateX = isMobile ? 10 : 20;
      const startScale = isMobile ? 0.96 : 1.05;
      const titleYEnd = isMobile ? -25 : -70;

      gsap.set(card, { rotateX: startRotateX, scale: startScale });
      gsap.set(inner, { scale: isMobile ? 1.04 : 1.04 });
      gsap.set(title, { y: 0 });

      // NO PIN — natural viewport-driven scrub
      // Card enters viewport tilted, flattens as it passes through center
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top 85%",
        end: "bottom 20%",
        scrub: 0.8,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        animation: gsap
          .timeline()
          .to(card, {
            rotateX: 0,
            scale: 1,
            ease: "none",
          })
          .to(
            inner,
            {
              scale: 1,
              ease: "none",
            },
            0,
          )
          .to(
            title,
            {
              y: titleYEnd,
              ease: "none",
            },
            0,
          ),
      });
    },
    { scope: wrapperRef },
  );

  return (
    <div
      ref={wrapperRef}
      className="relative py-8 md:py-12"
    >
      <div
        className="w-full relative"
        style={{ perspective: "1000px" }}
      >
        {/* Title above card */}
        <div
          ref={titleRef}
          className="max-w-4xl mx-auto text-center mb-6 md:mb-10"
          style={{ willChange: "transform" }}
        >
          {titleComponent}
        </div>

        {/* Perspective card */}
        <div
          ref={cardRef}
          className="mx-auto w-full max-w-[1180px] rounded-[24px] md:rounded-[30px] border border-white/[0.08] bg-[#121212] p-2 md:p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div
            ref={innerRef}
            className="w-full overflow-hidden rounded-[16px] md:rounded-[20px] bg-[#0A0A0A]"
            style={{ willChange: "transform" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
