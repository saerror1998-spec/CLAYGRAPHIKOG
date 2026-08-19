"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * ImageTrail — images appear around pointer movement.
 * Desktop fine pointer only.
 * Simple: one useEffect, one window mousemove listener.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __TRAIL_CLEANUP: unique symbol;

interface TrailContainer extends HTMLDivElement {
  [key: symbol]: (() => void) | undefined;
}

export default function ImageTrail({
  items,
  threshold = 90,
}: {
  items: string[];
  threshold?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Copy ref for cleanup safety
    const container = containerRef.current;
    if (!container) return;

    let cleanupFn: (() => void) | null = null;

    // Delay setup slightly to ensure DOM is fully painted
    const timer = setTimeout(() => {
      const imgEls = Array.from(container.querySelectorAll<HTMLElement>(".trail-img"));
      if (imgEls.length === 0) return;

      let imgIndex = -1;
      let lastX = 0;
      let lastY = 0;
      let initialized = false;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!initialized) {
          lastX = x;
          lastY = y;
          initialized = true;
          return;
        }

        const dx = x - lastX;
        const dy = y - lastY;
        if (Math.sqrt(dx * dx + dy * dy) < threshold) return;

        imgIndex = (imgIndex + 1) % imgEls.length;
        const el = imgEls[imgIndex];
        const w = el.offsetWidth || 180;
        const h = el.offsetHeight || 225;

        gsap.killTweensOf(el);
        gsap.set(el, { left: x - w / 2, top: y - h / 2, opacity: 0, scale: 0.85 });
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(el, { opacity: 0, scale: 0.3, y: "-=50", duration: 0.8, ease: "power3.in" });
          },
        });

        lastX = x;
        lastY = y;
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });

      cleanupFn = () => {
        window.removeEventListener("mousemove", onMouseMove);
        imgEls.forEach((el) => gsap.killTweensOf(el));
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanupFn) cleanupFn();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, threshold]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    >
      {items.map((url, i) => (
        <div
          key={i}
          className="trail-img"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "clamp(150px, 14vw, 210px)",
            aspectRatio: "4 / 5",
            borderRadius: "12px",
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
            willChange: "transform, opacity",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}
