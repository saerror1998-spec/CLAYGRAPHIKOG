"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSite } from "./site-context";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const COL_COUNT = 6;
const COL_COLORS = ["#121212", "#101010", "#0E0E0E", "#121212", "#101010", "#0E0E0E"];

/**
 * Column-wipe page transition — 6 vertical strips enter from the top with
 * right-to-left stagger (stair-step cover), route switches at full coverage,
 * then strips retract left-to-right to reveal the destination page.
 *
 * Coordinates with the underlay menu: when the menu is open the cover
 * animation starts ~150 ms after `closeMenu()` so both layers animate
 * simultaneously — the menu sliding right while columns wipe down from above.
 */
export default function ColumnPageTransition() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const mountedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { lenis } = useSite();
  const reduced = usePrefersReducedMotion();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Skip the very first pathname (initial render) — no transition on load.
  useEffect(() => {
    mountedRef.current = true;
  }, []);

  // Reduced-motion: ensure overlay is invisible.
  useEffect(() => {
    if (!reduced || !overlayRef.current) return;
    gsap.set(overlayRef.current, { visibility: "hidden" });
  }, [reduced]);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    const overlay = overlayRef.current;
    if (!overlay || reduced) {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
      return;
    }

    // Kill any in-flight transition.
    tlRef.current?.kill();

    const columns = Array.from(
      overlay.querySelectorAll<HTMLElement>("[data-col]"),
    );

    const resetScroll = () => {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    };

    // Phase 1 — COVER: columns scale from top, staggered right → left.
    // Phase 2 — hold briefly, reset scroll.
    // Phase 3 — REVEAL: columns scale to bottom, staggered left → right.
    const tl = gsap.timeline({
      onComplete: () => {
        tlRef.current = null;
        window.dispatchEvent(new CustomEvent("column-transition-done"));
      },
    });

    tlRef.current = tl;

    // Prepare: all columns hidden at top.
    tl.set(overlay, { visibility: "visible" });
    tl.set(columns, {
      scaleY: 0,
      transformOrigin: "top",
      willChange: "transform",
    });

    // Cover — right-to-left stagger (from: "end" = last column first).
    tl.to(columns, {
      scaleY: 1,
      duration: 0.52,
      ease: "power3.inOut",
      stagger: { each: 0.065, from: "end" },
    });

    // Scroll reset at ~70% of cover.
    tl.add(() => resetScroll(), "-=0.18");

    // Brief hold (~50 ms) then reveal.
    // Switch transform-origin to bottom for the retract.
    tl.set(columns, { transformOrigin: "bottom" });

    // Reveal — left-to-right stagger (from: "start" = first column first).
    tl.to(columns, {
      scaleY: 0,
      duration: 0.52,
      ease: "power3.inOut",
      stagger: { each: 0.065, from: "start" },
    });

    // Clean up.
    tl.set(overlay, { visibility: "hidden" });
    tl.set(columns, { clearProps: "willChange" });

    return () => {
      tl.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const overlayClass = reduced
    ? "invisible translate-y-full"
    : "invisible pointer-events-none";

  return (
    <div
      ref={overlayRef}
      data-page-transition
      aria-hidden="true"
      className={`fixed inset-0 z-[60] ${overlayClass}`}
    >
      {Array.from({ length: COL_COUNT }).map((_, i) => (
        <div
          key={i}
          data-col
          className="absolute top-0 h-full"
          style={{
            left: `calc(${i} * (100% / ${COL_COUNT}))`,
            width: `calc(100% / ${COL_COUNT} + 1px)`, // +1px overlap prevents subpixel seams
            backgroundColor: COL_COLORS[i],
          }}
        />
      ))}
    </div>
  );
}
