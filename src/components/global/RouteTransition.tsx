"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSite } from "./site-context";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * Internal route transition (~0.7s): Deep Charcoal wipe with a thin Neon
 * Lime edge, then the new page hero reveals. No blank pause, no white flash.
 * Runs only on client-side route changes (never on initial load).
 *
 * Positioning: when animating, GSAP alone controls the transform (never mixed
 * with a CSS `translate` utility); when reduced motion is active the overlay
 * stays hidden below the viewport via a class.
 */
export default function RouteTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);
  const { lenis } = useSite();
  const reduced = usePrefersReducedMotion();

  // Non-reduced: park the overlay below the viewport before any navigation.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || reduced) return;
    gsap.set(overlay, { yPercent: 100, visibility: "hidden" });
  }, [reduced]);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    const overlay = overlayRef.current;

    // Always reset scroll + refresh triggers, animated or not.
    const resetScroll = () => {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    };

    if (reduced || !overlay) {
      resetScroll();
      return;
    }

    const tl = gsap.timeline();
    tl.set(overlay, { visibility: "visible", yPercent: 100 })
      .to(overlay, { yPercent: 0, duration: 0.32, ease: "power4.inOut" })
      .add(() => resetScroll(), 0.34)
      .to(overlay, { yPercent: -100, duration: 0.38, ease: "power4.inOut" }, 0.36)
      .set(overlay, { visibility: "hidden" });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[50] bg-charcoal ${
        reduced ? "invisible translate-y-full" : "invisible"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-lime" />
    </div>
  );
}
