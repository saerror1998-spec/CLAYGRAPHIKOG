"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * Exactly ONE Lenis instance, driven by exactly ONE GSAP ticker callback.
 * No autoRaf, no duplicate raf loops, no ScrollSmoother.
 */
export default function SmoothScrollProvider({
  children,
  onReady,
}: {
  children: React.ReactNode;
  onReady?: (lenis: Lenis) => void;
}) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    onReady?.(lenis);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return <>{children}</>;
}
