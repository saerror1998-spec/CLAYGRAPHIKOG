"use client";

import { useRef, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * 09 / CLIENT REVIEWS — two-row horizontal marquee.
 * Dark background. Flat 4:3 testimonial artwork cards.
 * Continuous seamless GSAP-driven horizontal motion.
 * No FlyingPosters. No pin. No 3D rotation.
 */

const testimonialImages = [
  "/images/testimonials/testimonial-01.jpg",
  "/images/testimonials/testimonial-02.jpg",
  "/images/testimonials/testimonial-03.jpg",
  "/images/testimonials/testimonial-04.jpg",
  "/images/testimonials/testimonial-05.jpg",
  "/images/testimonials/testimonial-06.jpg",
];

// Row 2 uses a different order for the staggered reference look
const row1Images = [...testimonialImages];
const row2Images = [
  testimonialImages[3],
  testimonialImages[4],
  testimonialImages[5],
  testimonialImages[0],
  testimonialImages[1],
  testimonialImages[2],
];

function MarqueeRow({
  images,
  speed,
  direction = "left",
  rowIndex,
  parentRef,
}: {
  images: string[];
  speed: number;
  direction?: "left" | "right";
  rowIndex: number;
  parentRef: React.RefObject<HTMLElement | null>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Duplicate items for seamless loop
    const items = track.querySelectorAll<HTMLElement>("[data-marquee-item]");
    if (items.length === 0) return;

    // Measure one set width
    const firstSet = Array.from(items).slice(0, images.length);
    const gap = 16; // gap-4
    const totalSetWidth = firstSet.reduce((acc, el) => acc + el.offsetWidth + gap, 0);

    const dir = direction === "left" ? -1 : 1;
    const tween = gsap.to(track, {
      x: dir * -totalSetWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const val = parseFloat(x);
          return val % totalSetWidth;
        }),
      },
    });

    // Pause marquee when entire section is offscreen
    const section = parentRef.current;
    let io: IntersectionObserver | null = null;
    if (section) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            tween.play();
          } else {
            tween.pause();
          }
        },
        { threshold: 0 },
      );
      io.observe(section);
    }

    return () => {
      tween.kill();
      io?.disconnect();
    };
  }, [images.length, speed, direction, parentRef]);

  // Double the items for seamless loop
  const doubled = [...images, ...images];

  return (
    <div className="overflow-hidden py-2" data-marquee-viewport={rowIndex}>
      <div
        ref={trackRef}
        className="flex gap-4"
        style={{ width: "max-content" }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${rowIndex}-${i}`}
            data-marquee-item
            className="shrink-0 overflow-hidden rounded-[6px] border border-white/[0.10]"
            style={{ width: "clamp(260px, 26vw, 360px)", aspectRatio: "4/3" }}
          >
            <img
              src={src}
              alt="Client testimonial"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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
      <div className="space-y-4">
        <MarqueeRow
          images={row1Images}
          speed={34}
          direction="left"
          rowIndex={0}
          parentRef={sectionRef}
        />
        <MarqueeRow
          images={row2Images}
          speed={40}
          direction="left"
          rowIndex={1}
          parentRef={sectionRef}
        />
      </div>

      {/* Bottom subtle divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
    </section>
  );
}
