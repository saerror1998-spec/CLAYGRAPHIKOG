"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * Media clip reveal (motion family C): wrapper clip-path
 * inset(100% 0 0 0) → inset(0), inner image scale 1.07 → 1.
 * Scoped cleanup only.
 */
export default function MediaReveal({
  children,
  className = "",
  start = "top 82%",
  end = "top 38%",
}: {
  children: React.ReactNode;
  className?: string;
  start?: string;
  end?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const inner = innerRef.current;
      if (!root || !inner || reduced) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start, end, scrub: true },
      });

      tl.fromTo(
        root,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none" },
      ).fromTo(inner, { scale: 1.07 }, { scale: 1, ease: "none" }, 0);
    },
    { scope: rootRef, dependencies: [reduced, start, end] },
  );

  return (
    <div ref={rootRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
