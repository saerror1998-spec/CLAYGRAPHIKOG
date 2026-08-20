"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import CircularGallery from "@/components/ui/CircularGallery";
import ImageTrail from "@/components/ui/ImageTrail";
import { projects } from "@/data/projects";

const STUDIO_GALLERY = [
  { image: "/images/home/studio-gallery-01.jpg", text: "CLAY GRAPHIK" },
  { image: "/images/home/studio-gallery-02.jpg", text: "CLAY GRAPHIK" },
  { image: "/images/home/studio-gallery-03.jpg", text: "CLAY GRAPHIK" },
];

const TRAIL_IMAGES = [
  "/images/home/studio-gallery-01.jpg",
  "/images/home/studio-gallery-02.jpg",
  "/images/home/studio-gallery-03.jpg",
  "/images/home/home-project-branding.jpg",
  "/images/home/home-project-web.jpg",
  "/images/home/home-project-digital.jpg",
  "/images/home/home-service-creative.jpg",
  "/images/home/studio-gallery-01.jpg",
];

/**
 * 10 / STUDIO EXPERIENCE — CircularGallery + ImageTrail + masked typography.
 */
export default function HomeVisualGallery() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root) return;

      const reducedNow =
        reduced ||
        (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      if (reducedNow) return;

      // Picture stage — expansion from inset
      if (stage) {
        gsap.set(stage, {
          clipPath: "inset(8% 4% 8% 4%)",
          scale: 1.02,
        });

        gsap.to(stage, {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.8,
          },
        });
      }

      // Heading — masked reveal
      const heading = root.querySelector<HTMLElement>("[data-vis-heading]");
      const subtext = root.querySelector("[data-vis-subtext]");

      if (heading) {
        gsap.set(heading, { yPercent: 105 });
        gsap.to(heading, {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            end: "top 60%",
            scrub: 0.5,
          },
        });
      }

      if (subtext) {
        gsap.set(subtext, { opacity: 0, y: 20 });
        gsap.to(subtext, {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: subtext,
            start: "top 88%",
            end: "top 65%",
            scrub: 0.5,
          },
        });
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-carbon"
    >
      <p className="px-6 pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/40 lg:px-10">
        <span className="text-lime/60">10</span> / STUDIO EXPERIENCE
      </p>

      {/* CircularGallery — no clip-path, directly visible */}
      <div className="relative h-[55vh] sm:h-[65vh] lg:h-[70vh]">
        <CircularGallery
          items={STUDIO_GALLERY}
          bend={0.9}
          textColor="#F4F4EE"
          borderRadius={0.03}
          font="bold 30px 'Hanken Grotesk', sans-serif"
          scrollSpeed={1.2}
          scrollEase={0.06}
        />
      </div>

      {/* ImageTrail stage with expansion */}
      <div ref={stageRef} className="relative h-[55vh] sm:h-[65vh] lg:h-[65vh]">
        <ImageTrail items={TRAIL_IMAGES} threshold={95} />

        {/* Overlay typography — masked reveal */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="overflow-hidden">
            <h2
              data-vis-heading
              className="text-[clamp(2.8rem,8vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-offwhite mix-blend-difference"
            >
              CLAY
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2
              className="text-[clamp(2.8rem,8vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-offwhite mix-blend-difference"
            >
              GRAPHIK
            </h2>
          </div>
          <p
            data-vis-subtext
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/60 mix-blend-difference"
          >
            CREATIVE STUDIO — DUBAI, UAE
          </p>
        </div>
      </div>
    </section>
  );
}
