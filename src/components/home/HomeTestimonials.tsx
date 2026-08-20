"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import Marquee from "@/components/ui/Marquee";

/**
 * 09 / CLIENT REVIEWS — two-row CSS marquee.
 * Dark background. Flat 4:3 testimonial artwork cards.
 * Pure CSS animation via @keyframes marquee-x.
 * No GSAP marquee. No FlyingPosters. No 3D rotation.
 */

const testimonialImages = [
  "/images/testimonials/testimonial-01.jpg",
  "/images/testimonials/testimonial-02.jpg",
  "/images/testimonials/testimonial-03.jpg",
  "/images/testimonials/testimonial-04.jpg",
  "/images/testimonials/testimonial-05.jpg",
  "/images/testimonials/testimonial-06.jpg",
];

// Row 2 uses a different order for staggered visual rhythm
const row1Images = [...testimonialImages];
const row2Images = [
  testimonialImages[3],
  testimonialImages[4],
  testimonialImages[5],
  testimonialImages[0],
  testimonialImages[1],
  testimonialImages[2],
];

function TestimonialCard({ src, index }: { src: string; index: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-[6px] border border-white/[0.10]"
      style={{ width: "clamp(260px, 26vw, 360px)", aspectRatio: "4/3" }}
    >
      <img
        src={src}
        alt={`Client testimonial ${index + 1}`}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  // IntersectionObserver: pause marquee when section is offscreen
  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    setIsPaused(!entry.isIntersecting);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(handleIntersection, {
      threshold: 0,
      rootMargin: "200px 0px",
    });
    io.observe(section);
    return () => io.disconnect();
  }, [handleIntersection]);

  // Heading entrance animation (GSAP only for the heading — marquee is pure CSS)
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const lines = [line1Ref.current, line2Ref.current].filter(Boolean);

      lines.forEach((line, i) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { yPercent: 105 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              end: "top 60%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.08,
          },
        );
      });

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] pt-24 pb-20 md:pt-32 md:pb-28"
    >
      {/* Top subtle divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Section label */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-6 md:mb-8">
        <p className="label">
          <span className="text-lime">09</span>{" "}
          <span className="text-softgray">/ CLIENT REVIEWS</span>
        </p>
      </div>

      {/* Centered heading */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center mb-3 md:mb-4">
        <div className="overflow-hidden">
          <div ref={line1Ref}>
            <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] font-bold leading-[1.08] text-offwhite tracking-tight">
              REAL FEEDBACK FROM
            </h2>
          </div>
        </div>
        <div className="overflow-hidden">
          <div ref={line2Ref}>
            <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] font-bold leading-[1.08] text-offwhite tracking-tight">
              OUR HAPPY CLIENTS
            </h2>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center mb-10 md:mb-14 text-sm md:text-base text-softgray/70"
      >
        What our clients say about working with Clay Graphik.
      </p>

      {/* Marquee rows */}
      <div
        className={`flex flex-col gap-3 md:gap-4 ${isPaused ? "marquee-paused" : ""}`}
      >
        {/* Row 1 — normal direction, 12s */}
        <Marquee
          repeat={3}
          pauseOnHover
          applyMask
          style={{ ["--duration" as string]: "12s" }}
        >
          {row1Images.map((src, i) => (
            <TestimonialCard key={`r1-${i}`} src={src} index={i} />
          ))}
        </Marquee>

        {/* Row 2 — same direction, phase-shifted via animation-delay, 12s */}
        <Marquee
          repeat={3}
          pauseOnHover
          applyMask
          style={{ ["--duration" as string]: "12s" }}
        >
          {row2Images.map((src, i) => (
            <TestimonialCard key={`r2-${i}`} src={src} index={i} />
          ))}
        </Marquee>
      </div>

      {/* Bottom subtle divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
    </section>
  );
}
