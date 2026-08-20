"use client";

import { useEffect, useRef, memo, useCallback, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import BackgroundBeamsWithCollision from "@/components/ui/BackgroundBeamsWithCollision";

const CAPABILITIES = [
  "BRAND STRATEGY",
  "IDENTITY",
  "WEB DESIGN",
  "UX",
  "CONTENT",
  "CREATIVE DIRECTION",
  "DIGITAL PRODUCTS",
];

const SPEED = 45;
const HOVER_SPEED = 12;
const SMOOTH_TAU = 0.25;

function useAnimationLoop(
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
) {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth <= 0) return;

    offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered ? HOVER_SPEED : targetVelocity;
      const easingFactor = 1 - Math.exp(-deltaTime / SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
      nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
      offsetRef.current = nextOffset;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, trackRef]);
}

export default memo(function HomeBrandLoop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const reduced = usePrefersReducedMotion();

  const updateDimensions = useCallback(() => {
    if (seqRef.current) {
      const rect = seqRef.current.getBoundingClientRect();
      if (rect.width > 0) setSeqWidth(Math.ceil(rect.width));
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (seqRef.current) observer.observe(seqRef.current);
    return () => observer.disconnect();
  }, [updateDimensions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(container);
    return () => io.disconnect();
  }, []);

  // Clip-path mask opening entrance
  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      if (!wrapper || reduced) return;

      gsap.set(wrapper, { clipPath: "inset(0 100% 0 0)" });

      gsap.to(wrapper, {
        clipPath: "inset(0 0% 0 0)",
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          end: "top 55%",
          scrub: 0.6,
        },
      });
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  useAnimationLoop(trackRef, isVisible ? SPEED : 0, seqWidth, isHovered);

  const items = CAPABILITIES.flatMap((cap, i) => [
    { text: cap, key: `a-${i}` },
    { text: "✦", key: `sep-a-${i}`, isSep: true },
  ]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-y border-white/[0.06] bg-charcoal px-6 py-16 sm:px-8 lg:px-10 lg:py-20"
    >
      <BackgroundBeamsWithCollision />
      <div className="relative z-10">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/40">
        <span className="text-lime/60">05</span> / CAPABILITIES
      </p>
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/40">
        OUR CAPABILITIES
      </p>
      <div
        ref={wrapperRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "grab" }}
      >
        <div ref={trackRef} className="flex whitespace-nowrap">
          {[0, 1, 2].map((copyIndex) => (
            <ul
              key={copyIndex}
              ref={copyIndex === 0 ? seqRef : undefined}
              className="flex items-center gap-0 shrink-0"
              role="list"
              aria-hidden={copyIndex > 0}
            >
              {items.map((item) => (
                <li key={`${copyIndex}-${item.key}`} className="shrink-0 px-6" role="listitem">
                  {item.isSep ? (
                    <span className="text-lg text-lime/60">✦</span>
                  ) : (
                    <span className="text-[clamp(1.2rem,2.5vw,2rem)] font-semibold uppercase tracking-[-0.01em] text-offwhite/80">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
});
