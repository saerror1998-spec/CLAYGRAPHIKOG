"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import CurvedLoop from "@/components/ui/CurvedLoop";

/**
 * CurvedLoop section for the About page — sits between studio
 * positioning and principles. GSAP owns the wrapper entrance;
 * CurvedLoop owns its own textPath movement.
 */
export default function AboutCurvedLoop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div
      ref={rootRef}
      className="py-16 sm:py-20 lg:py-24"
      style={{ minHeight: reduced ? undefined : undefined }}
    >
      <CurvedLoop
        marqueeText="CLARITY \u2726 CRAFT \u2726 SYSTEMS \u2726 GROWTH \u2726 CLAY GRAPHIK \u2726"
        speed={1}
        curveAmount={260}
        direction="left"
        interactive
      />
    </div>
  );
}
