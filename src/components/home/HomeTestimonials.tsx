"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import FlyingPosters from "@/components/ui/FlyingPosters";

const testimonialImages = [
  "/images/testimonials/testimonial-01.jpg",
  "/images/testimonials/testimonial-02.jpg",
  "/images/testimonials/testimonial-03.jpg",
  "/images/testimonials/testimonial-04.jpg",
  "/images/testimonials/testimonial-05.jpg",
  "/images/testimonials/testimonial-06.jpg",
];

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
              start: "top 88%",
              end: "top 55%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-offwhite pt-16 pb-10 md:pt-24 md:pb-16 overflow-hidden"
    >
      {/* Section label */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-8 md:mb-14">
        <p className="label">
          <span className="text-lime">09</span>{" "}
          <span className="text-softgray">/ CLIENT REVIEWS</span>
        </p>
      </div>

      {/* Heading */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-6 md:mb-8">
        <div className="overflow-hidden">
          <div ref={line1Ref}>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.8rem)] font-bold leading-[1.05] text-carbon tracking-tight">
              REAL FEEDBACK FROM
            </h2>
          </div>
        </div>
        <div className="overflow-hidden">
          <div ref={line2Ref}>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.8rem)] font-bold leading-[1.05] text-carbon tracking-tight">
              OUR HAPPY CLIENTS
            </h2>
          </div>
        </div>
      </div>

      {/* Flying Posters Stage — responsive sizing */}
      <div
        className="w-full"
        style={{ height: isMobile ? "clamp(340px, 55vh, 500px)" : "clamp(500px, 70vh, 650px)" }}
      >
        <FlyingPosters
          items={testimonialImages}
          planeWidth={isMobile ? 280 : 560}
          planeHeight={isMobile ? 210 : 420}
          distortion={isMobile ? 1.0 : 1.5}
          scrollEase={0.04}
          cameraFov={44}
          cameraZ={isMobile ? 18 : 21}
          maxRotation={isMobile ? Math.PI * 0.28 : Math.PI * 0.42}
        />
      </div>
    </section>
  );
}
